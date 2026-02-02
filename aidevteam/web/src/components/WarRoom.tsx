import { motion } from 'framer-motion';
import { AgentOrb } from './AgentOrb';
import type { Agent } from '../types';

interface WarRoomProps {
    agents: Agent[];
}

export function WarRoom({ agents }: WarRoomProps) {
    return (
        <section className="glass-panel p-8">
            <h2 className="text-xl font-semibold mb-8 text-center text-white">Agent War Room</h2>
            <div className="flex justify-around items-start">
                {agents.map((agent, index) => (
                    <motion.div
                        key={agent.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <AgentOrb
                            name={agent.name}
                            role={agent.role}
                            status={agent.status}
                            thought={agent.thought}
                        />
                    </motion.div>
                ))}
            </div>
            {/* Connection lines (visual only) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00D2FF" />
                        <stop offset="100%" stopColor="#9D50BB" />
                    </linearGradient>
                </defs>
            </svg>
        </section>
    );
}
