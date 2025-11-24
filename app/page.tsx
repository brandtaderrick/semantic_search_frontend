import Link from "next/link";
import { Boxes } from "@/components/ui/background-boxes";

export default function Home() {
  return (
    <div className="min-h-screen relative bg-slate-950 overflow-hidden">
      {/* 3D Background Grid */}
      <div className="absolute inset-0 w-full h-full">
        <Boxes />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 min-h-screen bg-gradient-to-br from-slate-950/90 via-slate-900/80 to-slate-950/90">
        {/* Top Navigation */}
        <nav className="max-w-6xl px-4 py-4">
          <div className="text-2xl font-bold font-mono bg-gray-400 opacity-20 bg-clip-text text-transparent">
            SemSearch AI
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="pb-3 text-5xl font-bold font-display mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Semantic Search for Legacy Code
          </h1>
          <p className="text-xl text-gray-400 opacity-70 max-w-2xl mx-auto">
            Reduce onboarding time by 40%. AI-powered search that understands your legacy codebase.
          </p>

          {/* Powered By Section */}
          <div className="mt-12">
            <p className="text-sm text-gray-400 opacity-50 italic mb-6 uppercase tracking-wider">Powered By</p>
            <div className="flex items-center justify-center gap-12 flex-wrap">
              {/* MongoDB Vector Search Logo */}
              <div className="flex items-center gap-4 px-8 py-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-lg hover:bg-slate-800/50 transition-all">
                <img
                  src="/mongodb-logo.svg"
                  alt="MongoDB Vector Search"
                  className="w-12 h-12"
                />
                <div className="text-left">
                  <div className="text-gray-200 font-semibold text-xl">MongoDB</div>
                  <div className="text-gray-400 text-sm">Vector Search</div>
                </div>
              </div>

              {/* Tavily Logo */}
              <div className="flex items-center gap-4 px-8 py-4 bg-slate-800/30 backdrop-blur-sm border border-slate-700/30 rounded-lg hover:bg-slate-800/50 transition-all">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                  <img
                  src="/tavily-color.svg"
                  alt="MongoDB Vector Search"
                  className="w-12 h-12"
                />
                </div>
                <div className="text-left">
                  <div className="text-gray-200 font-semibold text-xl">Tavily</div>
                  <div className="text-gray-400 text-sm">AI Search</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-lg shadow-lg hover:bg-slate-800/70 transition-all">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-200">Semantic Understanding</h3>
            <p className="text-gray-400">
              Ask questions in natural language. Our AI understands intent, not just keywords.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-lg shadow-lg hover:bg-slate-800/70 transition-all">
            <div className="text-3xl mb-3">⚡</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-200">Instant Answers</h3>
            <p className="text-gray-400">
              Get synthesized answers from your codebase and external documentation in seconds.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-lg shadow-lg hover:bg-slate-800/70 transition-all">
            <div className="text-3xl mb-3">📚</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-200">Legacy Code Friendly</h3>
            <p className="text-gray-400">
              Perfect for undocumented code, weird decisions, and obscure syntax from older languages.
            </p>
          </div>
        </div>

        {/* Problem Statement */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-lg shadow-lg mb-12">
          <h2 className="text-2xl font-bold mb-4 text-gray-200">The Problem</h2>
          <ul className="space-y-3 text-gray-300">
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
          <p className="mt-4 text-gray-400">
            No signup required. Just paste a GitHub URL and start asking questions.
          </p>
        </div>

        {/* Example */}
        <div className="mt-16 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-6 rounded-lg">
          <h3 className="text-gray-200 font-medium mb-3">Example Usage:</h3>
          <div className="space-y-2 font-mono text-sm">
            <div className="text-green-400">User: https://github.com/llvm/llvm-project/blob/main/llvm/include/llvm/ADT/StringRef.cpp</div>
            <div className="text-gray-400">AI: ✓ File ingested and embedded successfully</div>
            <div className="text-green-400">User: Explain how the find function works in this file</div>
            <div className="text-blue-400">AI: The find function uses std::memcmp for efficient memory comparison...</div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
