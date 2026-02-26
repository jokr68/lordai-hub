export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Lord'ai</h1>
          <div className="flex gap-4">
            <a
              href="/auth/login"
              className="px-6 py-2 text-white hover:text-purple-300 transition"
            >
              Login
            </a>
            <a
              href="/auth/register"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Sign Up
            </a>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-6xl font-bold text-white mb-6">
            Create Your AI Characters
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Build, customize, and interact with AI-powered characters. 
            Bring your imagination to life with Lord'ai platform.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/auth/register"
              className="px-8 py-4 bg-purple-600 text-white text-lg rounded-lg hover:bg-purple-700 transition shadow-lg"
            >
              Get Started Free
            </a>
            <a
              href="/characters"
              className="px-8 py-4 bg-transparent border-2 border-white text-white text-lg rounded-lg hover:bg-white hover:text-purple-900 transition"
            >
              Explore Characters
            </a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <div className="text-4xl mb-4">🎭</div>
            <h3 className="text-xl font-bold mb-2">Custom Characters</h3>
            <p className="text-gray-300">
              Create unique AI characters with personalities, skills, and backstories.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-2">Real-time Chat</h3>
            <p className="text-gray-300">
              Engage in natural conversations with your AI characters.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <div className="text-4xl mb-4">🌍</div>
            <h3 className="text-xl font-bold mb-2">Multi-language</h3>
            <p className="text-gray-300">
              Full support for Arabic and multiple languages.
            </p>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-4 py-8 text-center text-gray-400">
        <p>&copy; 2024 Lord'ai Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}