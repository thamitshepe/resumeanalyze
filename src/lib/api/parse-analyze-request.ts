import { AppError } from "@/lib/errors";
import { formFields } from "@/lib/config";
import { validateJobDescription } from "@/lib/validation/text-limits";

export type ParsedAnalyzeRequest = {
  file: File;
  jobDescription: string;
};

export async function parseAnalyzeRequest(
  request: Request,
): Promise<ParsedAnalyzeRequest> {
  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    throw new AppError("Expected multipart form data.");
  }

  const file = formData.get(formFields.resume);
  const jobDescription = formData.get(formFields.jobDescription);

  if (!(file instanceof File)) {
    throw new AppError("A resume file is required.");
  }

  if (typeof jobDescription !== "string") {
    throw new AppError("Job description is required.");
  }

  return {
    file,
    jobDescription: validateJobDescription(jobDescription),
  };
}
