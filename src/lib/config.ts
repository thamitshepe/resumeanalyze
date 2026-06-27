export const limits = {
  maxFileSizeBytes: 5 * 1024 * 1024,
  minJobDescriptionLength: 20,
  maxJobDescriptionLength: 15_000,
  maxResumeTextLength: 50_000,
} as const;

export const openai = {
  defaultModel: "gpt-4.1-mini",
  temperature: 0.2,
  requestTimeoutMs: 60_000,
} as const;

export const formFields = {
  resume: "resume",
  jobDescription: "jobDescription",
} as const;

function readEnv(key: string): string | undefined {
  const value = process.env[key]?.trim();
  return value || undefined;
}

export function getOpenAIApiKey(): string {
  const apiKey = readEnv("OPENAI_API_KEY");
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }
  return apiKey;
}

export function getOpenAIModel(): string {
  return readEnv("OPENAI_MODEL") ?? openai.defaultModel;
}
