
import { GoogleGenAI } from "@google/genai";

// Always use a named parameter for initialization and obtain API_KEY from process.env.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMovieDescription = async (title: string): Promise<string> => {
  // Use the API key directly; assuming it's pre-configured as per guidelines.
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a short, catchy one-sentence description for a movie titled "${title}".`,
    });
    // Access the .text property directly (not a method).
    return response.text || "No description available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Description unavailable.";
  }
};
