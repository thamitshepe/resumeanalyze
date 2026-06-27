export function extractTxtText(buffer: Buffer): string {
  const content = buffer.toString("utf-8").trim();

  if (!content) {
    throw new Error("The text file appears to be empty.");
  }

  return content;
}
