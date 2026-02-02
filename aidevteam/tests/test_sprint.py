from aidevteam.agents.state import SprintState
from aidevteam.agents.scripts.planning import planning_workflow
from aidevteam.agents.scripts.development import development_workflow
from aidevteam.agents.scripts.retro import retro_workflow

def run_sprint_0():
    """ Runs a full end-to-end simulation of the AI Scrum cycle. """
    print("=== STARTING SPRINT 0 INTEGRATION TEST ===")
    
    # 1. Initialize state
    state: SprintState = {
        "sprint_goal": "A high-performance FastAPI server",
        "backlog": [],
        "artifacts": {},
        "messages": [],
        "current_story_id": "",
        "repo_path": "./",
        "blockers": [],
        "is_complete": False
    }
    
    # 2. Phase 1: Planning
    planning_update = planning_workflow(state)
    state.update(planning_update)
    state["current_story_id"] = state["backlog"][0].id
    
    # 3. Phase 2: Development & QA
    dev_update = development_workflow(state)
    # Merge artifacts instead of overwriting
    state["artifacts"].update(dev_update.get("artifacts", {}))
    # Update other fields
    state["backlog"] = dev_update.get("backlog", state["backlog"])
    state["messages"].extend(dev_update.get("messages", []))
    
    # 4. Phase 3: Retro & Reporting
    retro_update = retro_workflow(state)
    # Merge artifacts
    state["artifacts"].update(retro_update.get("artifacts", {}))
    # Update other fields
    state["is_complete"] = retro_update.get("is_complete", state["is_complete"])
    state["messages"].extend(retro_update.get("messages", []))
    
    print("\n=== SPRINT 0 COMPLETED ===")
    print(f"Goal: {state['sprint_goal']}")
    print(f"Is Complete: {state['is_complete']}")
    print(f"Final Report Length: {len(state['artifacts']['final_sprint_report'])} characters")
    
    # Verify key results
    assert state["is_complete"] is True
    assert "source_code" in state["artifacts"]
    assert "test_report" in state["artifacts"]
    assert "final_sprint_report" in state["artifacts"]
    
    return state

if __name__ == "__main__":
    run_sprint_0()
