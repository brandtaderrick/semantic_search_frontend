# Semantic Search Frontend

A Next.js chat interface for AI-powered semantic search of legacy codebases.

## Quick Start

```bash
# Install dependencies
npm install

# Create .env.local
cp .env.example .env.local

# Edit .env.local with your FastAPI URL
# NEXT_PUBLIC_API_URL=http://localhost:5001

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- 🔍 **Semantic Search**: AI-powered code understanding
- 💬 **Chat Interface**: Natural language Q&A
- 📁 **GitHub Integration**: Paste URLs to ingest files
- 🤖 **Hybrid Search**: Combines local code + external docs
- ⚡ **Fast Onboarding**: Reduce weeks to hours

## Usage

1. **Ingest a file**: Paste a GitHub URL
   ```
   https://github.com/owner/repo/blob/branch/path/to/file.ext
   ```

2. **Ask questions**:
   - "Explain how this code works"
   - "What does this syntax mean?"
   - "Give me an overview"

## Deployment

```bash
vercel --prod
```

Set environment variable:
- `NEXT_PUBLIC_API_URL` = Your FastAPI URL

## Documentation

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for detailed setup, troubleshooting, and demo script.

## Tech Stack

- Next.js 14, React, TypeScript
- Tailwind CSS
- Vercel AI SDK
- FastAPI backend (separate repo)

## License

MIT
