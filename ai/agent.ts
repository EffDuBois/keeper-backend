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

type response_type = z.infer<typeof JsonRPCResponse>;

export async function invokeAgent(
  chat_history: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
): Promise<response_type | undefined> {
  if (chat_history.length === 0) {
    throw Error("NoChat", { cause: "No chat history provided." });
  }
  try {
    const inputMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: "system",
          content: AGENT_PROMPT,
        },
        ...chat_history,
      ];

    const responseMessage = await useLLM<response_type>(
      inputMessages,
      "gemini-1.5-flash",
      1,
      zodResponseFormat(JsonRPCResponse, "jsonrpc")
    );

    if (responseMessage) {
      console.log(JSON.stringify(responseMessage));
      return responseMessage;
    } else {
      console.error("No response from the message.");
    }
  } catch (error) {
    console.error("Error invoking agent:", error);
  }
}
