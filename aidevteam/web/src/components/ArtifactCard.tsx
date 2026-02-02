import { motion } from 'framer-motion';
import { FileCode, FileText, TestTube } from 'lucide-react';
import type { Artifact } from '../types';

interface ArtifactCardProps {
    artifact: Artifact;
    onClick: () => void;
}

const typeIcons = {
    design: FileText,
    code: FileCode,
    test: TestTube,
};

const typeColors = {
    design: 'border-purple-500/50',
    code: 'border-cyan-500/50',
    test: 'border-emerald-400/50',
};

export function ArtifactCard({ artifact, onClick }: ArtifactCardProps) {
    const Icon = typeIcons[artifact.type];

    return (
        <motion.div
            className={`glass-panel p-4 border-l-4 ${typeColors[artifact.type]} cursor-pointer hover:bg-white/10 transition`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={onClick}
        >
            <div className="flex items-center gap-3 mb-2">
                <Icon className="w-5 h-5 text-white/60" />
                <h3 className="font-medium text-white/90">{artifact.title}</h3>
            </div>
            {artifact.preview && (
                <p className="text-xs text-white/50 font-mono truncate">{artifact.preview}</p>
            )}
            {artifact.timestamp && (
                <p className="text-xs text-white/30 mt-2">{artifact.timestamp}</p>
            )}
        </motion.div>
    );
}
