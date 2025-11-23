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
