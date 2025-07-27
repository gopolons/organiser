import { convertToISO8601 } from "@/utils/dateUtils";
import { sendRequest, uploadFile } from "./api";

type AIServiceResponse = {
  success: boolean;
  data?: string;
  error?: string;
};

export interface AIService {
  transcribeAudio(uri: string): Promise<any | null>;
  processTextInput(input: string): Promise<any | null>;
}

// Fetch from environment variables URL & API key
const openAIURL = process.env.EXPO_PUBLIC_OPENAI_BASE_URL;
const openAIAPIKEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
const openAIPrompt = process.env.EXPO_PUBLIC_OPENAI_PROMPT;

// Default implementation of the AI service interface
export const OpenAIService: AIService = {
  async transcribeAudio(uri: string) {
    // Check environment variables
    if (!openAIURL || !openAIAPIKEY) {
      throw new Error("Could not fetch environment variables");
    }

    const data = await uploadFile(
      openAIURL,
      "/audio/transcriptions",
      uri,
      "file",
      "audio.m4a",
      { model: "whisper-1" },
      { Authorization: `Bearer ${openAIAPIKEY}` }
    );

    return { success: true, data: data.text };
  },

  async processTextInput(input: string) {
    // Check environment variables
    if (!openAIURL || !openAIAPIKEY || !openAIPrompt) {
      throw new Error("Could not fetch environment variables");
    }

    // Get today's date formatted in ISO8601
    const formattedDate = convertToISO8601(Date.now());

    // Build the prompt messages for the model
    const messages = [
      {
        role: "system",
        content: `${openAIPrompt}\n\nCurrent date: ${formattedDate}. Use this date as reference when determining due dates or scheduling information.`,
      },
      {
        role: "user",
        content: input,
      },
    ];

    // Send the request to remote server
    const data = await sendRequest(openAIURL, "/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${openAIAPIKEY}`,
        "Content-Type": "application/json",
      },
      body: {
        model: "gpt-4",
        messages,
        temperature: 0.2,
      },
    });

    return { success: true, data: data.choices[0].message.content };
  },
};
