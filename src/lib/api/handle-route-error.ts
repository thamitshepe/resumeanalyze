import { NextResponse } from "next/server";

import { isAppError } from "@/lib/errors";
import type { AnalysisResult } from "@/types/analysis";
import type { AnalyzeResponse } from "@/types/api";

function isConfigError(error: unknown): boolean {
  return (
    error instanceof Error && error.message.includes("OPENAI_API_KEY")
  );
}

export function handleRouteError(
  error: unknown,
  logLabel: string,
): NextResponse<AnalyzeResponse> {
  if (isAppError(error)) {
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: error.status },
    );
  }

  console.error(`[${logLabel}]`, error);

  if (isConfigError(error)) {
    return NextResponse.json(
      { ok: false, error: "OpenAI API key is not configured on the server." },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { ok: false, error: "Something went wrong while analyzing the resume." },
    { status: 500 },
  );
}

export function jsonOk(
  data: AnalysisResult,
): NextResponse<AnalyzeResponse> {
  return NextResponse.json({ ok: true, data });
}
