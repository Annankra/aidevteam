import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface LogEntry {
    id: string;
    agent: string;
    message: string;
    timestamp: string;
}

interface SystemPulseProps {
    logs: LogEntry[];
}

const agentColors: Record<string, string> = {
    'System': 'text-emerald-glow',
    'Product Owner': 'text-neon-purple',
    'Architect': 'text-cyber-blue',
    'Developer': 'text-blue-400',
    'QA': 'text-yellow-400',
};

export function SystemPulse({ logs }: SystemPulseProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <section className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4">System Pulse</h2>
            <div
                ref={scrollRef}
                className="bg-black/40 rounded-lg p-4 font-mono text-sm h-48 overflow-y-auto space-y-1"
            >
                {logs.length === 0 ? (
                    <p className="text-white/30">[System] Awaiting sprint initialization...</p>
                ) : (
                    logs.map((log, index) => (
                        <motion.div
                            key={log.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="flex gap-2"
                        >
                            <span className="text-white/30">[{log.timestamp}]</span>
                            <span className={agentColors[log.agent] || 'text-white/60'}>
                                [{log.agent}]
                            </span>
                            <span className="text-white/80">{log.message}</span>
                        </motion.div>
                    ))
                )}
            </div>
        </section>
    );
}
