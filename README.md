# SemSearch AI - Frontend

**Chat interface for AI-powered semantic code search**

A Next.js chat application that provides a natural language interface for understanding legacy codebases. Ask questions about code and get intelligent answers powered by AI agents, vector embeddings, and multi-source search.

## 🎯 What It Does

SemSearch AI helps developers quickly understand unfamiliar code by:
- **Ingesting** code files from GitHub using slash commands
- **Answering** natural language questions about the code
- **Intelligently routing** queries to the best search strategy (local, external, or hybrid)
- **Synthesizing** comprehensive answers from multiple sources
- **Providing** instant, transparent reasoning for all decisions

Instead of spending weeks reading through legacy code, developers can have a conversation with the AI to understand what they need in minutes.

## ✨ Features

### 💬 Chat Interface
- Clean, modern chat UI with markdown support
- Real-time responses with loading indicators
- Message history maintained during session
- Quick-action buttons for common queries

### 🔧 Slash Commands

#### `/help`
Learn how the system works, including search strategies and architecture.
```
/help
```

#### `/ingest`
Add files from GitHub repositories to the knowledge base.
```
/ingest https://github.com/owner/repo src/auth.py
/ingest https://github.com/owner/repo/blob/main/src/auth.py
```

### 🧠 Intelligent Search Strategies

The backend AI agent automatically chooses the best search approach:

**Local Search**
- Searches your ingested code
- Uses vector similarity search
- Best for specific code questions

**External Search (Tavily)**
- Searches web documentation
- Finds programming concepts, syntax, library docs
- Best for general knowledge questions

**Hybrid Search**
- Combines both local and external
- Best for complex questions needing context + documentation

You'll see which strategy was used in the response footer!

### 🎨 UI/UX Features
- **Markdown rendering**: Bold text, inline code, code blocks, headers
- **Syntax highlighting**: Code blocks with proper styling
- **Responsive design**: Works on desktop and mobile
- **Loading states**: Animated indicators during processing
- **Error handling**: Clear error messages with recovery suggestions
- **Example prompts**: Quick-click buttons for common queries

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Backend API running (see backend README)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd semantic_search_frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### Environment Variables

Edit `.env.local`:
```bash
NEXT_PUBLIC_API_URL=http://localhost:5001
# or your deployed backend URL:
# NEXT_PUBLIC_API_URL=https://your-api.vercel.app
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000/chat](http://localhost:3000/chat)

## 📖 Usage Guide

### 1. Start the Chat
Navigate to `/chat` to open the chat interface.

### 2. Learn the System
Click the **"❓ Help"** button or type `/help` to see comprehensive documentation.

### 3. Ingest Code Files
Use the `/ingest` command to add files:
```
/ingest https://github.com/mongodb/mongo src/mongo/db/auth/auth_manager.cpp
```

You can ingest multiple files to build your knowledge base!

### 4. Ask Questions
Once files are ingested, ask natural language questions:

**Specific code questions:**
- "How does the authentication manager work?"
- "What does the auth_manager.cpp file do?"
- "Explain the login flow"

**General programming questions:**
- "What is the difference between async and await?"
- "What are MongoDB authentication best practices?"

**Complex hybrid questions:**
- "How does this auth code compare to OAuth standards?"
- "Are there any security vulnerabilities in this authentication implementation?"

### 5. Review Results
Each response includes:
- **Synthesized answer** - Natural language explanation
- **Search strategy** - Which method was used (local/external/hybrid)
- **Reasoning** - Why that strategy was chosen
- **Sources** - File paths or URLs cited

## 🎨 Customization

### Styling
The app uses Tailwind CSS. Modify styles in:
- `components/chat-interface.tsx` - Main chat UI
- `tailwind.config.ts` - Global theme configuration
- `app/globals.css` - Base styles

### Backend API URL
Change the API endpoint in `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://your-custom-api.com
```

## 📦 Deployment

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Environment Variables in Vercel
Set in the Vercel dashboard:
- `NEXT_PUBLIC_API_URL` - Your backend API URL

### Custom Domain
Configure in Vercel project settings.

## 🏗️ Architecture

```
┌──────────────────┐
│   Next.js App    │
│   (React)        │
└────────┬─────────┘
         │
         │ HTTP/REST
         │
┌────────▼─────────┐
│  API Route       │
│  /api/chat       │
└────────┬─────────┘
         │
         │ Parse Commands
         │ (/help, /ingest)
         │
    ┌────┴────┬─────────────┐
    │         │             │
┌───▼────┐ ┌──▼──────┐  ┌──▼────────┐
│ Local  │ │ Backend │  │ Backend   │
│ /help  │ │ /ingest │  │ /search   │
│ Handler│ │ API     │  │ API       │
└────────┘ └─────────┘  └───────────┘
```

## 📚 Project Structure

```
semantic_search_frontend/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts         # API route handler (commands, backend proxy)
│   ├── chat/
│   │   └── page.tsx             # Chat page
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   └── globals.css              # Global styles
├── components/
│   ├── chat-interface.tsx       # Main chat component
│   └── ui/
│       └── background-boxes.tsx # Background animation
├── lib/
│   └── utils.ts                 # Utilities (URL parsing, slash commands)
├── .env.example                 # Environment template
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind configuration
└── README.md                    # This file
```

## 🔧 Key Implementation Details

### Slash Command Parsing
Commands are parsed in `lib/utils.ts`:
- `isSlashCommand()` - Detects slash commands
- `parseIngestCommand()` - Parses `/ingest` with URL extraction
- Supports both full GitHub URLs and repo + path format

### Markdown Rendering
Custom markdown parser in `chat-interface.tsx`:
- Headers (H1, H2, H3)
- Bold text (`**text**`)
- Inline code (`` `code` ``)
- Code blocks (``` prefix format)
- Horizontal rules (`---`)

### API Integration
The Next.js API route (`/api/chat/route.ts`):
1. Receives chat messages
2. Detects slash commands
3. Handles `/help` locally (instant response)
4. Proxies `/ingest` and search to backend
5. Returns formatted responses

## 🎓 For Hackathon Judges

**User Experience:** Intuitive slash commands + natural language interface reduces friction.

**Innovation:** Self-documenting with `/help` command; intelligent routing is transparent to users.

**Technical Quality:** Clean separation between frontend routing and backend AI logic.

**Polish:** Markdown rendering, loading states, error handling, and example prompts create a production-ready feel.

## 🛠️ Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **React Hooks** - State management
- **Edge Runtime** - Fast API routes
- **Vercel** - Deployment platform

## 🐛 Troubleshooting

### "Failed to fetch" errors
- Check that backend is running
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS configuration on backend

### Slash commands not working
- Ensure commands start with `/` (no spaces before)
- Use exact format: `/help` or `/ingest <url> <path>`

### Markdown not rendering
- Check that content uses supported syntax
- Headers need space after `#`: `# Title` not `#Title`
- Code blocks need ``` prefix on same line

## 📄 License

MIT

## 🤝 Contributing

This is a hackathon project. Feel free to fork and extend!

## 📞 Support

See [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) for additional setup details and troubleshooting.
