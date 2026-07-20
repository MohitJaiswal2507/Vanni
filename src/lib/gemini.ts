import OpenAI from "openai";

export const geminiClient = new OpenAI({
  apiKey: process.env.GEMINI_API_KEY!,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const GEMINI_CHAT_MODEL = "gemini-3.5-flash";