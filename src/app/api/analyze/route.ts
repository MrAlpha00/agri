import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import * as tf from '@tensorflow/tfjs';
import sharp from 'sharp';

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
        // 1. Download image
        const response = await fetch(imageUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
        }
        const arrayBuffer = await response.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Process image with sharp (handles WebP, JPEG, PNG, etc.)
        const width = 224;
        const height = 224;
        const numChannels = 3; // MobileNet expects RGB

        const processedBuffer = await sharp(buffer)
            .resize(width, height)
            .removeAlpha() // Ensure we only have RGB channels, removing any transparency
            .raw()
            .toBuffer();

        // 3. Preprocess image buffer into a Float32Array tensor
        const values = new Float32Array(width * height * numChannels);
        for (let i = 0; i < processedBuffer.length; i++) {
            // Normalize pixels to [0, 1] for MobileNet
            values[i] = processedBuffer[i] / 255.0;
        }

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
