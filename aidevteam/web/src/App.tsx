import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-deep-space p-8">
      {/* Header */}
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-cyber-blue to-neon-purple bg-clip-text text-transparent">
          AI Dev Team
        </h1>
        <p className="text-white/60 mt-2">Mission Control</p>
      </header>

      {/* Main Dashboard */}
      <main className="max-w-6xl mx-auto grid gap-8">
        {/* Command Input */}
        <section className="glass-panel p-6">
          <label className="block text-sm text-white/60 mb-2">Sprint Goal</label>
          <textarea
            className="w-full bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-cyber-blue/50 resize-none"
            placeholder="Describe your application idea..."
            rows={3}
          />
          <button className="mt-4 px-6 py-3 bg-gradient-to-r from-cyber-blue to-neon-purple rounded-lg font-medium text-white shadow-glow-blue hover:scale-105 transition-transform">
            🚀 Start Sprint
          </button>
        </section>

        {/* Agent Status */}
        <section className="glass-panel p-6">
          <h2 className="text-xl font-semibold mb-6">Agent War Room</h2>
          <div className="flex justify-around">
            {['Product Owner', 'Architect', 'Developer', 'QA'].map((agent) => (
              <div key={agent} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyber-blue/30 to-neon-purple/30 border border-cyber-blue/50 flex items-center justify-center animate-pulse-glow">
                  <span className="text-2xl">🤖</span>
                </div>
                <p className="mt-2 text-sm text-white/60">{agent}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Placeholder for logs */}
        <section className="glass-panel p-6">
          <h2 className="text-xl font-semibold mb-4">System Pulse</h2>
          <div className="bg-black/30 rounded-lg p-4 font-mono text-sm text-emerald-glow h-40 overflow-y-auto">
            <p>[System] Awaiting sprint initialization...</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
