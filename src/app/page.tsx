import { AnalyzeForm } from "@/components/analyze-form";

export default function HomePage() {
  return (
    <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(124,58,237,0.12),transparent_70%)]"
      />

      <header className="relative mb-12 max-w-2xl">
        <p className="text-xs font-medium tracking-[0.25em] text-muted uppercase">
          Resume Analyzer
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          See how you fit
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Upload your resume, paste the job description, and get a structured
          breakdown of strengths, gaps, and edits to try.
        </p>
      </header>

      <AnalyzeForm />
    </main>
  );
}
