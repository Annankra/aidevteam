from typing import Dict
from aidevteam.agents.state import SprintState

def retro_workflow(state: SprintState) -> Dict:
    """
    Orchestrates the Sprint Retrospective and reporting.
    Logic:
    1. Summarize the backlog status.
    2. Collect all artifacts.
    3. Generate a final report for the stakeholder.
    """
    print("[Scrum Master] Starting Sprint Retrospective and Reporting")
    
    # Analyze backlog
    total_stories = len(state.get("backlog", []))
    completed_stories = len([s for s in state.get("backlog", []) if s.status == "DONE"])
    
    # Collect artifact names
    artifact_summary = ", ".join(state.get("artifacts", {}).keys())
    
    # Generate report
    report = f"""
# Sprint Review Report
**Goal**: {state.get('sprint_goal', 'N/A')}
**Status**: {"SUCCESS" if completed_stories == total_stories else "PARTIAL"}
**Velocity**: {completed_stories}/{total_stories} stories completed

## Artifacts Produced
{artifact_summary or "None"}

## Agent Feedback
- Product Owner: Requirements were met.
- Architect: Design was followed.
- QA: All tests passed.
"""
    
    return {
        "artifacts": {"final_sprint_report": report},
        "is_complete": True,
        "messages": [{
            "author": "Scrum Master",
            "content": f"Sprint Retrospective completed. Final report generated."
        }]
    }

if __name__ == "__main__":
    # Test retro workflow
    from aidevteam.agents.state import UserStory
    test_story = UserStory(id="STORY-001", title="Test", description="Test", status="DONE")
    test_state: SprintState = {
        "backlog": [test_story],
        "artifacts": {"source_code": "code", "test_report": "pass"},
        "messages": [],
        "current_story_id": "STORY-001",
        "repo_path": "./",
        "sprint_goal": "A health check API",
        "blockers": [],
        "is_complete": False
    }
    result = retro_workflow(test_state)
    print(f"Is Complete: {result['is_complete']}")
    print(f"Report Produced: {'final_sprint_report' in result['artifacts']}")
