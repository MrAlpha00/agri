export interface DiseaseRecommendation {
    symptoms: string;
    recommendedPesticide: string;
    treatmentSteps: string[];
    preventionTips: string[];
    estimatedYieldLoss: string;
}

export function getRecommendations(
    crop: string,
    disease: string,
    severity: string
): DiseaseRecommendation {
    const isHealthy = severity === "None" || disease.toLowerCase().includes("healthy");

    if (isHealthy) {
        return {
            symptoms: "No visible symptoms detected. The plant appears to be in good health.",
            recommendedPesticide: "None required.",
            treatmentSteps: [
                "Continue current watering schedule.",
                "Maintain appropriate fertilizer application.",
                "Monitor regularly for any sudden changes."
            ],
            preventionTips: [
                "Ensure good soil drainage.",
                "Practice crop rotation.",
                "Keep the area free of weeds and debris."
            ],
            estimatedYieldLoss: "0%"
        };
    }

    // Base mock logic parameterized by severity
    const yieldLoss =
        severity === "High" ? "20-40%" :
            severity === "Medium" ? "5-15%" :
                "0-5%";

    const isBlight = disease.toLowerCase().includes("blight");
    const isRust = disease.toLowerCase().includes("rust");
    const isMildew = disease.toLowerCase().includes("mildew");
    const isSpot = disease.toLowerCase().includes("spot");

    let symptoms = `Typical symptoms of ${disease} on ${crop} include discoloration, lesions, or unusual growth patterns.`;
    let recommendedPesticide = `Broad-spectrum fungicide suitable for ${crop}`;
    let treatmentSteps = [
        `Isolate severely infected ${crop} plants.`,
        `Apply ${recommendedPesticide} following manufacturer instructions.`,
        `Re-evaluate in 7 days.`
    ];
    let preventionTips = [
        "Ensure adequate spacing between plants for airflow.",
        "Avoid overhead watering to keep foliage dry.",
        "Clean garden tools after use."
    ];

    if (isBlight) {
        symptoms = `Dark, concentric rings or water-soaked lesions on the lower leaves of the ${crop}, eventually causing leaves to yellow and drop.`;
        recommendedPesticide = `Chlorothalonil, Mancozeb, or Copper-based fungicides`;
        treatmentSteps = [
            "Remove and destroy heavily blighted leaves immediately.",
            `Apply ${recommendedPesticide} at the first sign of disease.`,
            "Spray every 7-10 days depending on weather (shorter intervals in wet conditions).",
            "Ensure thorough coverage of both upper and lower leaf surfaces."
        ];
        preventionTips = [
            "Water early in the day at the base of the plant.",
            "Apply mulch to prevent soil splashing onto leaves.",
            "Rotate crops and do not plant related crops in the same area for 3-4 years."
        ];
    } else if (isRust) {
        symptoms = `Small, raised, orange, rust-colored, or brown pustules on the undersides of the ${crop} leaves.`;
        recommendedPesticide = `Myclobutanil, Propiconazole, or Sulfur-based sprays`;
        treatmentSteps = [
            "Prune affected leaves to stop the spread of spores.",
            `Apply a systemic fungicide like ${recommendedPesticide}.`,
            "Rake up and dispose of infected fallen leaves."
        ];
    } else if (isMildew) {
        symptoms = `White, powdery fungal growth on the upper surfaces of the ${crop} leaves, often causing leaves to distort or curl.`;
        recommendedPesticide = `Potassium Bicarbonate, Neem Oil, or Sulfur fungicides`;
        treatmentSteps = [
            "Prune heavily infected parts to improve airflow.",
            `Thoroughly spray the plant with ${recommendedPesticide}.`,
            "Repeat treatment every 7-14 days until symptoms subside."
        ];
        preventionTips = [
            "Plant in areas with full, direct sunlight.",
            "Avoid excess nitrogen fertilizer, which encourages lush, susceptible growth.",
            "Consider planting mildew-resistant varieties."
        ];
    } else if (isSpot) {
        symptoms = `Small, circular, dark spots on the foliage, which may enlarge and form yellow halos.`;
        recommendedPesticide = `Copper Fungicide or Bacillus subtilis (Organic)`;
        treatmentSteps = [
            "Remove diseased leaves carefully to avoid shaking spores.",
            `Treat with ${recommendedPesticide}.`
        ];
    }

    // Adjust aggressiveness based on severity
    if (severity === "High") {
        treatmentSteps.unshift(`URGENT: Immediately cull parts of the ${crop} that are heavily diseased to save the rest of the crop.`);
        if (!treatmentSteps.join(" ").includes("Chemical")) {
            treatmentSteps.push("Consider strong chemical intervention if organic methods fail to halt the rapid spread.");
        }
    }

    return {
        symptoms,
        recommendedPesticide,
        treatmentSteps,
        preventionTips,
        estimatedYieldLoss: yieldLoss
    };
}
