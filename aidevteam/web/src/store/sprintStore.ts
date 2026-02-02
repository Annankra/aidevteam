import { create } from 'zustand';
import type { Agent, Artifact, LogEntry, AgentStatus } from '../types';
import { createSprintConnection, SprintWebSocket } from '../services/api';
import type { SprintUpdate } from '../services/api';

// Inline type definitions to avoid module export issues
interface AgentUpdatePayload {
    agent_id: string;
    name: string;
    status: 'idle' | 'thinking' | 'active' | 'done';
    thought?: string;
}

interface ArtifactPayload {
    id: string;
    title: string;
    type: 'design' | 'code' | 'test';
    preview: string;
    content: string;
    timestamp: string;
}

interface LogPayload {
    id: string;
    agent: string;
    message: string;
    timestamp: string;
}

interface SprintStore {
    goal: string;
    isRunning: boolean;
    isConnected: boolean;
    error: string | null;
    agents: Agent[];
    artifacts: Artifact[];
    logs: LogEntry[];
    setGoal: (goal: string) => void;
    startSprint: () => void;
    reset: () => void;
}

const initialAgents: Agent[] = [
    { id: 'po', name: 'Product Owner', role: 'po', status: 'idle' },
    { id: 'arch', name: 'Architect', role: 'architect', status: 'idle' },
    { id: 'dev', name: 'Developer', role: 'dev', status: 'idle' },
    { id: 'qa', name: 'QA Engineer', role: 'qa', status: 'idle' },
];

let wsConnection: SprintWebSocket | null = null;

export const useSprintStore = create<SprintStore>((set, get) => ({
    goal: '',
    isRunning: false,
    isConnected: false,
    error: null,
    agents: [...initialAgents],
    artifacts: [],
    logs: [],

    setGoal: (goal) => set({ goal }),

    reset: () => set({
        isRunning: false,
        isConnected: false,
        error: null,
        agents: [...initialAgents],
        artifacts: [],
        logs: [],
    }),

    startSprint: async () => {
        const { goal, reset } = get();
        if (!goal.trim()) return;

        // Reset state
        reset();
        set({ isRunning: true, goal });

        // Handle incoming messages
        const handleMessage = (update: SprintUpdate) => {
            switch (update.type) {
                case 'agent_update': {
                    const data = update.data as unknown as AgentUpdatePayload;
                    set((state) => ({
                        agents: state.agents.map((a) =>
                            a.id === data.agent_id
                                ? { ...a, status: data.status as AgentStatus, thought: data.thought }
                                : a
                        ),
                    }));
                    break;
                }
                case 'artifact': {
                    const data = update.data as unknown as ArtifactPayload;
                    set((state) => ({
                        artifacts: [...state.artifacts, {
                            id: data.id,
                            title: data.title,
                            type: data.type,
                            preview: data.preview,
                            content: data.content,
                            timestamp: data.timestamp,
                        }],
                    }));
                    break;
                }
                case 'log': {
                    const data = update.data as unknown as LogPayload;
                    set((state) => ({
                        logs: [...state.logs, {
                            id: data.id,
                            agent: data.agent,
                            message: data.message,
                            timestamp: data.timestamp,
                        }],
                    }));
                    break;
                }
                case 'complete': {
                    set({ isRunning: false });
                    if (wsConnection) {
                        wsConnection.disconnect();
                        wsConnection = null;
                    }
                    break;
                }
            }
        };

        const handleError = (error: string) => {
            console.error('[Sprint] Error:', error);
            set({ error, isRunning: false });
        };

        const handleClose = () => {
            set({ isConnected: false });
        };

        // Create WebSocket connection
        try {
            wsConnection = createSprintConnection(handleMessage, handleError, handleClose);
            await wsConnection.connect();
            set({ isConnected: true });
            wsConnection.startSprint(goal);
        } catch (error) {
            set({
                error: 'Failed to connect to backend. Make sure the server is running.',
                isRunning: false
            });
        }
    },
}));
