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
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-4">
        <label htmlFor="job-description" className="text-sm font-medium">
          Job description
        </label>
        <span
          className={[
            "text-xs tabular-nums",
            nearLimit ? "text-amber-700" : "text-stone-500",
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
        className="w-full resize-y rounded-lg border border-stone-300 bg-white px-3 py-2.5 text-sm leading-relaxed text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-200 disabled:bg-stone-50"
      />
    </div>
  );
}
