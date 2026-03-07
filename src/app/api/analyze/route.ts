import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import * as tf from '@tensorflow/tfjs';
import { Jimp } from 'jimp';

const CLASSES = [
    { name: 'Rice Blast', severity: 'High' },
    { name: 'Brown Spot', severity: 'Medium' },
    { name: 'Bacterial Leaf Blight', severity: 'High' },
    { name: 'Tungro', severity: 'High' },
    { name: 'Healthy', severity: 'None' }
];

let cachedModel: tf.LayersModel | null = null;
async function getModel() {
    if (!cachedModel) {
        // Construct the absolute URL based on the Vercel request or standard local hostname
        const baseUrl = process.env.VERCEL_URL
            ? `https://${process.env.VERCEL_URL}`
            : 'http://localhost:3000';
        const modelUrl = `${baseUrl}/model/model.json`;
        console.log("Loading MobileNet transfer model from", modelUrl);
        cachedModel = await tf.loadLayersModel(modelUrl);
    }
    return cachedModel;
}

/**
 * Local prediction function using TensorFlow.js and Jimp.
 */
async function predictDisease(imageUrl: string, requestedCrop: string) {
    await tf.ready();
    let crop = requestedCrop || 'Unknown Crop';
    console.log(`[TFJS Inference] Processing uploaded image from Supabase Storage: ${imageUrl}`);

    try {
        // 1. Download and decode image using Jimp
        // We use Jimp because native canvas bindings fail in some serverless environments
        const image = await Jimp.read(imageUrl);
        image.resize({ w: 224, h: 224 }); // MobileNet expects 224x224

        // 2. Preprocess image into a tensor
        // Create an array of shape [1, 224, 224, 3]
        const numChannels = 3;
        const width = 224;
        const height = 224;
        const values = new Float32Array(width * height * numChannels);

        let i = 0;
        image.scan(0, 0, width, height, (x: number, y: number, idx: number) => {
            // Normalize pixels to [0, 1] for MobileNet
            values[i * 3 + 0] = image.bitmap.data[idx + 0] / 255.0;     // R
            values[i * 3 + 1] = image.bitmap.data[idx + 1] / 255.0;     // G
            values[i * 3 + 2] = image.bitmap.data[idx + 2] / 255.0;     // B
            i++;
        });

        const imageTensor = tf.tensor4d(values, [1, height, width, numChannels]);

        // 3. Load Model and Predict
        const model = await getModel();
        const predictionTensor = model.predict(imageTensor) as tf.Tensor;
        const probabilities = await predictionTensor.data();

        // Memory cleanup
        imageTensor.dispose();
        predictionTensor.dispose();

        // 4. Find the highest confidence class
        let maxIdx = 0;
        let maxProb = probabilities[0];
        for (let i = 1; i < probabilities.length; i++) {
            if (probabilities[i] > maxProb) {
                maxProb = probabilities[i];
                maxIdx = i;
            }
        }

        const confidence = Number(maxProb.toFixed(4));
        const selectedDisease = CLASSES[maxIdx];

        // 5. Apply the 75% Confidence Threshold constraint
        if (confidence < 0.75) {
            return {
                crop,
                disease: "Model uncertain. Please upload a clearer image.",
                confidence,
                severity: "None"
            };
        }

        return {
            crop,
            disease: selectedDisease.name,
            confidence,
            severity: selectedDisease.severity
        };
    } catch (err: any) {
        console.error("Prediction preprocessing or execution failed:", err.message);
        // Fallback or re-throw
        throw new Error("Unable to run model analysis on the provided image");
    }
}

export async function POST(request: Request) {
    try {
        const payload = await request.json();
        const { cropName, imageUrl } = payload;

        // 1. Run inference completely locally using TFJS model
        const prediction = await predictDisease(imageUrl || '', cropName);

        // 2. Prepare Database Payload
        const dbPayload = {
            crop: prediction.crop,
            disease: prediction.disease,
            confidence: prediction.confidence,
            severity: prediction.severity,
            image_url: imageUrl || null
        };

        // 3. Insert into the `predictions` table in Supabase
        let recordId = Math.random().toString(36).substring(2, 11);

        const { data: insertedData, error } = await supabase
            .from('predictions')
            .insert([dbPayload])
            .select('id')
            .single();

        if (!error && insertedData) {
            recordId = insertedData.id;
            console.log("Prediction stored in DB:", recordId);
        } else if (error) {
            console.error("Database storage failed. Ensure the 'predictions' table exists.", error?.message);
        }

        // 4. Return success payload matching UI expectations
        const resultPayload = {
            id: recordId,
            crop: prediction.crop,
            disease: prediction.disease,
            confidence: prediction.confidence,
            severity: prediction.severity,
            imageUrl: imageUrl || null
        };

        return NextResponse.json(resultPayload);

    } catch (error: any) {
        console.error("Analysis API Error:", error);
        return NextResponse.json(
            { error: "Failed to perform local AI analysis", details: error.message },
            { status: 500 }
        );
    }
}
