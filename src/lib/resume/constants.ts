export const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt"] as const;

export const ACCEPTED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
] as const;

export type AcceptedExtension = (typeof ACCEPTED_EXTENSIONS)[number];
export type AcceptedMimeType = (typeof ACCEPTED_MIME_TYPES)[number];

export const ACCEPTED_EXTENSION_SET = new Set<string>(ACCEPTED_EXTENSIONS);
export const ACCEPTED_MIME_SET = new Set<string>(ACCEPTED_MIME_TYPES);

export { limits } from "@/lib/config";
