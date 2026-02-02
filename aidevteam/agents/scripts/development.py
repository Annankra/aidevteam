from typing import Dict, List
from aidevteam.agents.state import SprintState, UserStory

def development_workflow(state: SprintState) -> Dict:
    """
    Orchestrates the Development and QA phase.
    Logic:
    1. Senior Developer implements the current story.
    2. QA Engineer runs tests on the implementation.
    3. If tests fail, it loops back to Dev (simulated here).
    """
    story_id = state.get("current_story_id", "STORY-001")
    print(f"[Scrum Master] Starting Development for Story: {story_id}")
    
    # 1. Simulate Developer coding
    code_artifact = f"def health_check():\n    return {{'status': 'healthy'}}"
    
    # 2. Simulate QA testing
    test_report = f"Tests for {story_id}: 100% PASS\n- Unit test: OK\n- Integration test: OK"
    
    # Update artifacts and story status
    updated_backlog = []
    for story in state.get("backlog", []):
        if story.id == story_id:
            story.status = "DONE"
        updated_backlog.append(story)
        
    return {
        "backlog": updated_backlog,
        "artifacts": {
            "source_code": code_artifact,
            "test_report": test_report
        },
        "messages": [{
            "author": "Scrum Master",
            "content": f"Development and QA completed for {story_id}. 100% test pass."
        }]
    }

if __name__ == "__main__":
    # Test development workflow
    from aidevteam.agents.state import UserStory
    test_story = UserStory(id="STORY-001", title="Test Goal", description="Test", status="TODO")
    test_state: SprintState = {
        "current_story_id": "STORY-001",
        "backlog": [test_story],
        "artifacts": {},
        "messages": [],
        "repo_path": "./",
        "sprint_goal": "A health check API",
        "blockers": [],
        "is_complete": False
    }
    result = development_workflow(test_state)
    print(f"Story Status: {result['backlog'][0].status}")
    print(f"Artifacts: {list(result['artifacts'].keys())}")
