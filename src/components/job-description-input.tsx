"use client";

import { limits } from "@/lib/config";

type JobDescriptionInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

export function JobDescriptionInput({
  value,
  onChange,
  disabled = false,
}: JobDescriptionInputProps) {
  const charCount = value.length;
  const nearLimit = charCount > limits.maxJobDescriptionLength * 0.9;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-4">
        <label
          htmlFor="job-description"
          className="text-xs font-medium tracking-[0.2em] text-muted uppercase"
        >
          Job description
        </label>
        <span
          className={[
            "text-xs tabular-nums",
            nearLimit ? "text-amber-400" : "text-muted/70",
          ].join(" ")}
        >
          {charCount.toLocaleString()} / {limits.maxJobDescriptionLength.toLocaleString()}
        </span>
      </div>
      <textarea
        id="job-description"
        rows={12}
        value={value}
        disabled={disabled}
        maxLength={limits.maxJobDescriptionLength}
        placeholder={`Senior Backend Engineer\n\nRequirements\n- Python\n- FastAPI\n- PostgreSQL\n- Docker`}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-y rounded-xl border border-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted/50 transition focus:border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent/30 disabled:opacity-50"
      />
    </div>
  );
}
