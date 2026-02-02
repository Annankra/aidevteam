import { useState } from 'react';
import { ArtifactCard } from './ArtifactCard';
import { ArtifactModal } from './ArtifactModal';
import type { Artifact } from '../types';

interface ArtifactGalleryProps {
    artifacts: Artifact[];
}

export function ArtifactGallery({ artifacts }: ArtifactGalleryProps) {
    const [selectedArtifact, setSelectedArtifact] = useState<Artifact | null>(null);

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
                <h2 className="text-xl font-semibold mb-4 text-white">Artifact Gallery</h2>
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
