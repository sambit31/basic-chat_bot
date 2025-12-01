import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

export const generateResponse = async (chatHistory) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: chatHistory,

  });
 console.log(response.text);
 return response.text;

}

