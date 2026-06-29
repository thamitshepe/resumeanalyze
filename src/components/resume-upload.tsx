"use client";

import { useCallback, useRef, useState } from "react";

import { limits } from "@/lib/config";
import { ACCEPTED_EXTENSIONS } from "@/lib/resume/constants";
import {
  formatValidationError,
  validateResumeFile,
} from "@/lib/resume/validate-file";

type ResumeUploadProps = {
  file: File | null;
  onFileChange: (file: File | null) => void;
  onValidationError?: (message: string | null) => void;
  disabled?: boolean;
};

const accept = ACCEPTED_EXTENSIONS.join(",");
const maxMb = limits.maxFileSizeBytes / (1024 * 1024);

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function ResumeUpload({
  file,
  onFileChange,
  onValidationError,
  disabled = false,
}: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const applyFile = useCallback(
    (next: File | null) => {
      if (disabled) return;

      if (!next) {
        onValidationError?.(null);
        onFileChange(null);
        return;
      }

      try {
        validateResumeFile(next);
        onValidationError?.(null);
        onFileChange(next);
      } catch (error) {
        onValidationError?.(formatValidationError(error));
        onFileChange(null);
        if (inputRef.current) inputRef.current.value = "";
      }
    },
    [disabled, onFileChange, onValidationError],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setDragging(false);
      if (disabled) return;

      const dropped = event.dataTransfer.files[0];
      if (dropped) applyFile(dropped);
    },
    [disabled, applyFile],
  );

  const zoneClass = [
    "relative rounded-xl border px-4 py-10 transition-all",
    dragging
      ? "border-accent bg-accent/5 shadow-[0_0_24px_var(--accent-glow)]"
      : file
        ? "border-accent/40 bg-card"
        : "border-border bg-card hover:border-accent/30",
    disabled ? "opacity-50" : "",
  ].join(" ");

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor="resume-upload"
          className="text-xs font-medium tracking-[0.2em] text-muted uppercase"
        >
          Resume
        </label>
        <span className="text-xs text-muted/70">
          PDF · DOCX · TXT · {maxMb} MB max
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={zoneClass}
      >
        <input
          ref={inputRef}
          id="resume-upload"
          type="file"
          accept={accept}
          disabled={disabled}
          className="sr-only"
          onChange={(e) => applyFile(e.target.files?.[0] ?? null)}
        />

        {file ? (
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {file.name}
              </p>
              <p className="mt-1 text-xs text-muted">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                applyFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="shrink-0 rounded-full border border-border px-3 py-1 text-xs text-muted transition hover:border-red-500/40 hover:text-red-300 disabled:pointer-events-none"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background">
              <svg
                className="h-4 w-4 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>
            <p className="text-sm text-muted">
              Drop your resume here, or{" "}
              <button
                type="button"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
                className="font-medium text-accent hover:text-accent-hover disabled:pointer-events-none"
              >
                browse
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
