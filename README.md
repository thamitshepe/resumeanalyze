# Resume Analyzer

Web app that extracts text from a resume (PDF, DOCX, or TXT), compares it against a job description, and returns a structured analysis via the OpenAI API.

## Requirements

- Node.js 20+
- A paid [OpenAI API key](https://platform.openai.com/api-keys)

## Setup

```bash
npm install
cp .env.example .env.local
```

Add your OpenAI API key to `.env.local`. Optionally set `OPENAI_MODEL` (defaults to `gpt-4.1-mini`).

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Usage

1. Upload a resume (PDF, DOCX, or TXT, max 5 MB).
2. Paste the target job description.
3. Click **Analyze resume** to get a match score, summary, strengths, gaps, and recommendations.

## Project structure

```
src/
├── app/
│   ├── api/analyze/route.ts   # POST handler
│   ├── layout.tsx
│   └── page.tsx
├── components/                # UI
├── lib/
│   ├── openai/                # OpenAI client + analysis
│   └── resume/                # Validation + text extraction
└── types/                     # Shared types + Zod schemas
```

## Scripts

| Command       | Description              |
|---------------|--------------------------|
| `npm run dev` | Start dev server         |
| `npm run build` | Production build       |
| `npm run start` | Run production server  |
| `npm run lint`  | ESLint                 |

## Notes

- File parsing runs server-side in the API route; resume content is sent to OpenAI for analysis only when you submit the form.
- Mock responses and local LLMs are not used — analysis requires a live OpenAI API call.
