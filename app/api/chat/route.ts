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
          content: `❌ **Unknown command**\n\nAvailable commands:\n- \`/ingest <repo_url> <file_path>\` - Ingest a file from a GitHub repository\n- \`/ingest <full_github_blob_url>\` - Ingest a file using a full GitHub URL\n\nExample: \`/ingest https://github.com/owner/repo src/main.py\``,
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
