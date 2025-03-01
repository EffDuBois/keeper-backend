export type SupportedModel = "gemini-1.5-flash" | "gpt-4o-mini";
export type ModelProvider = "gemini" | "openai";

export const modelMapping: Record<SupportedModel, ModelProvider> = {
  "gemini-1.5-flash": "gemini",
  "gpt-4o-mini": "openai",
};
