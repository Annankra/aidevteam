/**
 * WebSocket API service for connecting to the backend sprint server.
 */

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000';

export type MessageHandler = (data: SprintUpdate) => void;

export interface SprintUpdate {
    type: 'agent_update' | 'artifact' | 'log' | 'complete' | 'error';
    data: Record<string, unknown>;
}

export interface AgentUpdateData {
    agent_id: string;
    name: string;
    status: 'idle' | 'thinking' | 'active' | 'done';
    thought?: string;
}

export interface ArtifactData {
    id: string;
    title: string;
    type: 'design' | 'code' | 'test';
    preview: string;
    content: string;
    timestamp: string;
}

export interface LogData {
    id: string;
    agent: string;
    message: string;
    timestamp: string;
}

export class SprintWebSocket {
    private ws: WebSocket | null = null;
    private sessionId: string;
    private onMessage: MessageHandler;
    private onError: (error: string) => void;
    private onClose: () => void;

    constructor(
        sessionId: string,
        onMessage: MessageHandler,
        onError: (error: string) => void,
        onClose: () => void
    ) {
        this.sessionId = sessionId;
        this.onMessage = onMessage;
        this.onError = onError;
        this.onClose = onClose;
    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            const url = `${WS_URL}/ws/sprint/${this.sessionId}`;
            this.ws = new WebSocket(url);

            this.ws.onopen = () => {
                console.log('[WebSocket] Connected to sprint server');
                resolve();
            };

            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data) as SprintUpdate;

                    if ('error' in data) {
                        this.onError(data.error as string);
                        return;
                    }

                    this.onMessage(data);
                } catch (e) {
                    console.error('[WebSocket] Failed to parse message:', e);
                }
            };

            this.ws.onerror = (error) => {
                console.error('[WebSocket] Error:', error);
                this.onError('WebSocket connection error');
                reject(error);
            };

            this.ws.onclose = () => {
                console.log('[WebSocket] Connection closed');
                this.onClose();
            };
        });
    }

    startSprint(goal: string): void {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ goal }));
        } else {
            this.onError('WebSocket not connected');
        }
    }

    disconnect(): void {
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}

/**
 * Create a new WebSocket connection for a sprint session.
 */
export function createSprintConnection(
    onMessage: MessageHandler,
    onError: (error: string) => void,
    onClose: () => void
): SprintWebSocket {
    const sessionId = crypto.randomUUID();
    return new SprintWebSocket(sessionId, onMessage, onError, onClose);
}
