import { formFields } from "@/lib/config";
import {
  analyzeResponseSchema,
  type AnalysisResult,
} from "@/types/api";

export class AnalyzeRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnalyzeRequestError";
  }
}

export async function submitAnalysis(
  file: File,
  jobDescription: string,
): Promise<AnalysisResult> {
  const body = new FormData();
  body.append(formFields.resume, file);
  body.append(formFields.jobDescription, jobDescription);

  let response: Response;

  try {
    response = await fetch("/api/analyze", { method: "POST", body });
  } catch {
    throw new AnalyzeRequestError(
      "Network error. Check your connection and try again.",
    );
  }

  let payload: unknown;

  try {
    payload = await response.json();
  } catch {
    throw new AnalyzeRequestError("Unexpected response from the server.");
  }

  const parsed = analyzeResponseSchema.safeParse(payload);
  if (!parsed.success) {
    throw new AnalyzeRequestError("Unexpected response from the server.");
  }

  if (!parsed.data.ok) {
    throw new AnalyzeRequestError(parsed.data.error);
  }

  return parsed.data.data;
}
