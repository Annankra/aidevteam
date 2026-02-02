import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { ArtifactCard } from './ArtifactCard';
import { ArtifactModal } from './ArtifactModal';
import { downloadArtifacts } from '../utils/downloadArtifacts';
import type { Artifact } from '../types';

interface ArtifactGalleryProps {
    artifacts: Artifact[];
    sprintGoal?: string;
}

export function ArtifactGallery({ artifacts, sprintGoal = '' }: ArtifactGalleryProps) {
    const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        if (artifacts.length === 0) return;

        setIsDownloading(true);
        try {
            await downloadArtifacts(artifacts, sprintGoal);
        } catch (error) {
            console.error('Failed to download artifacts:', error);
        } finally {
            setIsDownloading(false);
        }
    };

    if (artifacts.length === 0) {
        return (
            <section className="glass-panel p-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Artifact Gallery</h2>
                <p className="text-white/40 text-center py-8">No artifacts yet. Start a sprint to generate outputs.</p>
            </section>
        );
    }

    return (
        <>
            <section className="glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-white">Artifact Gallery</h2>
                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-medium text-white text-sm shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {isDownloading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Downloading...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Download All
                            </>
                        )}
                    </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {artifacts.map((artifact) => (
                        <ArtifactCard
                            key={artifact.id}
                            artifact={artifact}
                            onClick={() => setSelectedArtifact(artifact)}
                        />
                    ))}
                </div>
            </section>

            {selectedArtifact && (
                <ArtifactModal
                    artifact={selectedArtifact}
                    onClose={() => setSelectedArtifact(null)}
                />
            )}
        </>
    );
}
