import { GoogleGenAI } from "@google/genai";

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiClient) {
    // Safely attempt to get the API key. 
    // In some build environments, process might not be polyfilled globally.
    let apiKey = '';
    try {
      // @ts-ignore
      if (typeof process !== 'undefined' && process.env) {
        // @ts-ignore
        apiKey = process.env.API_KEY;
      }
    } catch (e) {
      console.warn("Could not access process.env");
    }

    if (apiKey) {
      aiClient = new GoogleGenAI({ apiKey });
    }
  }
  return aiClient;
};

export const polishTextWithAI = async (text: string, style: 'romantic' | 'funny' | 'formal'): Promise<string> => {
  const client = getAiClient();
  if (!client) {
    console.warn("Gemini API Key not found or client not initialized.");
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