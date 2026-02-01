import operator
from typing import Annotated, List, TypedDict, Union
from pydantic import BaseModel, Field

class UserStory(BaseModel):
    id: str = Field(description="Unique identifier for the user story")
    title: str = Field(description="Short title of the story")
    description: str = Field(description="Detailed user story (As a... I want... So that...)")
    acceptance_criteria: List[str] = Field(default_factory=list, description="List of conditions for acceptance")
    status: str = Field(default="TODO", description="Current status of the story (TODO, IN_PROGRESS, REVIEW, DONE)")
    complexity: int = Field(default=0, description="Complexity score (Fibonacci sequence)")

class SprintState(TypedDict):
    """
    The shared state for the AI Scrum Team orchestration.
    """
    # Messaging history between agents
    messages: Annotated[List[Union[str, dict]], operator.add]
    
    # The sprint backlog (list of user stories)
    backlog: List[UserStory]
    
    # Current active story ID
    current_story_id: str
    
    # Path to the code repository/directory
    repo_path: str
    
    # Shared artifacts (Design docs, test reports, etc.)
    # Mapping of artifact_name -> artifact_content (or path)
    artifacts: Annotated[dict, operator.ior]
    
    # The current goal of the sprint
    sprint_goal: str
    
    # Blockers and status flags
    blockers: List[str]
    is_complete: bool
