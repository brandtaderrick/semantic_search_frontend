import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Semantic Search for Legacy Code
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Reduce onboarding time by 40%. AI-powered search that understands your legacy codebase.
          </p>
        </div>

        {/* Value Proposition */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-xl font-semibold mb-2">Semantic Understanding</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Ask questions in natural language. Our AI understands intent, not just keywords.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Instant Answers</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Get synthesized answers from your codebase and external documentation in seconds.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-xl font-semibold mb-2">Legacy Code Friendly</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Perfect for undocumented code, weird decisions, and obscure syntax from older languages.
            </p>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-4">The Problem</h2>
          <ul className="space-y-3 text-gray-600 dark:text-gray-300">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span><strong>40% of dev time</strong> is spent working with legacy code</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Onboarding takes <strong>weeks or months</strong> for complex codebases</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Lack of documentation makes understanding code <strong>fuzzy and time-consuming</strong></span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              <span>Older syntax and weird architectural decisions are <strong>hard to parse</strong></span>
            </li>
          </ul>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-lg shadow-lg mb-12 text-white">
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl font-bold mb-2">1</div>
              <h3 className="font-semibold mb-2">Ingest Code</h3>
              <p className="text-blue-100">Paste a GitHub file URL. We summarize and embed it into our vector database.</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2</div>
              <h3 className="font-semibold mb-2">Ask Questions</h3>
              <p className="text-blue-100">Ask about syntax, architecture, or get an overview. Our AI searches semantically.</p>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">3</div>
              <h3 className="font-semibold mb-2">Get Answers</h3>
              <p className="text-blue-100">Receive synthesized answers combining your code and external documentation.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/chat"
            className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Start Searching →
          </Link>
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            No signup required. Just paste a GitHub URL and start asking questions.
          </p>
        </div>

        {/* Example */}
        <div className="mt-16 bg-gray-800 p-6 rounded-lg">
          <h3 className="text-white font-semibold mb-3">Example Usage:</h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="text-green-400">User: https://github.com/llvm/llvm-project/blob/main/llvm/include/llvm/ADT/StringRef.cpp</div>
            <div className="text-gray-400">AI: ✓ File ingested and embedded successfully</div>
            <div className="text-green-400">User: Explain how the find function works in this file</div>
            <div className="text-blue-400">AI: The find function uses std::memcmp for efficient memory comparison...</div>
          </div>
        </div>
      </div>
    </div>
  );
}
