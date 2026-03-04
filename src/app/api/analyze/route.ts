import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Mock AI Diseases for the demonstration
const DISEASES = [
    { name: 'Early Blight', confidenceBase: 85, severity: 'High', yieldEffect: '15-20%' },
    { name: 'Late Blight', confidenceBase: 90, severity: 'Critical', yieldEffect: '30-40%' },
    { name: 'Leaf Rust', confidenceBase: 80, severity: 'Medium', yieldEffect: '10-15%' },
    { name: 'Healthy', confidenceBase: 95, severity: 'None', yieldEffect: '0%' },
    { name: 'Powdery Mildew', confidenceBase: 75, severity: 'Medium', yieldEffect: '5-10%' }
];

export async function POST(request: Request) {
    try {
        const payload = await request.json();

        // Extracted payload fields
        // { cropName, acreOfLand, leafEdgeCondition, leafColor, spotsOnLeaf, texture, imageUrl }

        // 1. Simulate AI Processing timeout
        await new Promise((resolve) => setTimeout(resolve, 2500));

        // 2. Mock AI Logic: pick a random disease, but skew towards healthy if 'green/smooth'
        let selectedDisease = DISEASES[0];
        if (payload.leafColor === 'green' && payload.leafEdgeCondition === 'smooth' && payload.spotsOnLeaf === 'none') {
            selectedDisease = DISEASES.find(d => d.name === 'Healthy') || DISEASES[3];
        } else {
            // Pick random disease excluding healthy if there are bad symptoms
            const badDiseases = DISEASES.filter(d => d.name !== 'Healthy');
            selectedDisease = badDiseases[Math.floor(Math.random() * badDiseases.length)];
        }

        // Generate a confidence score +/- 5 from base
        const confidenceScore = Math.min(
            99.9,
            Number((selectedDisease.confidenceBase + (Math.random() * 10 - 5)).toFixed(1))
        );

        // 3. Prepare Database Row Payload
        const dbPayload = {
            crop_name: payload.cropName,
            acre_of_land: payload.acreOfLand,
            image_url: payload.imageUrl,
            leaf_edge_condition: payload.leafEdgeCondition,
            leaf_color: payload.leafColor,
            spots_on_leaf: payload.spotsOnLeaf,
            texture: payload.texture,
            disease_name: selectedDisease.name,
            yield_effect: selectedDisease.yieldEffect,
            confidence_score: confidenceScore,
            severity: selectedDisease.severity
        };

        // 4. Insert into Supabase (will fail gracefully locally if no real DB connected yet, falling back to mock ID)
        let recordId = Math.random().toString(36).substring(2, 11);

        const { data: insertedData, error } = await supabase
            .from('crop_scans')
            .insert([dbPayload])
            .select('id')
            .single();

        if (!error && insertedData) {
            recordId = insertedData.id;
        } else {
            console.warn("Supabase insertion skipped or failed (likely local mock execution).", error?.message);
        }

        // 5. Return success payload
        return NextResponse.json({
            success: true,
            id: recordId,
            analysis: {
                disease: selectedDisease.name,
                confidence: confidenceScore,
                severity: selectedDisease.severity
            }
        });

    } catch (error: any) {
        console.error("Analysis API Error:", error);
        return NextResponse.json(
            { error: "Failed to perform AI analysis", details: error.message },
            { status: 500 }
        );
    }
}
