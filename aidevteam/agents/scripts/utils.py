import os
from pathlib import Path

def load_persona(role_name: str) -> str:
    """
    Loads the system prompt/persona for a specific role from the skills directory.
    
    Args:
        role_name: The name of the role (e.g., 'backend_dev', 'architect').
        
    Returns:
        The content of the markdown persona file.
        
    Raises:
        FileNotFoundError: If the persona file does not exist.
    """
    # Assuming the script is run from the project root or aidevteam dir
    # we use an absolute-friendly path logic
    base_dir = Path(__file__).parent.parent
    skills_dir = base_dir / "skills"
    
    # Try different naming conventions
    possible_files = [
        skills_dir / f"{role_name}.md",
        skills_dir / f"{role_name.replace(' ', '_').lower()}.md"
    ]
    
    for file_path in possible_files:
        if file_path.exists():
            with open(file_path, "r", encoding="utf-8") as f:
                return f.read()
                
    raise FileNotFoundError(f"Persona file for role '{role_name}' not found in {skills_dir}")

if __name__ == "__main__":
    # Quick test
    try:
        content = load_persona("backend_dev")
        print(f"Loaded successfully. First 50 chars: {content[:50]}...")
    except Exception as e:
        print(f"Error: {e}")
