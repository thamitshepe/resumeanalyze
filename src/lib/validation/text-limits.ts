import { AppError } from "@/lib/errors";
import { limits } from "@/lib/config";

export function validateJobDescription(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new AppError("Job description is required.");
  }

  if (trimmed.length < limits.minJobDescriptionLength) {
    throw new AppError(
      `Job description must be at least ${limits.minJobDescriptionLength} characters.`,
    );
  }

  if (trimmed.length > limits.maxJobDescriptionLength) {
    throw new AppError(
      `Job description must be under ${limits.maxJobDescriptionLength.toLocaleString()} characters.`,
    );
  }

  return trimmed;
}

export function validateResumeText(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    throw new AppError("Resume text is empty after extraction.");
  }

  if (trimmed.length > limits.maxResumeTextLength) {
    throw new AppError(
      `Extracted resume text exceeds ${limits.maxResumeTextLength.toLocaleString()} characters. Upload a shorter document.`,
    );
  }

  return trimmed;
}
