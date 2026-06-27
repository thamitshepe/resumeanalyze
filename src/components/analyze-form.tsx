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
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <div className="grid gap-8 lg:grid-cols-2">
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
            className="rounded-lg bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Analyzing…" : "Analyze resume"}
          </button>

          {!jobDescription && (
            <button
              type="button"
              disabled={loading}
              onClick={() => setJobDescription(EXAMPLE_JOB)}
              className="text-sm text-stone-600 underline-offset-2 hover:text-stone-900 hover:underline disabled:pointer-events-none"
            >
              Use example job description
            </button>
          )}
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
          >
            {error}
          </p>
        )}
      </form>

      {result && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-stone-900">Results</h2>
          <AnalysisResults result={result} />
        </div>
      )}
    </div>
  );
}
