/**
 * Utility to download all artifacts as a zip file.
 */
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import type { Artifact } from '../types';

/**
 * Get the file extension for an artifact type.
 */
function getExtension(type: Artifact['type'], title: string): string {
    if (type === 'code') {
        // Check if the title already has an extension
        if (title.includes('.')) {
            return '';
        }
        return '.py';
    }
    if (type === 'test') {
        return '.md';
    }
    return '.md';
}

/**
 * Sanitize a filename for safe storage.
 */
function sanitizeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}

/**
 * Download all artifacts as a zip file.
 */
export async function downloadArtifacts(artifacts: Artifact[], sprintGoal: string): Promise<void> {
    if (artifacts.length === 0) {
        throw new Error('No artifacts to download');
    }

    const zip = new JSZip();

    // Create a folder structure
    const folder = zip.folder('sprint-artifacts');
    if (!folder) {
        throw new Error('Failed to create zip folder');
    }

    // Add a README with sprint info
    const readme = `# Sprint Artifacts

**Goal:** ${sprintGoal}
**Generated:** ${new Date().toISOString()}
**Artifacts:** ${artifacts.length}

## Contents

${artifacts.map((a, i) => `${i + 1}. **${a.title}** (${a.type})`).join('\n')}
`;
    folder.file('README.md', readme);

    // Add each artifact
    for (const artifact of artifacts) {
        const ext = getExtension(artifact.type, artifact.title);
        const filename = sanitizeFilename(artifact.title) + ext;
        const content = artifact.content || artifact.preview || '';
        folder.file(filename, content);
    }

    // Generate and download
    const blob = await zip.generateAsync({ type: 'blob' });
    const timestamp = new Date().toISOString().split('T')[0];
    saveAs(blob, `sprint-artifacts-${timestamp}.zip`);
}
