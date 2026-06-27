import type { AnalysisResult } from "@/types/analysis";

type AnalysisResultsProps = {
  result: AnalysisResult;
};

function scoreTone(score: number): string {
  if (score >= 80) return "text-emerald-700";
  if (score >= 60) return "text-amber-700";
  return "text-rose-700";
}

function scoreBarColor(score: number): string {
  if (score >= 80) return "bg-emerald-600";
  if (score >= 60) return "bg-amber-500";
  return "bg-rose-500";
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
    <section className="space-y-3">
      <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
      {items.length > 0 ? (
        <ul className="space-y-2 text-sm leading-relaxed text-stone-700">
          {items.map((item, index) => (
            <li key={`${title}-${index}`} className="flex gap-2">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-stone-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-stone-500">{emptyMessage}</p>
      )}
    </section>
  );
}

export function AnalysisResults({ result }: AnalysisResultsProps) {
  return (
    <div className="space-y-8 rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
            Match score
          </p>
          <p className={`mt-1 text-4xl font-semibold tabular-nums ${scoreTone(result.matchScore)}`}>
            {result.matchScore}
            <span className="text-lg text-stone-400">/100</span>
          </p>
        </div>
        <div className="h-2 w-full max-w-xs overflow-hidden rounded-full bg-stone-100 sm:mb-2">
          <div
            className={`h-full rounded-full transition-all ${scoreBarColor(result.matchScore)}`}
            style={{ width: `${result.matchScore}%` }}
          />
        </div>
      </div>

      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-stone-900">Summary</h3>
        <p className="text-sm leading-relaxed text-stone-700">{result.summary}</p>
      </section>

      <div className="grid gap-8 md:grid-cols-2">
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
