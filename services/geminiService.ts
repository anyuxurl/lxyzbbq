import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    // Ideally, check if API KEY exists. For this demo, we assume it's injected.
    if (process.env.API_KEY) {
      aiClient = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
  }
  return aiClient;
};

export const polishTextWithAI = async (text: string, style: 'romantic' | 'funny' | 'formal'): Promise<string> => {
  const client = getAiClient();
  if (!client) {
    console.warn("Gemini API Key not found.");
    return text; // Fallback to original text
  }

  const prompt = `
    You are an assistant for a campus social app. 
    Please rewrite the following text to make it more ${style}. 
    Keep it suitable for university students. 
    Keep it concise (under 140 characters if possible).
    Language: Chinese (Simplified).
    
    Text: "${text}"
  `;

  try {
    const response = await client.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    return response.text?.trim() || text;
  } catch (error) {
    console.error("Error polishing text:", error);
    return text;
  }
};
