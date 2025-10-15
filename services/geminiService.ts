
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Gemini features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const boostResume = async (resumeText: string): Promise<string> => {
  if (!API_KEY) {
    return "Error: Gemini API key is not configured.";
  }
  try {
    const prompt = `You are an expert career coach. Rewrite the following resume experience summary to be more professional, impactful, and tailored for Applicant Tracking Systems (ATS). Use strong action verbs and quantify achievements where possible. Keep it concise, under 150 words. \n\nOriginal text: "${resumeText}"`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error boosting resume:", error);
    return "An error occurred while enhancing your resume. Please try again.";
  }
};
