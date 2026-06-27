import { AppError } from "@/lib/errors";
import { extractDocxText } from "@/lib/resume/extractors/docx";
import { extractPdfText } from "@/lib/resume/extractors/pdf";
import { extractTxtText } from "@/lib/resume/extractors/txt";
import {
  type ResumeFileType,
  validateResumeFile,
} from "@/lib/resume/validate-file";
import { validateResumeText } from "@/lib/validation/text-limits";

const EXTRACTORS: Record<
  ResumeFileType,
  (buffer: Buffer) => Promise<string> | string
> = {
  pdf: extractPdfText,
  docx: extractDocxText,
  txt: extractTxtText,
};

export async function extractResumeText(file: File): Promise<string> {
  const fileType = validateResumeFile(file);
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    const raw = await EXTRACTORS[fileType](buffer);
    return validateResumeText(raw);
  } catch (error) {
    if (error instanceof AppError) throw error;

    const detail =
      error instanceof Error ? error.message : "Unknown extraction error";
    throw new AppError(`Failed to read ${fileType.toUpperCase()} file: ${detail}`);
  }
}
