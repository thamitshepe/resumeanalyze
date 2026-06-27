import { AppError } from "@/lib/errors";
import {
  ACCEPTED_EXTENSIONS,
  ACCEPTED_EXTENSION_SET,
  ACCEPTED_MIME_SET,
  limits,
} from "@/lib/resume/constants";

export type ResumeFileType = "pdf" | "docx" | "txt";

const EXTENSION_TO_TYPE: Record<string, ResumeFileType> = {
  ".pdf": "pdf",
  ".docx": "docx",
  ".txt": "txt",
};

const MIME_TO_TYPE: Record<string, ResumeFileType> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "text/plain": "txt",
};

export function getFileExtension(filename: string): string {
  const dot = filename.lastIndexOf(".");
  if (dot === -1) return "";
  return filename.slice(dot).toLowerCase();
}

function typeFromExtension(ext: string): ResumeFileType | null {
  return EXTENSION_TO_TYPE[ext] ?? null;
}

function typeFromMime(mime: string): ResumeFileType | null {
  return MIME_TO_TYPE[mime] ?? null;
}

export function resolveFileType(file: File): ResumeFileType {
  const ext = getFileExtension(file.name);
  const fromExt = typeFromExtension(ext);
  const fromMime = file.type ? typeFromMime(file.type) : null;

  if (fromExt && fromMime && fromExt !== fromMime) {
    throw new AppError(
      "File extension and content type do not match. Rename the file or upload a different format.",
    );
  }

  const resolved = fromExt ?? fromMime;
  if (resolved) return resolved;

  throw new AppError(
    `Unsupported file type. Use one of: ${ACCEPTED_EXTENSIONS.join(", ")}`,
  );
}

export function validateResumeFile(file: File): ResumeFileType {
  if (file.size === 0) {
    throw new AppError("The uploaded file is empty.");
  }

  if (file.size > limits.maxFileSizeBytes) {
    const maxMb = limits.maxFileSizeBytes / (1024 * 1024);
    throw new AppError(`File is too large. Maximum size is ${maxMb} MB.`);
  }

  const ext = getFileExtension(file.name);
  const extOk = ACCEPTED_EXTENSION_SET.has(ext);
  const mimeOk = file.type === "" || ACCEPTED_MIME_SET.has(file.type);

  if (!extOk && !mimeOk) {
    throw new AppError(
      `Unsupported file type. Use one of: ${ACCEPTED_EXTENSIONS.join(", ")}`,
    );
  }

  return resolveFileType(file);
}

export function formatValidationError(error: unknown): string {
  if (error instanceof AppError) return error.message;
  return "That file could not be used. Try PDF, DOCX, or TXT.";
}
