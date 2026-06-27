import OpenAI from "openai";

import { AppError } from "@/lib/errors";

export function mapOpenAIError(error: unknown): AppError {
  if (error instanceof OpenAI.APIError) {
    if (error.status === 401) {
      return new AppError("Invalid OpenAI API key.", 502);
    }

    if (error.status === 429) {
      return new AppError("OpenAI rate limit hit. Wait a moment and try again.", 429);
    }

    if (error.status === 503) {
      return new AppError("OpenAI is temporarily unavailable. Try again shortly.", 503);
    }

    return new AppError(
      error.message || "OpenAI request failed.",
      error.status ?? 502,
    );
  }

  if (error instanceof Error && error.name === "AbortError") {
    return new AppError("Analysis timed out. Try again with a shorter resume.", 504);
  }

  return new AppError("Unexpected error while calling OpenAI.", 502);
}
