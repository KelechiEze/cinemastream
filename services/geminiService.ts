import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || 'mock-key';
const ai = new GoogleGenAI({ apiKey });

export const generateMovieDescription = async (title: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, catchy one-sentence description for a movie titled "${title}".`,
    });
    return response.text || "No description available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Description unavailable offline.";
  }
};
