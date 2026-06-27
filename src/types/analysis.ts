import { z } from "zod";

export const analysisResultSchema = z.object({
  matchScore: z.number().min(0).max(100),
  summary: z.string().min(1),
  strengths: z.array(z.string()),
  gaps: z.array(z.string()),
  recommendations: z.array(z.string()),
});

export type AnalysisResult = z.infer<typeof analysisResultSchema>;

export type AnalyzeRequest = {
  resumeText: string;
  jobDescription: string;
};
