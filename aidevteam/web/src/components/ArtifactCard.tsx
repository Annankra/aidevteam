import { motion } from 'framer-motion';
import { FileCode, FileText, TestTube } from 'lucide-react';

type ArtifactType = 'design' | 'code' | 'test';

interface ArtifactCardProps {
    title: string;
    type: ArtifactType;
    preview?: string;
    timestamp?: string;
}

const typeIcons = {
    design: FileText,
    code: FileCode,
    test: TestTube,
};

const typeColors = {
    design: 'border-neon-purple/50',
    code: 'border-cyber-blue/50',
    test: 'border-emerald-glow/50',
};

export function ArtifactCard({ title, type, preview, timestamp }: ArtifactCardProps) {
    const Icon = typeIcons[type];

    return (
        <motion.div
            className={`glass-panel p-4 border-l-4 ${typeColors[type]} cursor-pointer hover:bg-white/10 transition`}
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
        >
            <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 text-white/60" />
                <h3 className="font-medium text-white/90">{title}</h3>
            </div>
            {preview && (
                <p className="text-xs text-white/50 font-mono truncate">{preview}</p>
            )}
            {timestamp && (
                <p className="text-xs text-white/30 mt-2">{timestamp}</p>
            )}
        </motion.div>
    );
}
