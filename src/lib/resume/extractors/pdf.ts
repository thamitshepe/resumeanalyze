import { extractText, getDocumentProxy } from "unpdf";

export async function extractPdfText(buffer: Buffer): Promise<string> {
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const { text } = await extractText(pdf, { mergePages: true });
  const content = (Array.isArray(text) ? text.join("\n") : text).trim();

  if (!content) {
    throw new Error("Could not extract text from this PDF.");
  }

  return content;
}
