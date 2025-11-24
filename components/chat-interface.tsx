'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '👋 Welcome! I can help you understand code from your ingested repositories.\n\n**To ingest a file, use the `/ingest` command:**\n- `/ingest https://github.com/owner/repo path/to/file.py`\n- `/ingest https://github.com/owner/repo/blob/main/path/to/file.cpp`\n\n**Then ask me questions:**\n- "Explain how the authentication works"\n- "What does this function do?"\n- "Give me an overview of this code"\n\n**Pro tip:** You can ingest multiple files and ask questions about all of them!'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input.trim()
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Add assistant response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.content
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '❌ Sorry, there was an error processing your request. Please try again.'
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (content: string) => {
    // Simple markdown-like formatting
    const formatted = content
      .split('\n')
      .map((line, i) => {
        // Bold text
        line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        // Code blocks
        if (line.startsWith('```')) {
          return `<pre class="bg-slate-900 text-gray-100 p-3 rounded my-2 overflow-x-auto border border-slate-700/50"><code>${line.slice(3)}</code></pre>`;
        }
        // Inline code
        line = line.replace(/`(.+?)`/g, '<code class="bg-slate-900 text-blue-300 px-1.5 py-0.5 rounded border border-slate-700/50">$1</code>');
        return line;
      })
      .join('<br/>');
    return formatted;
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700/50 px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold font-mono text-gray-400 opacity-50">
            SemSearch AI
          </h1>
          <p className="text-sm text-gray-400">
            Use /ingest to add code, then ask questions
          </p>
        </div>
        <Link
          href="/"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          ← Back to Home
        </Link>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl rounded-lg px-6 py-4 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'bg-slate-800/60 backdrop-blur-sm text-gray-300 border border-slate-700/50'
              }`}
            >
              {message.role === 'assistant' ? (
                <div
                  className="prose dark:prose-invert max-w-none leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                />
              ) : (
                <div className="whitespace-pre-wrap break-words">{message.content}</div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-3xl rounded-lg px-6 py-4 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-t border-slate-700/50 p-6">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex space-x-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type /ingest to add code, or ask a question..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-900/50 text-gray-200 placeholder-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all shadow-lg"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>

          {/* Example prompts */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setInput('Explain how this code works at a high level')}
              className="text-xs px-3 py-1 bg-slate-700/50 text-gray-300 rounded-full hover:bg-slate-700 transition-all"
            >
              💡 Overview
            </button>
            <button
              type="button"
              onClick={() => setInput('What is the purpose of this file?')}
              className="text-xs px-3 py-1 bg-slate-700/50 text-gray-300 rounded-full hover:bg-slate-700 transition-all"
            >
              📋 Purpose
            </button>
            <button
              type="button"
              onClick={() => setInput('Are there any unusual patterns or anti-patterns in this code?')}
              className="text-xs px-3 py-1 bg-slate-700/50 text-gray-300 rounded-full hover:bg-slate-700 transition-all"
            >
              🔍 Code Review
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
