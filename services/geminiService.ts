import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateTextResponse = async (
  prompt: string, 
  history: { role: string; parts: { text: string }[] }[] = []
): Promise<string> => {
  if (!apiKey) return "Error: API Key no encontrada.";
  
  try {
    const model = 'gemini-2.5-flash';
    // If we have history, use chat mode logic ideally, but for simple implementation
    // we will use generateContent with the prompt. 
    // For a robust implementation, we would use ai.chats.create() but let's keep it simple for this scoped app
    // or use a specialized chat function if state is managed externally.
    
    // For this specific implementation, we'll treat it as a single turn or manage context manually if needed.
    // However, the requested format suggests a simple generation.
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model,
      contents: prompt, // Keep it simple for now
    });

    return response.text || "No se recibió respuesta.";
  } catch (error) {
    console.error("Gemini Text Error:", error);
    return "Error al conectar con la IA.";
  }
};

export const generateImageResponse = async (prompt: string): Promise<string | null> => {
    if (!apiKey) return null;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }]
            }
        });

        // Loop to find image part
        if (response.candidates && response.candidates[0].content.parts) {
             for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
             }
        }
        return null;
    } catch (error) {
        console.error("Gemini Image Error:", error);
        return null;
    }
}
