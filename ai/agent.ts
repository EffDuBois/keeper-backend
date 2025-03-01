import OpenAI from "openai";
import { AGENT_PROMPT } from "./prompts";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

const API_KEY = process.env.LLM_KEY;

const client = new OpenAI({
  apiKey: API_KEY,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

const JsonRPCResponse = z.object({
  jsonrpc: z.string(),
  method: z.string(),
  payload: z.string(),
  id: z.string(),
});
async function invokeAgent(input: string) {
  const chatCompletion = await client.beta.chat.completions.parse({
    model: "gemini-1.5-flash",
    n: 1,
    messages: [
      {
        role: "system",
        content: AGENT_PROMPT,
      },
      {
        role: "user",
        content: input,
      },
    ],
    response_format: zodResponseFormat(JsonRPCResponse, "action"),
  });
  console.log(JSON.stringify(chatCompletion.choices[0].message.parsed));
  console.log(JSON.stringify(chatCompletion.choices[0].message.parsed));
  return chatCompletion.choices[0].message;
}