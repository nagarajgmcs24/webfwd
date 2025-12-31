
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeIssue(title: string, description: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze this municipal issue and provide a summary including urgency (Low, Medium, High), recommended first steps for a councillor, and a possible root cause.
      
      Title: ${title}
      Description: ${description}`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "Unable to generate analysis at this time.";
  } catch (error) {
    console.error("Gemini analysis error:", error);
    return "Error generating AI analysis.";
  }
}

export async function categorizeIssueAuto(description: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Categorize the following issue description into one of these categories: Roads & Potholes, Street Lighting, Waste & Sanitation, Water Supply, Parks & Recreation, Other. Return ONLY the category name.
      
      Issue: ${description}`,
    });

    return response.text.trim();
  } catch (error) {
    return "Other";
  }
}
