from typing import List, Union
from aidevteam.agents.state import SprintState
from aidevteam.agents.scripts.utils import load_persona

def create_agent_node(role_name: str, persona_name: str = None):
    """
    Creates a LangGraph-compatible node function for a specific AI role.
    
    Args:
        role_name: The display name of the role for message tracking.
        persona_name: The name of the markdown file to load (defaults to role_name).
        
    Returns:
        A function that takes SprintState and returns partial state update.
    """
    persona_name = persona_name or role_name
    
    # Load the system prompt
    try:
        system_prompt = load_persona(persona_name)
    except FileNotFoundError:
        system_prompt = f"You are the {role_name} of the Scrum team."
        
    def agent_node(state: SprintState):
        """
        The actual node function executed by LangGraph.
        """
        # This is a placeholder for the actual LLM call logic
        # In a real implementation, we would call an LLM with the system_prompt
        # and the messages from the state.
        
        last_message = state["messages"][-1] if state["messages"] else "No previous messages."
        
        # Example of agent "thinking" and responding
        response = {
            "author": role_name,
            "content": f"[Placeholder Response from {role_name}] I have reviewed the state and I am ready to perform my task."
        }
        
        # Update messages in state (using Annotated[List, operator.add])
        return {
            "messages": [response]
        }
        
    return agent_node

# Example: Initializing nodes for the Scrum team
PO_NODE = create_agent_node("Product Owner")
ARCHITECT_NODE = create_agent_node("Software Architect")
DEV_NODE = create_agent_node("Senior Backend Developer")
QA_NODE = create_agent_node("QA Engineer")
SM_NODE = create_agent_node("Scrum Master")
