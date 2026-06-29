"use client";

import { useState } from "react";

import { AnalysisResults } from "@/components/analysis-results";
import { JobDescriptionInput } from "@/components/job-description-input";
import { ResumeUpload } from "@/components/resume-upload";
import {
  AnalyzeRequestError,
  submitAnalysis,
} from "@/lib/api/submit-analysis";
import { limits } from "@/lib/config";
import type { AnalysisResult } from "@/types/analysis";

const EXAMPLE_JOB = `Senior Backend Engineer

Requirements
- Python
- FastAPI
- PostgreSQL
- Docker`;

export function AnalyzeForm() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!file) {
      setError("Upload a resume to continue.");
      return;
    }

    const trimmedJob = jobDescription.trim();
    if (trimmedJob.length < limits.minJobDescriptionLength) {
      setError(
        `Paste a job description with at least ${limits.minJobDescriptionLength} characters.`,
      );
      return;
    }

    setLoading(true);

    try {
      const data = await submitAnalysis(file, jobDescription);
      setResult(data);
    } catch (err) {
      setError(
        err instanceof AnalyzeRequestError
          ? err.message
          : "Something went wrong. Try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative space-y-12">
      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <div className="grid gap-6 lg:grid-cols-2">
          <ResumeUpload
            file={file}
            onFileChange={setFile}
            disabled={loading}
            onValidationError={setError}
          />
          <JobDescriptionInput
            value={jobDescription}
            onChange={setJobDescription}
            disabled={loading}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-accent px-8 py-3 text-sm font-semibold tracking-wide text-white uppercase transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              boxShadow: loading ? "none" : "0 0 24px var(--accent-glow)",
            }}
          >
            {loading ? "Analyzing…" : "Analyze"}
          </button>

          {!jobDescription && (
            <button
              type="button"
              disabled={loading}
              onClick={() => setJobDescription(EXAMPLE_JOB)}
              className="rounded-full border border-border px-6 py-3 text-sm font-medium text-muted transition hover:border-accent/50 hover:text-foreground disabled:pointer-events-none"
            >
              Use example
            </button>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300"
          >
            {error}
          </p>
        )}
      </form>

      {result && (
        <div className="space-y-4">
          <p className="text-xs font-medium tracking-[0.25em] text-muted uppercase">
            Your results
          </p>
          <AnalysisResults result={result} />
        </div>
      )}
    </div>
  );
}
