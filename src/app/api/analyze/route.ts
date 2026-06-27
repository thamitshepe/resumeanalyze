import { handleRouteError, jsonOk } from "@/lib/api/handle-route-error";
import { parseAnalyzeRequest } from "@/lib/api/parse-analyze-request";
import { analyzeResume } from "@/lib/openai/analyze-resume";
import { extractResumeText } from "@/lib/resume/extract-text";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const { file, jobDescription } = await parseAnalyzeRequest(request);
    const resumeText = await extractResumeText(file);
    const data = await analyzeResume({ resumeText, jobDescription });

    return jsonOk(data);
  } catch (error) {
    return handleRouteError(error, "analyze");
  }
}
