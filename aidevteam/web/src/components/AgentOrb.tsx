import { motion } from 'framer-motion';
import { Bot, Briefcase, Code, FlaskConical } from 'lucide-react';

export type AgentStatus = 'idle' | 'thinking' | 'active' | 'done';

interface AgentOrbProps {
    name: string;
    role: 'po' | 'architect' | 'dev' | 'qa';
    status: AgentStatus;
    thought?: string;
}

const roleIcons = {
    po: Briefcase,
    architect: Bot,
    dev: Code,
    qa: FlaskConical,
};

const statusColors: Record<AgentStatus, string> = {
    idle: 'from-white/10 to-white/5',
    thinking: 'from-neon-purple/40 to-cyber-blue/40',
    active: 'from-cyber-blue/60 to-neon-purple/60',
    done: 'from-emerald-glow/40 to-emerald-glow/20',
};

export function AgentOrb({ name, role, status, thought }: AgentOrbProps) {
    const Icon = roleIcons[role];

    return (
        <div className="flex flex-col items-center gap-3">
            <motion.div
                className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${statusColors[status]} border border-white/20 flex items-center justify-center`}
                animate={{
                    scale: status === 'active' ? [1, 1.08, 1] : 1,
                    boxShadow: status === 'active'
                        ? ['0 0 20px rgba(0,210,255,0.3)', '0 0 40px rgba(0,210,255,0.5)', '0 0 20px rgba(0,210,255,0.3)']
                        : '0 0 10px rgba(255,255,255,0.1)',
                }}
                transition={{
                    repeat: status === 'active' ? Infinity : 0,
                    duration: 1.5,
                }}
            >
                <Icon className="w-8 h-8 text-white/80" />
                {status === 'thinking' && (
                    <motion.div
                        className="absolute -top-1 -right-1 w-4 h-4 bg-neon-purple rounded-full"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                    />
                )}
                {status === 'done' && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-glow rounded-full flex items-center justify-center text-xs">
                        ✓
                    </div>
                )}
            </motion.div>
            <p className="text-sm font-medium text-white/80">{name}</p>
            {thought && (
                <motion.p
                    className="text-xs text-white/50 max-w-[120px] text-center italic"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {thought}
                </motion.p>
            )}
        </div>
    );
}
