export type AgentStatus = 'idle' | 'thinking' | 'active' | 'done';

export interface Agent {
    id: string;
    name: string;
    role: 'po' | 'architect' | 'dev' | 'qa';
    status: AgentStatus;
    thought?: string;
}

export interface Artifact {
    id: string;
    title: string;
    type: 'design' | 'code' | 'test';
    preview?: string;
    content?: string;
    timestamp?: string;
}

export interface LogEntry {
    id: string;
    agent: string;
    message: string;
    timestamp: string;
}
