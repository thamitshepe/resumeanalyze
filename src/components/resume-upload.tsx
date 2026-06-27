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

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor="resume-upload" className="text-sm font-medium">
          Resume
        </label>
        <span className="text-xs text-stone-500">
          PDF, DOCX, or TXT · max {maxMb} MB
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={[
          "relative rounded-lg border border-dashed px-4 py-8 transition-colors",
          dragging ? "border-stone-900 bg-stone-50" : "border-stone-300 bg-white",
          disabled ? "opacity-60" : "hover:border-stone-400",
        ].join(" ")}
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
              <p className="truncate text-sm font-medium text-stone-900">
                {file.name}
              </p>
              <p className="mt-1 text-xs text-stone-500">{formatSize(file.size)}</p>
            </div>
            <button
              type="button"
              disabled={disabled}
              onClick={() => {
                applyFile(null);
                if (inputRef.current) inputRef.current.value = "";
              }}
              className="shrink-0 text-xs text-stone-600 underline-offset-2 hover:text-stone-900 hover:underline disabled:pointer-events-none"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm text-stone-700">
              Drop your resume here, or{" "}
              <button
                type="button"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
                className="font-medium text-stone-900 underline-offset-2 hover:underline disabled:pointer-events-none"
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
