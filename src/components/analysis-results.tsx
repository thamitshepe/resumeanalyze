import type { AnalysisResult } from "@/types/analysis";

type AnalysisResultsProps = {
  result: AnalysisResult;
};

function scoreColor(score: number): string {
  if (score >= 80) return "text-emerald-400";
  if (score >= 60) return "text-amber-400";
  return "text-red-400";
}

function scoreBarColor(score: number): string {
  if (score >= 80) return "bg-emerald-500";
  if (score >= 60) return "bg-amber-500";
  return "bg-red-500";
}

function ListSection({
  title,
  items,
  emptyMessage,
}: {
  title: string;
  items: string[];
  emptyMessage: string;
}) {
  return (
    <section className="space-y-3 rounded-xl border border-border bg-background/50 p-5">
      <h3 className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">
        {title}
      </h3>
      {items.length > 0 ? (
        <ul className="space-y-2.5 text-sm leading-relaxed text-foreground/80">
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted">{emptyMessage}</p>
      )}
    </section>
  );
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  return (
    <div className="space-y-8 rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.25em] text-muted uppercase">
            Match score
          </p>
          <p
            className={`mt-2 text-5xl font-bold tabular-nums ${scoreColor(result.matchScore)}`}
          >
            {result.matchScore}
            <span className="text-2xl font-normal text-muted">/100</span>
          </p>
        </div>
        <div className="h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-border sm:mb-3">
          <div
            className={`h-full rounded-full transition-all duration-700 ${scoreBarColor(result.matchScore)}`}
            style={{ width: `${result.matchScore}%` }}
          />
        </div>
      </div>

      <section className="space-y-3 rounded-xl border border-border bg-background/50 p-5">
        <h3 className="text-xs font-semibold tracking-[0.2em] text-muted uppercase">
          Summary
        </h3>
        <p className="text-sm leading-relaxed text-foreground/80">
          {result.summary}
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <ListSection
          title="Strengths"
          items={result.strengths}
          emptyMessage="No clear strengths identified."
        />
        <ListSection
          title="Gaps"
          items={result.gaps}
          emptyMessage="No major gaps flagged."
        />
      </div>

      <ListSection
        title="Recommendations"
        items={result.recommendations}
        emptyMessage="No recommendations at this time."
      />
    </div>
  );
}
