import { openai as openaiConfig } from "@/lib/config";
import { AppError } from "@/lib/errors";
import {
  createAnalysisAbortSignal,
  getModelName,
  getOpenAIClient,
} from "@/lib/openai/client";
import { mapOpenAIError } from "@/lib/openai/map-error";
import {
  analysisResultSchema,
  type AnalysisResult,
  type AnalyzeRequest,
} from "@/types/analysis";
import { validateJobDescription, validateResumeText } from "@/lib/validation/text-limits";

const SYSTEM_PROMPT = `You compare resumes against job descriptions for hiring teams.

Return JSON only, matching this shape:
{
  "matchScore": number from 0 to 100,
  "summary": "2-3 sentence overview of fit",
  "strengths": ["specific strengths backed by resume evidence"],
  "gaps": ["requirements or skills missing or weak in the resume"],
  "recommendations": ["concrete resume edits to improve alignment"]
}

Scoring guide:
- 90-100: Strong match, most requirements clearly met
- 70-89: Good match with minor gaps
- 50-69: Partial match, notable gaps
- Below 50: Weak match

Be specific. Reference actual skills and experience from the resume. Do not invent credentials.`;

function buildUserPrompt(resumeText: string, jobDescription: string): string {
  return `## Job description
${jobDescription}

## Resume
${resumeText}`;
}

function parseModelResponse(raw: string): AnalysisResult {
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new AppError("The model returned invalid JSON.", 502);
  }

  const result = analysisResultSchema.safeParse(parsed);
  if (!result.success) {
    throw new AppError("The model response did not match the expected format.", 502);
  }

  return result.data;
}

export async function analyzeResume(
  input: AnalyzeRequest,
): Promise<AnalysisResult> {
  const resumeText = validateResumeText(input.resumeText);
  const jobDescription = validateJobDescription(input.jobDescription);

  const client = getOpenAIClient();
  const model = getModelName();

  try {
    const response = await client.chat.completions.create(
      {
        model,
        temperature: openaiConfig.temperature,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: buildUserPrompt(resumeText, jobDescription),
          },
        ],
      },
      { signal: createAnalysisAbortSignal() },
    );

    const raw = response.choices[0]?.message?.content;
    if (!raw) {
      throw new AppError("The model returned an empty response.", 502);
    }

    return parseModelResponse(raw);
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw mapOpenAIError(error);
  }
}
