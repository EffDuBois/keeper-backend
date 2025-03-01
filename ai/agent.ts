import { AGENT_PROMPT } from "./prompts";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { useLLM } from "./llm";
import type OpenAI from "openai";

const JsonRPCResponse = z.object({
  jsonrpc: z.string(),
  method: z.string(),
  payload: z.string(),
  id: z.string(),
});

async function invokeAgent(
  input: string,
  system_data?: any
): Promise<OpenAI.Chat.Completions.ChatCompletionMessage | undefined> {
  try {
    const inputMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: "system",
          content: AGENT_PROMPT,
        },
        {
          role: "system",
          content: JSON.stringify(system_data),
        },
        {
          role: "user",
          content: input,
        },
      ];

    const responseMessage = await useLLM(
      inputMessages,
      "gemini-1.5-flash",
      1,
      zodResponseFormat(JsonRPCResponse, "jsonrpc")
    );
    if (responseMessage && responseMessage.parsed) {
      console.log(JSON.stringify(responseMessage.parsed));
      return responseMessage;
    } else {
      console.error("No response from the message.");
    }
  } catch (error) {
    console.error("Error invoking agent:", error);
  }
}

invokeAgent("Create a note");
