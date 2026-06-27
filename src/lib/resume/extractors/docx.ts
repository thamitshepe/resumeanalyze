import mammoth from "mammoth";

export async function extractDocxText(buffer: Buffer): Promise<string> {
  const { value } = await mammoth.extractRawText({ buffer });
  const content = value.trim();

  if (!content) {
    throw new Error("Could not extract text from this DOCX file.");
  }

  return content;
}
