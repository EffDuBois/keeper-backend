import OpenAI from "openai";
import { modelMapping, type SupportedModel } from "../utils";

const OPENAI_KEY = process.env.OPENAI_KEY;
const GEMINI_KEY = process.env.GEMINI_KEY;

export function getLLM(model: SupportedModel = "gemini-1.5-flash"): OpenAI {
  const provider = modelMapping[model];

  // Check for required API keys
  if (provider === "openai" && !OPENAI_KEY) {
    throw new Error(
      "OPENAI_KEY is not defined. Please set it in your environment variables."
    );
  }

  if (provider === "gemini" && !GEMINI_KEY) {
    throw new Error(
      "GEMINI_KEY is not defined. Please set it in your environment variables."
    );
  }

  const clientConfig: { apiKey: string; baseURL?: string } = {
    apiKey: provider === "openai" ? OPENAI_KEY! : GEMINI_KEY!,
  };

  if (provider === "gemini") {
    clientConfig.baseURL =
      "https://generativelanguage.googleapis.com/v1beta/openai";
  }

  return new OpenAI(clientConfig);
}

export async function useLLM(
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[],
  model: SupportedModel = "gemini-1.5-flash",
  n: number = 1,
  response_format?: any
) {
  const client = getLLM(model);

  try {
    const chatCompletion = await client.beta.chat.completions.parse({
      model,
      n,
      messages,
      response_format,
    });
    return chatCompletion.choices[0].message;
  } catch (error) {
    console.error("Error using LLM:", error);
    throw error;
  }
}
