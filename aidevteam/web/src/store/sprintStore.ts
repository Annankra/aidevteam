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
        addArtifact({
            title: 'User Stories',
            type: 'design',
            preview: '3 stories defined',
            content: `# User Stories for: ${goal}

## Story 1: Core Functionality
**As a** user
**I want to** access the main feature
**So that** I can accomplish my primary goal

### Acceptance Criteria:
- [ ] Feature is accessible from the main dashboard
- [ ] Feature responds within 200ms
- [ ] Error states are handled gracefully

---

## Story 2: User Authentication
**As a** user
**I want to** securely log in
**So that** my data is protected

### Acceptance Criteria:
- [ ] JWT-based authentication
- [ ] Password validation
- [ ] Session management

---

## Story 3: Data Persistence
**As a** user
**I want to** save my progress
**So that** I can continue later

### Acceptance Criteria:
- [ ] Auto-save functionality
- [ ] Manual save option
- [ ] Data recovery on failure`,
        });
        updateAgentStatus('po', 'done');
        addLog('Product Owner', 'User stories defined and prioritized.');

        // Phase 2: Architect
        updateAgentStatus('arch', 'active', 'Designing system...');
        addLog('Architect', 'Creating technical design document...');
        await delay(2000);
        addArtifact({
            title: 'Technical Design',
            type: 'design',
            preview: 'FastAPI + React',
            content: `# Technical Design Document

## Overview
This document outlines the technical architecture for: ${goal}

## Tech Stack
- **Backend**: FastAPI (Python 3.11+)
- **Frontend**: React 18 + TypeScript + Tailwind
- **Database**: PostgreSQL 15
- **Cache**: Redis 7

## Architecture Diagram

\`\`\`
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   React     │────▶│   FastAPI   │────▶│  PostgreSQL │
│   Frontend  │     │   Backend   │     │   Database  │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    Redis    │
                    │    Cache    │
                    └─────────────┘
\`\`\`

## API Endpoints
- \`POST /api/v1/auth\` - Authentication
- \`GET /api/v1/data\` - Fetch data
- \`POST /api/v1/data\` - Create data
- \`PUT /api/v1/data/{id}\` - Update data

## Security Considerations
- HTTPS only
- JWT with 1-hour expiry
- Rate limiting: 100 req/min`,
        });
        updateAgentStatus('arch', 'done');
        addLog('Architect', 'Architecture approved. Ready for implementation.');

        // Phase 3: Developer
        updateAgentStatus('dev', 'active', 'Writing code...');
        addLog('Developer', 'Implementing API endpoints...');
        await delay(2500);
        addArtifact({
            title: 'main.py',
            type: 'code',
            preview: 'def health_check(): ...',
            content: `"""
FastAPI Application - Generated for: ${goal}
"""
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import uvicorn

app = FastAPI(
    title="AI Dev Team API",
    description="Auto-generated API for ${goal}",
    version="1.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class DataItem(BaseModel):
    id: Optional[str] = None
    name: str
    value: str

class HealthResponse(BaseModel):
    status: str
    version: str

# Endpoints
@app.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint"""
    return HealthResponse(status="healthy", version="1.0.0")

@app.get("/api/v1/data")
def get_data():
    """Fetch all data items"""
    return {"items": [], "total": 0}

@app.post("/api/v1/data")
def create_data(item: DataItem):
    """Create a new data item"""
    item.id = "generated-id"
    return item

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)`,
        });
        updateAgentStatus('dev', 'done');
        addLog('Developer', 'Implementation complete. Handing off to QA.');

        // Phase 4: QA
        updateAgentStatus('qa', 'active', 'Running tests...');
        addLog('QA', 'Executing automated test suite...');
        await delay(2000);
        addArtifact({
            title: 'Test Report',
            type: 'test',
            preview: '100% PASS',
            content: `# Test Execution Report

## Summary
- **Total Tests**: 12
- **Passed**: 12
- **Failed**: 0
- **Coverage**: 94%

## Test Results

### Unit Tests
✅ test_health_check - PASSED (0.02s)
✅ test_get_data_empty - PASSED (0.01s)
✅ test_create_data - PASSED (0.03s)
✅ test_create_data_validation - PASSED (0.02s)

### Integration Tests
✅ test_full_flow - PASSED (0.15s)
✅ test_concurrent_requests - PASSED (0.22s)
✅ test_error_handling - PASSED (0.04s)

### E2E Tests
✅ test_user_journey - PASSED (1.20s)
✅ test_authentication_flow - PASSED (0.45s)
✅ test_data_persistence - PASSED (0.38s)

### Performance Tests
✅ test_response_time_under_200ms - PASSED (0.18s)
✅ test_load_100_concurrent - PASSED (2.30s)

## Recommendations
- All tests passed ✅
- Code coverage meets threshold (>90%)
- Ready for deployment`,
        });
        updateAgentStatus('qa', 'done');
        addLog('QA', 'All tests passed. Sprint complete!');

        addLog('System', 'Sprint retrospective complete. Ready for next cycle.');
        set({ isRunning: false });
    },
}));

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
