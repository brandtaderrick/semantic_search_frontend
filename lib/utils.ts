import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge class names with tailwind-merge to handle conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Parse a GitHub file URL into repo_url and file_path components
 * Example: https://github.com/llvm/llvm-project/blob/main/llvm/include/llvm/ADT/StringRef.cpp
 * Returns: { repo_url: "https://github.com/llvm/llvm-project", file_path: "llvm/include/llvm/ADT/StringRef.cpp" }
 */
export function parseGithubUrl(url: string): { repo_url: string; file_path: string } | null {
  try {
    // Regex to match GitHub file URLs
    const githubBlobRegex = /^https?:\/\/github\.com\/([\w-]+)\/([\w.-]+)\/blob\/([\w.-]+)\/(.+)$/;
    const match = url.match(githubBlobRegex);

    if (!match) {
      return null;
    }

    const [, owner, repo, , filePath] = match;

    return {
      repo_url: `https://github.com/${owner}/${repo}`,
      file_path: filePath
    };
  } catch (error) {
    console.error('Error parsing GitHub URL:', error);
    return null;
  }
}

/**
 * Detect if a message contains a GitHub file URL
 */
export function isGithubUrl(text: string): boolean {
  const githubUrlRegex = /https?:\/\/github\.com\/[\w-]+\/[\w.-]+\/blob\/[\w.-]+\/.+/;
  return githubUrlRegex.test(text);
}

/**
 * Get the API URL from environment variables
 */
export function getApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
}

/**
 * Format error messages for display
 */
export function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
}

/**
 * Check if a message is a slash command
 */
export function isSlashCommand(message: string): boolean {
  return message.trim().startsWith('/');
}

/**
 * Parse an /ingest command
 * Supports two formats:
 * 1. /ingest https://github.com/owner/repo/blob/main/path/to/file.py
 * 2. /ingest https://github.com/owner/repo path/to/file.py
 */
export function parseIngestCommand(message: string): { repo_url: string; file_path: string } | null {
  const trimmed = message.trim();

  // Check if it's an ingest command
  if (!trimmed.startsWith('/ingest ')) {
    return null;
  }

  // Remove the /ingest prefix
  const args = trimmed.substring(8).trim();

  // Try to parse as full GitHub blob URL first
  const blobMatch = args.match(/^(https?:\/\/github\.com\/[\w-]+\/[\w.-]+)\/blob\/[\w.-]+\/(.+)$/);
  if (blobMatch) {
    return {
      repo_url: blobMatch[1],
      file_path: blobMatch[2]
    };
  }

  // Try to parse as repo URL + file path
  const parts = args.split(/\s+/);
  if (parts.length >= 2) {
    const repoUrl = parts[0];
    const filePath = parts.slice(1).join(' ');

    // Validate repo URL format
    const repoMatch = repoUrl.match(/^https?:\/\/github\.com\/([\w-]+)\/([\w.-]+)(\.git)?$/);
    if (repoMatch) {
      return {
        repo_url: `https://github.com/${repoMatch[1]}/${repoMatch[2]}`,
        file_path: filePath
      };
    }
  }

  return null;
}
