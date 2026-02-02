import { motion, AnimatePresence } from 'framer-motion';
import { X, FileCode, FileText, TestTube, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { Artifact } from '../types';

interface ArtifactModalProps {
    artifact: Artifact | null;
    onClose: () => void;
}

const typeIcons = {
    design: FileText,
    code: FileCode,
    test: TestTube,
};

const typeLabels = {
    design: 'Design Document',
    code: 'Source Code',
    test: 'Test Report',
};

export function ArtifactModal({ artifact, onClose }: ArtifactModalProps) {
    const [copied, setCopied] = useState(false);

    if (!artifact) return null;

    const Icon = typeIcons[artifact.type];

    const handleCopy = async () => {
        if (artifact.content) {
            await navigator.clipboard.writeText(artifact.content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div
                    className="glass-panel max-w-3xl w-full max-h-[80vh] overflow-hidden flex flex-col"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <Icon className="w-5 h-5 text-cyan-400" />
                            <div>
                                <h2 className="text-lg font-semibold text-white">{artifact.title}</h2>
                                <p className="text-xs text-white/50">{typeLabels[artifact.type]} • {artifact.timestamp}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {artifact.content && (
                                <button
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-white/10 rounded-lg transition text-white/60 hover:text-white"
                                    title="Copy to clipboard"
                                >
                                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                                </button>
                            )}
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/10 rounded-lg transition text-white/60 hover:text-white"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 overflow-y-auto flex-1">
                        {artifact.content ? (
                            <pre className="bg-black/40 rounded-lg p-4 text-sm font-mono text-white/80 whitespace-pre-wrap overflow-x-auto">
                                {artifact.content}
                            </pre>
                        ) : (
                            <p className="text-white/50 text-center py-8">No detailed content available.</p>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
