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
    let yieldLoss = severity === "High" ? "20-40%" : severity === "Medium" ? "5-15%" : "0-5%";
    const diseaseNameLower = disease.toLowerCase();

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

    if (diseaseNameLower.includes("blast")) {
        yieldLoss = severity === "High" ? "30-50%" : severity === "Medium" ? "10-25%" : "5-10%";
        symptoms = `Diamond-shaped lesions on leaves with gray or white centers and brown margins. Affects leaves, nodes, and panicles.`;
        recommendedPesticide = `Tricyclazole or Propiconazole-based fungicides`;
        treatmentSteps = [
            "Apply fungicides immediately upon seeing blast lesions.",
            "Avoid excessive nitrogen application which encourages blast.",
            "Maintain proper water levels in the field."
        ];
        preventionTips = [
            "Plant resistant rice varieties.",
            "Use split application of nitrogen fertilizer.",
            "Destroy infected seeds and stubble from previous crops."
        ];
    } else if (diseaseNameLower.includes("brown_spot")) {
        yieldLoss = severity === "High" ? "15-30%" : severity === "Medium" ? "5-15%" : "0-5%";
        symptoms = `Small, circular to oval, dark brown spots on the leaves. Severe infection causes leaves to dry out completely.`;
        recommendedPesticide = `Mancozeb or Edifenphos fungicides`;
        treatmentSteps = [
            "Improve soil fertility by applying necessary nutrients (potassium, calcium).",
            `Apply ${recommendedPesticide} at tillering or booting stages.`
        ];
        preventionTips = [
            "Ensure seeds are healthy and treated before planting.",
            "Maintain good soil fertility with balanced NPK fertilizers.",
            "Manage field watering properly."
        ];
    } else if (diseaseNameLower.includes("bacterial_leaf_blight") || diseaseNameLower.includes("blight")) {
        yieldLoss = severity === "High" ? "40-60%" : severity === "Medium" ? "20-30%" : "5-10%";
        symptoms = `Water-soaked to yellowish stripes on leaf blades or starting at leaf tips followed by grayish centers. Leaves turn pale green to greyish white and eventually wither.`;
        recommendedPesticide = `Copper-based bactericides (though prevention is most effective)`;
        treatmentSteps = [
            "Drain the field temporarily if severe.",
            "Limit nitrogen fertilizer immediately.",
            "Remove weeds indicating alternate hosts."
        ];
        preventionTips = [
            "Use resistant varieties of rice.",
            "Ensure balanced fertilization and avoid excessive nitrogen.",
            "Maintain clean fields and sterile equipment."
        ];
    } else if (diseaseNameLower.includes("tungro")) {
        yieldLoss = severity === "High" ? "50-80%" : severity === "Medium" ? "20-40%" : "5-15%";
        symptoms = `Severe stunting of the plant and distinct yellow or orange-yellow discoloration of the leaves. Often spread by green leafhoppers.`;
        recommendedPesticide = `Insecticides targeting green leafhoppers (Neonicotinoids, Buprofezin)`;
        treatmentSteps = [
            "Apply insecticide immediately to control the green leafhopper vector population.",
            "Uproot and bury deeply existing infected plants."
        ];
        preventionTips = [
            "Plant tungro-resistant varieties.",
            "Time planting to avoid peak leafhopper populations.",
            "Observe fallow periods between plantings to break the insect cycle."
        ];
    }

    // Adjust aggressiveness based on severity
    if (severity === "High") {
        treatmentSteps.unshift(`URGENT: Immediately assess the entire field for rapid spread of ${disease}.`);
        if (!treatmentSteps.join(" ").includes("Chemical") && !diseaseNameLower.includes("tungro") && !diseaseNameLower.includes("blight")) {
            treatmentSteps.push("Consider strong chemical intervention if cultural methods fail to halt the rapid spread.");
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
