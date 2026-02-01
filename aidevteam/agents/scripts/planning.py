from typing import Dict, List
from aidevteam.agents.state import SprintState, UserStory

def planning_workflow(state: SprintState) -> Dict:
    """
    Orchestrates the Sprint Planning phase.
    Logic:
    1. Product Owner (PO) analyzes Sprint Goal and populates the Backlog.
    2. Software Architect reviews the Backlog and validates feasibility.
    """
    goal = state.get("sprint_goal", "N/A")
    print(f"[Scrum Master] Starting Sprint Planning for Goal: {goal}")
    
    # Simulate PO Logic: Create a user story based on the goal
    new_story = UserStory(
        id="STORY-001",
        title=f"Implementation for {goal}",
        description=f"As a user, I want the system to {goal}.",
        acceptance_criteria=["Functionality works", "Code is clean"],
        status="TODO"
    )
    
    # Simulate Architect Logic: Validate and mock design artifact
    design_artifact = f"# Technical Design for {goal}\n- Architecture: RESTful\n- Validation: PASS"
    
    return {
        "backlog": [new_story],
        "artifacts": {"technical_design": design_artifact},
        "messages": [{
            "author": "Scrum Master",
            "content": "Sprint Planning completed. Backlog is ready."
        }]
    }

if __name__ == "__main__":
    # Test planning workflow
    test_state: SprintState = {
        "sprint_goal": "A health check API",
        "backlog": [],
        "artifacts": {},
        "messages": [],
        "current_story_id": "",
        "repo_path": "./",
        "blockers": [],
        "is_complete": False
    }
    result = planning_workflow(test_state)
    print(f"Resulting Backlog: {result['backlog'][0].title}")
    print(f"Artifacts: {list(result['artifacts'].keys())}")
