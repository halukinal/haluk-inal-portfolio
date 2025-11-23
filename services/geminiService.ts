import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

// Ensure the API key is present
const apiKey = process.env.API_KEY;
if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || "dummy-key" });

/**
 * Initializes a new chat session with the specific system instructions.
 */
export const createChatSession = (): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7, // Balanced creativity and precision
    },
  });
};
