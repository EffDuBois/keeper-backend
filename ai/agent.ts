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

async function invokeAgent(
  input: string,
  system_data?: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
): Promise<response_type | undefined> {
  try {
    const inputMessages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] =
      [
        {
          role: "system",
          content: AGENT_PROMPT,
        },
        ...(system_data ?? []),
        {
          role: "user",
          content: input,
        },
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

const response = await invokeAgent(
  "Make a list of apples, bananas, and oranges.",
  [
    { role: "user", content: "create a note" },
    { role: "assistant", content: "Please provide the content for the note" },
  ]
);

if (response) {
  console.log("Response received:", response);
  if (response.method === "create_note") {
    console.log(
      "Creating a note with the name:",
      JSON.parse(response.payload).name
    );
    console.log("and content:", JSON.parse(response.payload).content);
  }
} else {
  console.error("No valid response received.");
}
