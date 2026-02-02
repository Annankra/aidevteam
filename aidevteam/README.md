# AI Dev Team (Scrum) 🤖🚀

A multi-agent software development team capable of performing Scrum ceremonies and implementing high-quality software.

## Architecture
The system uses a **Shared State** model where agents (PO, Architect, Dev, QA) collaborate via an orchestrator (Scrum Master).

## Agent Roles
- **Product Owner**: Requirements and Backlog.
- **Architect**: System Design and Validation.
- **Backend Developer**: Implementation and Unit Testing.
- **QA Engineer**: Automated and Manual testing.
- **Scrum Master**: Orchestration and Process Enforcement.

## Quick Start

### 1. Setup Environment
Ensure you have Python 3.10+ installed. Create and activate a virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r aidevteam/requirements.txt
```

### 2. Run the AI Scrum Cycle (Sprint 0)
To see a full simulation of the AI-driven Scrum process (Planning, Development, QA, and Retro), run the integrated test:

```bash
PYTHONPATH=. python3 aidevteam/tests/test_sprint.py
```

## Tech Stack
- **Framework**: LangChain & LangGraph
- **Core State**: Pydantic & TypedDict
- **Agent Framework**: Custom generic node factory with persona injection.
- **Frontend**: Vite + React + Tailwind + Framer Motion
- **Design Principles**: SOLID, 12-Factor App.

## Context7 MCP Integration
This project is configured to use **Context7 MCP** for up-to-date documentation lookup.

### Configuration
The `.cursor/mcp.json` file is configured to connect to Context7:
```json
{
  "mcpServers": {
    "context7": {
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

### Usage
When prompting AI assistants, add "use context7" to fetch current documentation for:
- **LangGraph**: State machines, nodes, edges
- **FastAPI/Pydantic**: API patterns, validation
- **React/Framer Motion**: Component patterns, animations
- **Tailwind CSS**: Utility classes, configuration
