import { ArtifactCard } from './ArtifactCard';

interface Artifact {
    id: string;
    title: string;
    type: 'design' | 'code' | 'test';
    preview?: string;
    timestamp?: string;
}

interface ArtifactGalleryProps {
    artifacts: Artifact[];
}

export function ArtifactGallery({ artifacts }: ArtifactGalleryProps) {
    if (artifacts.length === 0) {
        return (
            <section className="glass-panel p-6">
                <h2 className="text-xl font-semibold mb-4">Artifact Gallery</h2>
                <p className="text-white/40 text-center py-8">No artifacts yet. Start a sprint to generate outputs.</p>
            </section>
        );
    }

    return (
        <section className="glass-panel p-6">
            <h2 className="text-xl font-semibold mb-4">Artifact Gallery</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {artifacts.map((artifact) => (
                    <ArtifactCard
                        key={artifact.id}
                        title={artifact.title}
                        type={artifact.type}
                        preview={artifact.preview}
                        timestamp={artifact.timestamp}
                    />
                ))}
            </div>
        </section>
    );
}
