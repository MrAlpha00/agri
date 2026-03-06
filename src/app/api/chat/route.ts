import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';

export const maxDuration = 30; // 30 seconds max duration

export async function POST(req: Request) {
    try {
        const { messages } = await req.json();

        // Check if an OpenAI API key is active.
        // During demo/development without a paid API Key, we will simulate a high-quality streaming response.
        const useSimulatedAI = !process.env.OPENAI_API_KEY;

        if (useSimulatedAI) {
            console.log("[AI Assistant] Using local simulated stream (No OPENAI_API_KEY detected)");
            // Create a simulated readable stream to mimic LLM typing behavior
            const stream = new ReadableStream({
                async start(controller) {
                    const latestMessage = messages[messages.length - 1]?.content?.toLowerCase() || "";

                    let simulatedResponse = "I'm the AgriScan AI Assistant. How can I help you with your crops today? I can analyze symptoms, suggest fertilizers, and recommend best practices.";

                    if (latestMessage.includes("blight") || latestMessage.includes("spots")) {
                        simulatedResponse = "It sounds like you might be dealing with **Blight** or a fungal infection. \n\n### Recommended Actions:\n1. **Fungicide:** Apply a copper-based fungicide or chlorothalonil immediately to prevent spread.\n2. **Pruning:** Remove and destroy infected leaves (do not compost them).\n3. **Watering:** Switch to drip irrigation. Fungal spores spread rapidly when leaves are wet from overhead watering.\n\n*Would you like me to predict the severity based on local weather conditions?*";
                    } else if (latestMessage.includes("fertilizer") || latestMessage.includes("yield")) {
                        simulatedResponse = "To improve your yield, it's essential to balance your **NPK (Nitrogen, Phosphorus, Potassium)** ratio based on your soil type.\n\n* **Nitrogen** supports leafy green growth.\n* **Phosphorus** helps with root and flower development.\n* **Potassium** improves overall plant health and disease resistance.\n\nIf you haven't done a soil test recently, applying a balanced 10-10-10 fertilizer is a safe starting point. Let me know what crop you are growing for more specific advice!";
                    } else if (latestMessage.includes("hi") || latestMessage.includes("hello")) {
                        simulatedResponse = "Hello! I'm your virtual Agronomist. You can ask me about crop diseases, pest control, weather impacts, or yield optimization strategies. What are you currently working on?";
                    }

                    // Artificially chunk and delay the response to simulate streaming
                    const words = simulatedResponse.split(' ');
                    for (const word of words) {
                        const chunk = new TextEncoder().encode(`0:${JSON.stringify(word + ' ')}\n`);
                        controller.enqueue(chunk);
                        await new Promise(r => setTimeout(r, 60)); // 60ms delay per word
                    }
                    controller.close();
                }
            });

            return new Response(stream, {
                headers: { 'Content-Type': 'text/plain; charset=utf-8' }
            });
        }

        // True OpenAI Integration
        console.log("[AI Assistant] Using real OpenAI GPT API.");
        const result = streamText({
            model: openai('gpt-4-turbo'),
            system: 'You are an expert Agronomist AI. Provide helpful, concise, and scientific farming advice, treatment for diseases, and suggestions for improving crop yield.',
            messages,
        });

        return result.toTextStreamResponse();

    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json(
            { error: "Failed to process chat message", details: error.message },
            { status: 500 }
        );
    }
}
