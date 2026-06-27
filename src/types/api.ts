import { z } from "zod";

import { analysisResultSchema } from "@/types/analysis";

export const analyzeResponseSchema = z.discriminatedUnion("ok", [
  z.object({ ok: z.literal(true), data: analysisResultSchema }),
  z.object({ ok: z.literal(false), error: z.string() }),
]);

export type AnalyzeResponse = z.infer<typeof analyzeResponseSchema>;

export type { AnalysisResult, AnalyzeRequest } from "@/types/analysis";
export { analysisResultSchema } from "@/types/analysis";
