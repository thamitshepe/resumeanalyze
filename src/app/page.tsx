import { AnalyzeForm } from "@/components/analyze-form";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-12 sm:px-6 lg:py-16">
      <header className="mb-10 max-w-2xl">
        <p className="text-sm font-medium text-stone-500">Resume Analyzer</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
          See how your resume fits a role
        </h1>
        <p className="mt-3 text-base leading-relaxed text-stone-600">
          Upload your resume, paste the job description, and get a structured
          comparison with strengths, gaps, and concrete edits to try.
        </p>
      </header>

      <AnalyzeForm />
    </main>
  );
}
