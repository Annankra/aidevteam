import { create } from 'zustand';
import type { Agent, Artifact, LogEntry, AgentStatus } from '../types';

interface SprintStore {
    goal: string;
    isRunning: boolean;
    agents: Agent[];
    artifacts: Artifact[];
    logs: LogEntry[];
    setGoal: (goal: string) => void;
    startSprint: () => void;
    addLog: (agent: string, message: string) => void;
    updateAgentStatus: (agentId: string, status: AgentStatus, thought?: string) => void;
    addArtifact: (artifact: Omit<Artifact, 'id' | 'timestamp'>) => void;
}

const initialAgents: Agent[] = [
    { id: 'po', name: 'Product Owner', role: 'po', status: 'idle' },
    { id: 'arch', name: 'Architect', role: 'architect', status: 'idle' },
    { id: 'dev', name: 'Developer', role: 'dev', status: 'idle' },
    { id: 'qa', name: 'QA Engineer', role: 'qa', status: 'idle' },
];

const getTimestamp = () => new Date().toLocaleTimeString('en-US', { hour12: false });

export const useSprintStore = create<SprintStore>((set, get) => ({
    goal: '',
    isRunning: false,
    agents: initialAgents,
    artifacts: [],
    logs: [],

    setGoal: (goal) => set({ goal }),

    addLog: (agent, message) =>
        set((state) => ({
            logs: [...state.logs, { id: crypto.randomUUID(), agent, message, timestamp: getTimestamp() }],
        })),

    updateAgentStatus: (agentId, status, thought) =>
        set((state) => ({
            agents: state.agents.map((a) =>
                a.id === agentId ? { ...a, status, thought } : a
            ),
        })),

    addArtifact: (artifact) =>
        set((state) => ({
            artifacts: [...state.artifacts, { ...artifact, id: crypto.randomUUID(), timestamp: getTimestamp() }],
        })),

    startSprint: async () => {
        const { goal, addLog, updateAgentStatus, addArtifact } = get();
        if (!goal.trim()) return;

        set({ isRunning: true, logs: [], artifacts: [] });

        // Simulate sprint phases
        addLog('System', `Sprint started with goal: "${goal}"`);

        // Phase 1: Product Owner
        updateAgentStatus('po', 'active', 'Analyzing requirements...');
        addLog('Product Owner', 'Breaking down the goal into user stories...');
        await delay(2000);
        addArtifact({ title: 'User Stories', type: 'design', preview: '3 stories defined' });
        updateAgentStatus('po', 'done');
        addLog('Product Owner', 'User stories defined and prioritized.');

        // Phase 2: Architect
        updateAgentStatus('arch', 'active', 'Designing system...');
        addLog('Architect', 'Creating technical design document...');
        await delay(2000);
        addArtifact({ title: 'Technical Design', type: 'design', preview: 'FastAPI + React' });
        updateAgentStatus('arch', 'done');
        addLog('Architect', 'Architecture approved. Ready for implementation.');

        // Phase 3: Developer
        updateAgentStatus('dev', 'active', 'Writing code...');
        addLog('Developer', 'Implementing API endpoints...');
        await delay(2500);
        addArtifact({ title: 'main.py', type: 'code', preview: 'def health_check(): ...' });
        updateAgentStatus('dev', 'done');
        addLog('Developer', 'Implementation complete. Handing off to QA.');

        // Phase 4: QA
        updateAgentStatus('qa', 'active', 'Running tests...');
        addLog('QA', 'Executing automated test suite...');
        await delay(2000);
        addArtifact({ title: 'Test Report', type: 'test', preview: '100% PASS' });
        updateAgentStatus('qa', 'done');
        addLog('QA', 'All tests passed. Sprint complete!');

        addLog('System', 'Sprint retrospective complete. Ready for next cycle.');
        set({ isRunning: false });
    },
}));

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
