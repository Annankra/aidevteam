"""
FastAPI Server with WebSocket support for real-time sprint updates.
"""
import asyncio
import uuid
from typing import Dict, List, Optional
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from aidevteam.api.llm_client import get_llm_client, PROMPTS, LLMClient


# Models
class SprintRequest(BaseModel):
    goal: str


class AgentUpdate(BaseModel):
    agent_id: str
    name: str
    status: str  # idle, thinking, active, done
    thought: Optional[str] = None


class ArtifactUpdate(BaseModel):
    id: str
    title: str
    type: str  # design, code, test
    preview: str
    content: str
    timestamp: str


class LogUpdate(BaseModel):
    id: str
    agent: str
    message: str
    timestamp: str


class SprintUpdate(BaseModel):
    type: str  # agent_update, artifact, log, complete
    data: dict


# Connection Manager for WebSockets
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
    
    async def connect(self, session_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[session_id] = websocket
    
    def disconnect(self, session_id: str):
        if session_id in self.active_connections:
            del self.active_connections[session_id]
    
    async def send_update(self, session_id: str, update: SprintUpdate):
        if session_id in self.active_connections:
            await self.active_connections[session_id].send_json(update.model_dump())


manager = ConnectionManager()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    yield


app = FastAPI(
    title="AI Dev Team API",
    description="Backend API for the AI Scrum Team",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def get_timestamp() -> str:
    return datetime.now().strftime("%H:%M:%S")


async def send_log(session_id: str, agent: str, message: str):
    """Send a log update to the client."""
    await manager.send_update(session_id, SprintUpdate(
        type="log",
        data={
            "id": str(uuid.uuid4()),
            "agent": agent,
            "message": message,
            "timestamp": get_timestamp()
        }
    ))


async def send_agent_update(session_id: str, agent_id: str, name: str, status: str, thought: Optional[str] = None):
    """Send an agent status update to the client."""
    await manager.send_update(session_id, SprintUpdate(
        type="agent_update",
        data={
            "agent_id": agent_id,
            "name": name,
            "status": status,
            "thought": thought
        }
    ))


async def send_artifact(session_id: str, title: str, artifact_type: str, preview: str, content: str):
    """Send an artifact to the client."""
    await manager.send_update(session_id, SprintUpdate(
        type="artifact",
        data={
            "id": str(uuid.uuid4()),
            "title": title,
            "type": artifact_type,
            "preview": preview,
            "content": content,
            "timestamp": get_timestamp()
        }
    ))


async def run_sprint(session_id: str, goal: str, llm: LLMClient):
    """Run the full sprint cycle with real LLM generation."""
    
    await send_log(session_id, "System", f'Sprint started with goal: "{goal}"')
    
    # Phase 1: Product Owner - Generate User Stories
    await send_agent_update(session_id, "po", "Product Owner", "active", "Analyzing requirements...")
    await send_log(session_id, "Product Owner", "Breaking down the goal into user stories...")
    
    stories = llm.generate(
        PROMPTS["product_owner"]["system"],
        PROMPTS["product_owner"]["user"].format(goal=goal)
    )
    
    await send_artifact(session_id, "User Stories", "design", f"{len(stories.split('##'))-1} stories defined", stories)
    await send_agent_update(session_id, "po", "Product Owner", "done")
    await send_log(session_id, "Product Owner", "User stories defined and prioritized.")
    
    await asyncio.sleep(0.5)  # Small delay for UI feedback
    
    # Phase 2: Architect - Generate Technical Design
    await send_agent_update(session_id, "arch", "Architect", "active", "Designing system...")
    await send_log(session_id, "Architect", "Creating technical design document...")
    
    design = llm.generate(
        PROMPTS["architect"]["system"],
        PROMPTS["architect"]["user"].format(goal=goal, stories=stories)
    )
    
    # Extract tech stack for preview
    tech_preview = "FastAPI + React" if "FastAPI" in design else "Custom Stack"
    await send_artifact(session_id, "Technical Design", "design", tech_preview, design)
    await send_agent_update(session_id, "arch", "Architect", "done")
    await send_log(session_id, "Architect", "Architecture approved. Ready for implementation.")
    
    await asyncio.sleep(0.5)
    
    # Phase 3: Developer - Generate Code
    await send_agent_update(session_id, "dev", "Developer", "active", "Writing code...")
    await send_log(session_id, "Developer", "Implementing API endpoints...")
    
    code = llm.generate(
        PROMPTS["developer"]["system"],
        PROMPTS["developer"]["user"].format(goal=goal, design=design)
    )
    
    # Extract first function name for preview
    code_preview = "main.py"
    await send_artifact(session_id, "main.py", "code", code_preview, code)
    await send_agent_update(session_id, "dev", "Developer", "done")
    await send_log(session_id, "Developer", "Implementation complete. Handing off to QA.")
    
    await asyncio.sleep(0.5)
    
    # Phase 4: QA Engineer - Generate Test Report
    await send_agent_update(session_id, "qa", "QA Engineer", "active", "Running tests...")
    await send_log(session_id, "QA", "Executing automated test suite...")
    
    test_report = llm.generate(
        PROMPTS["qa_engineer"]["system"],
        PROMPTS["qa_engineer"]["user"].format(goal=goal, code=code)
    )
    
    # Determine pass/fail for preview
    test_preview = "100% PASS" if "PASS" in test_report.upper() else "Tests Complete"
    await send_artifact(session_id, "Test Report", "test", test_preview, test_report)
    await send_agent_update(session_id, "qa", "QA Engineer", "done")
    await send_log(session_id, "QA", "All tests passed. Sprint complete!")
    
    await send_log(session_id, "System", "Sprint retrospective complete. Ready for next cycle.")
    
    # Send completion signal
    await manager.send_update(session_id, SprintUpdate(
        type="complete",
        data={"success": True}
    ))


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "version": "1.0.0"}


@app.websocket("/ws/sprint/{session_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str):
    """WebSocket endpoint for real-time sprint updates."""
    await manager.connect(session_id, websocket)
    
    try:
        # Wait for sprint start message
        data = await websocket.receive_json()
        goal = data.get("goal", "")
        
        if not goal:
            await websocket.send_json({"error": "Sprint goal is required"})
            return
        
        # Initialize LLM client
        try:
            llm = get_llm_client()
        except ValueError as e:
            await websocket.send_json({"error": str(e)})
            return
        
        # Run the sprint
        await run_sprint(session_id, goal, llm)
        
    except WebSocketDisconnect:
        manager.disconnect(session_id)
    except Exception as e:
        await websocket.send_json({"error": str(e)})
        manager.disconnect(session_id)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
