import { NextRequest, NextResponse } from 'next/server';
import { parseGithubUrl, isGithubUrl, getApiUrl, formatError, isSlashCommand, parseIngestCommand } from '@/lib/utils';

export const runtime = 'edge';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatRequest {
  messages: Message[];
}

interface IngestResponse {
  success: boolean;
  repo_url: string;
  file_path: string;
  summary: string;
  embedding_dimensions: number;
  inserted_id: string;
  message: string;
}

interface SemanticSearchResponse {
  success: boolean;
  query: string;
  matches: any[];
  total_matches: number;
  source: string;
  reasoning: string;
  synthesized_answer: string | null;
  synthesis_sources: string[] | null;
  synthesis_model: string | null;
  message: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'No messages provided' },
        { status: 400 }
      );
    }

    const lastMessage = messages[messages.length - 1];
    const userMessage = lastMessage.content;

    const apiUrl = getApiUrl();

    // Check if this is a slash command
    if (isSlashCommand(userMessage)) {
      // Handle /help command
      if (userMessage.trim() === '/help') {
        const helpMessage = `# 🚀 SemSearch AI - How It Works

**SemSearch AI** is an intelligent code understanding system that uses AI to help you explore and understand code repositories.

## 📥 Ingesting Code

Use the \`/ingest\` command to add files to the knowledge base:

\`\`\`/ingest https://github.com/owner/repo/blob/main/src/main.cpp
**What happens during ingestion:**
1. **Fetches** the file from GitHub
2. **Summarizes** the code using Claude AI
3. **Creates embeddings** using OpenAI (1536-dimensional vectors)
4. **Stores** in MongoDB Atlas with vector search index

## 🔍 Search Strategies
When you ask a question, an **AI agent (Claude Sonnet)** analyzes your query and intelligently chooses the best search strategy:

### 1️⃣ Local Strategy
- Searches only your **ingested code** in MongoDB
- Uses **vector similarity search** with embeddings
- Best for: Questions about specific code you've ingested
- Example: *"How does the authentication function work?"*

### 2️⃣ External Strategy (Tavily)
- Searches **external documentation** and web resources
- Uses Tavily's web search API
- Best for: General programming concepts, syntax, library docs
- Example: *"What is the difference between async and await?"*

### 3️⃣ Hybrid Strategy
- Searches **both local code AND external sources**
- Combines results from MongoDB + Tavily
- Best for: Complex questions needing both context and documentation
- Example: *"How does this auth code compare to OAuth best practices?"*

## 🤖 How the Agent Decides
The AI agent uses **tool calling** to decide:
1. Analyzes your question's intent
2. Considers whether it's about local code or general knowledge
3. Chooses the optimal strategy (local, external, or hybrid)
4. Provides reasoning for its choice

## ✨ Answer Synthesis
After retrieving results, **Claude Haiku** synthesizes a natural language answer:
- Combines information from all search results
- Provides clear, concise explanations
- Cites sources (file paths or web URLs)
- Uses fast, cost-efficient Haiku model for speed

## 🎯 Tips
- **Ingest multiple files** to build a comprehensive knowledge base
- **Ask specific questions** for local search
- **Ask conceptual questions** to trigger external search
- **Check the reasoning** footer to see which strategy was used

---

**Architecture:** FastAPI + MongoDB Atlas + Anthropic Claude + OpenAI + Tavily`;

        return NextResponse.json({
          role: 'assistant',
          content: helpMessage,
        });
      }

      // Handle /ingest command
      const ingestParsed = parseIngestCommand(userMessage);

      if (ingestParsed) {
        // Call the ingest endpoint with parsed data
        try {
          const response = await fetch(`${apiUrl}/api/ingest/file`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              repo_url: ingestParsed.repo_url,
              file_path: ingestParsed.file_path,
            }),
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
            throw new Error(errorData.detail || `HTTP ${response.status}`);
          }

          const data: IngestResponse = await response.json();

          // Return a success message
          const successMessage = `✅ **File ingested successfully!**\n\n` +
            `**Repository:** ${data.repo_url}\n` +
            `**File:** ${data.file_path}\n` +
            `**Summary:** ${data.summary}\n\n` +
            `The file has been embedded with ${data.embedding_dimensions} dimensions. You can now ask questions about this code!`;

          return NextResponse.json({
            role: 'assistant',
            content: successMessage,
          });
        } catch (error) {
          console.error('Ingestion error:', error);
          return NextResponse.json({
            role: 'assistant',
            content: `❌ **Error ingesting file:** ${formatError(error)}\n\nPlease check the command format and try again.`,
          });
        }
      } else {
        // Unknown slash command
        return NextResponse.json({
          role: 'assistant',
          content: `❌ **Unknown command**\n\nAvailable commands:\n- \`/help\` - Learn how SemSearch AI works\n- \`/ingest <repo_url> <file_path>\` - Ingest a file from a GitHub repository\n- \`/ingest <full_github_blob_url>\` - Ingest a file using a full GitHub URL\n\nExample: \`/ingest https://github.com/owner/repo src/main.py\``,
        });
      }
    }

    // Check if the message contains a GitHub URL (backward compatibility)
    if (isGithubUrl(userMessage)) {
      // Extract and parse the GitHub URL
      const githubUrl = userMessage.match(/https?:\/\/github\.com\/[\w-]+\/[\w.-]+\/blob\/[\w.-]+\/.+/)?.[0];

      if (!githubUrl) {
        return NextResponse.json(
          { error: 'Could not extract GitHub URL' },
          { status: 400 }
        );
      }

      const parsed = parseGithubUrl(githubUrl);

      if (!parsed) {
        return NextResponse.json(
          { error: 'Invalid GitHub URL format. Please use a URL like: https://github.com/owner/repo/blob/branch/path/to/file.ext' },
          { status: 400 }
        );
      }

      // Call the ingest endpoint
      try {
        const response = await fetch(`${apiUrl}/api/ingest/file`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            repo_url: parsed.repo_url,
            file_path: parsed.file_path,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
          throw new Error(errorData.detail || `HTTP ${response.status}`);
        }

        const data: IngestResponse = await response.json();

        // Return a success message
        const successMessage = `✅ **File ingested successfully!**\n\n` +
          `**Repository:** ${data.repo_url}\n` +
          `**File:** ${data.file_path}\n` +
          `**Summary:** ${data.summary}\n\n` +
          `The file has been embedded with ${data.embedding_dimensions} dimensions. You can now ask questions about this code!`;

        return NextResponse.json({
          role: 'assistant',
          content: successMessage,
        });
      } catch (error) {
        console.error('Ingestion error:', error);
        return NextResponse.json({
          role: 'assistant',
          content: `❌ **Error ingesting file:** ${formatError(error)}\n\nPlease check the URL and try again.`,
        });
      }
    } else {
      // This is a question - call semantic search endpoint
      try {
        const response = await fetch(`${apiUrl}/api/semantic_search`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: userMessage,
            limit: 5,
            similarity_threshold: 0.7,
            synthesize: true,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
          throw new Error(errorData.detail || `HTTP ${response.status}`);
        }

        const data: SemanticSearchResponse = await response.json();

        // Format the response
        let formattedResponse = '';

        if (data.synthesized_answer) {
          formattedResponse = data.synthesized_answer;
        } else {
          formattedResponse = `Found ${data.total_matches} matches, but no synthesized answer was generated.`;
        }

        // Add search metadata
        formattedResponse += `\n\n---\n\n`;
        formattedResponse += `**Search Strategy:** ${data.source}\n`;
        if (data.reasoning) {
          formattedResponse += `**Reasoning:** ${data.reasoning}\n`;
        }
        if (data.synthesis_sources && data.synthesis_sources.length > 0) {
          formattedResponse += `**Sources:** ${data.synthesis_sources.slice(0, 3).join(', ')}`;
        }

        return NextResponse.json({
          role: 'assistant',
          content: formattedResponse,
        });
      } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({
          role: 'assistant',
          content: `❌ **Error searching:** ${formatError(error)}\n\nPlease make sure you've ingested a file first, or try a different question.`,
        });
      }
    }
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: formatError(error) },
      { status: 500 }
    );
  }
}
