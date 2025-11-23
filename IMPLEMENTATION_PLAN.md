# Semantic Search Frontend - Implementation Plan

This is a Next.js chat interface for your semantic search FastAPI backend. Built for the hackathon with a focus on speed and showcasing the value proposition.

## 🎯 Value Proposition

**Problem**: 40% of dev time is spent on legacy code. Onboarding takes weeks. Lack of documentation makes understanding code fuzzy and time-consuming.

**Solution**: AI-powered semantic search that reduces onboarding time by understanding legacy codebases, explaining weird decisions, and clarifying obscure syntax.

## 📁 Project Structure

```
semantic_search_frontend/
├── app/
│   ├── page.tsx                 # Landing page with value prop
│   ├── chat/
│   │   └── page.tsx             # Chat interface page
│   ├── api/
│   │   └── chat/
│   │       └── route.ts         # API route (detects URLs vs questions)
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   └── chat-interface.tsx       # Main chat UI component
├── lib/
│   └── utils.ts                 # Helper functions (URL parsing, etc.)
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── tailwind.config.ts           # Tailwind CSS config
├── next.config.js               # Next.js config
├── .env.example                 # Environment variables template
└── IMPLEMENTATION_PLAN.md       # This file
```

## ⚡ Quick Start (2-3 hours total)

### Step 1: Install Dependencies (10 minutes)

```bash
cd semantic_search_frontend
npm install
# or
pnpm install
# or
yarn install
```

### Step 2: Configure Environment (5 minutes)

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# For local development with FastAPI running locally
NEXT_PUBLIC_API_URL=http://localhost:5001

# Or use your deployed FastAPI URL
# NEXT_PUBLIC_API_URL=https://your-api.vercel.app
```

### Step 3: Run Development Server (2 minutes)

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Step 4: Test Locally (15 minutes)

1. **Test Landing Page**: Visit `http://localhost:3000` - should see value prop
2. **Test Chat Interface**: Click "Start Searching" → goes to `/chat`
3. **Test File Ingestion**: Paste a GitHub URL like:
   ```
   https://github.com/llvm/llvm-project/blob/main/llvm/include/llvm/ADT/StringRef.h
   ```
4. **Test Questions**: After ingestion, ask:
   - "Explain how this code works"
   - "What is the find function doing?"
   - "Give me an overview of this file"

### Step 5: Deploy to Vercel (20 minutes)

#### Option A: Deploy via Vercel Dashboard (Easiest)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import the `semantic_search_frontend` folder
4. Set environment variable:
   - `NEXT_PUBLIC_API_URL` = Your FastAPI URL (e.g., `https://your-api.vercel.app`)
5. Click "Deploy"

#### Option B: Deploy via Vercel CLI

```bash
cd semantic_search_frontend

# Install Vercel CLI if needed
npm i -g vercel

# Deploy
vercel

# Follow prompts, then set environment variable
vercel env add NEXT_PUBLIC_API_URL

# Deploy to production
vercel --prod
```

## 🔧 How It Works

### User Flow

1. **User lands on homepage** → Sees value proposition
2. **User clicks "Start Searching"** → Goes to chat interface
3. **User pastes GitHub URL** → System detects URL pattern
4. **System calls `/api/ingest/file`** → FastAPI ingests, summarizes, embeds file
5. **User asks questions** → System calls `/api/semantic_search`
6. **System returns synthesized answer** → Combining local code + external docs

### Architecture

```
User → Next.js Chat UI → Next.js API Route → FastAPI Backend → Claude/OpenAI
                                                              ↓
                                                          MongoDB (Vector Store)
```

### Key Components

#### 1. Chat Interface (`components/chat-interface.tsx`)
- Message display with auto-scroll
- Input with example prompts
- Loading states
- Markdown-like formatting for responses

#### 2. Chat API Route (`app/api/chat/route.ts`)
- **URL Detection**: Checks if message contains GitHub URL
- **Ingestion**: Calls `/api/ingest/file` for URLs
- **Search**: Calls `/api/semantic_search` for questions
- **Error Handling**: Formats errors nicely for users

#### 3. Utilities (`lib/utils.ts`)
- `parseGithubUrl()`: Extracts repo_url and file_path
- `isGithubUrl()`: Detects GitHub URLs in text
- `getApiUrl()`: Gets FastAPI URL from env
- `formatError()`: Formats errors for display

## 🎨 Customization Guide

### Change Colors/Branding

Edit `app/page.tsx` and `components/chat-interface.tsx`:

```tsx
// Current: Blue and purple gradient
className="bg-gradient-to-r from-blue-600 to-purple-600"

// Change to your brand colors
className="bg-gradient-to-r from-green-600 to-teal-600"
```

### Add More Example Prompts

Edit `components/chat-interface.tsx` line ~170:

```tsx
<button
  onClick={() => setInput('Your custom prompt here')}
  className="..."
>
  🎯 Custom Prompt
</button>
```

### Modify Welcome Message

Edit `components/chat-interface.tsx` line ~15:

```tsx
{
  role: 'assistant',
  content: 'Your custom welcome message here...'
}
```

### Change Similarity Threshold

Edit `app/api/chat/route.ts` line ~110:

```tsx
similarity_threshold: 0.7,  // Change this value (0.0 - 1.0)
```

## 🐛 Troubleshooting

### Issue: "Failed to fetch" errors

**Cause**: CORS issue or wrong API URL

**Fix**:
1. Check `.env.local` has correct `NEXT_PUBLIC_API_URL`
2. Ensure FastAPI has CORS enabled:
   ```python
   from fastapi.middleware.cors import CORSMiddleware

   app.add_middleware(
       CORSMiddleware,
       allow_origins=["*"],  # Or specific domains
       allow_methods=["*"],
       allow_headers=["*"],
   )
   ```

### Issue: "Invalid GitHub URL format"

**Cause**: URL doesn't match expected pattern

**Expected Format**: `https://github.com/owner/repo/blob/branch/path/to/file.ext`

**Fix**: Make sure URL includes `/blob/` (not `/tree/`)

### Issue: Build fails on Vercel

**Cause**: TypeScript errors or missing dependencies

**Fix**:
1. Run `npm run build` locally first
2. Fix any TypeScript errors
3. Commit and push changes
4. Redeploy

### Issue: Environment variables not working

**Cause**: Next.js requires restart after env changes

**Fix**:
1. Stop dev server (Ctrl+C)
2. Run `npm run dev` again
3. For production: Redeploy on Vercel

## 📊 Demo Script (Hackathon Presentation)

### 1. Start with the Problem (30 seconds)

"40% of developer time is spent working with legacy code. Onboarding to complex codebases takes weeks or months. Lack of documentation makes understanding code fuzzy and time-consuming."

### 2. Show the Landing Page (30 seconds)

"We built Semantic Search - an AI-powered tool that reduces onboarding time by understanding legacy codebases."

### 3. Demo File Ingestion (1 minute)

"Let me show you. I'll paste a GitHub URL for a complex C++ file from the LLVM project."

Paste: `https://github.com/llvm/llvm-project/blob/main/llvm/include/llvm/ADT/StringRef.h`

"Within seconds, our system fetches the file, creates an AI summary, and generates embeddings for semantic search."

### 4. Demo Question Answering (2 minutes)

"Now I can ask questions:"

1. **Overview**: "Give me an overview of this file"
   - Shows high-level understanding

2. **Syntax**: "Explain this syntax: `return Start - data()`"
   - Shows syntax explanation with context

3. **Hybrid Search**: "How does memory comparison work in C++?"
   - Shows hybrid search (local code + external docs)

### 5. Explain the Value (30 seconds)

"Notice how it combines our local code with external documentation. It's not just keyword search - it understands semantics. This reduces onboarding from weeks to hours."

### 6. Technical Deep Dive (If time allows)

- Show architecture diagram
- Explain agentic search (local vs Tavily vs hybrid)
- Mention Claude Haiku for synthesis (cost optimization)
- Discuss MongoDB vector search

## 🚀 Post-Hackathon Enhancements

### Phase 1: Multi-File Support
- Allow ingesting entire repositories
- Show list of ingested files
- Delete/re-ingest functionality

### Phase 2: Conversation History
- Store conversations in MongoDB
- Allow users to return to past sessions
- Export conversation as markdown

### Phase 3: Advanced Features
- Code diff explanations
- Architecture diagram generation
- Automatic documentation creation
- Integration with IDEs (VS Code extension)

### Phase 4: Team Features
- Shared knowledge bases
- Team collaboration on codebases
- Analytics on most-asked questions
- Suggested documentation improvements

## 📝 Notes

### Time Estimates
- **Setup**: 10 minutes
- **Local Testing**: 15 minutes
- **Deployment**: 20 minutes
- **Demo Prep**: 30 minutes
- **Buffer**: 45 minutes
- **Total**: ~2 hours (leaving 6 hours for other tasks)

### Key Selling Points
1. **Semantic Understanding**: Not just keyword search
2. **Hybrid Search**: Local + external documentation
3. **Fast Onboarding**: Weeks → Hours
4. **Legacy Code Focus**: Perfect for undocumented code
5. **AI-Powered**: Claude + OpenAI + MongoDB vector search

### Technology Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI (Python)
- **AI**: Claude (Sonnet + Haiku), OpenAI embeddings
- **Database**: MongoDB with vector search
- **Search**: Tavily for external docs
- **Deployment**: Vercel (both frontend and backend)

## 🎉 Good Luck with Your Hackathon!

You've got a solid foundation. Focus your remaining time on:
1. Testing with real repos
2. Polishing the pitch
3. Preparing the demo
4. Creating backup examples (in case of API issues)

Remember: The value prop is clear, the tech is solid, and the demo shows real impact. You've got this! 🚀
