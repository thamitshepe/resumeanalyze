import OpenAI from "openai";

import { getOpenAIApiKey, getOpenAIModel, openai } from "@/lib/config";

let client: OpenAI | null = null;

export function getOpenAIClient(): OpenAI {
  if (client) return client;

  client = new OpenAI({
    apiKey: getOpenAIApiKey(),
    timeout: openai.requestTimeoutMs,
    maxRetries: 1,
  });

  return client;
}

export function getModelName(): string {
  return getOpenAIModel();
}

export function createAnalysisAbortSignal(): AbortSignal {
  return AbortSignal.timeout(openai.requestTimeoutMs);
}
