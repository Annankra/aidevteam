import './index.css';
import { useState } from 'react';
import { WarRoom } from './components/WarRoom';
import { ArtifactGallery } from './components/ArtifactGallery';
import { SystemPulse } from './components/SystemPulse';

const initialAgents = [
  { id: 'po', name: 'Product Owner', role: 'po' as const, status: 'idle' as const },
  { id: 'arch', name: 'Architect', role: 'architect' as const, status: 'idle' as const },
  { id: 'dev', name: 'Developer', role: 'dev' as const, status: 'idle' as const },
  { id: 'qa', name: 'QA Engineer', role: 'qa' as const, status: 'idle' as const },
];

function App() {
  const [agents] = useState(initialAgents);
  const [goal, setGoal] = useState('');
  const [artifacts] = useState<{ id: string; title: string; type: 'design' | 'code' | 'test'; preview?: string; timestamp?: string }[]>([]);
  const [logs] = useState<{ id: string; agent: string; message: string; timestamp: string }[]>([]);

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
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />
          <button className="mt-4 px-6 py-3 bg-gradient-to-r from-cyber-blue to-neon-purple rounded-lg font-medium text-white shadow-glow-blue hover:scale-105 transition-transform">
            🚀 Start Sprint
          </button>
        </section>

        {/* Agent War Room */}
        <WarRoom agents={agents} />

        {/* Artifact Gallery */}
        <ArtifactGallery artifacts={artifacts} />

        {/* System Pulse (Logs) */}
        <SystemPulse logs={logs} />
      </main>
    </div>
  );
}

export default App;
