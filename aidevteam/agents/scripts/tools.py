from typing import Any, Dict
from langchain_core.tools import tool

@tool
def read_file(path: str) -> str:
    """Reads the content of a file at the given path."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except Exception as e:
        return f"Error reading file: {str(e)}"

@tool
def write_file(path: str, content: str) -> str:
    """Writes the content to a file at the given path."""
    try:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        return f"Successfully wrote to {path}"
    except Exception as e:
        return f"Error writing file: {str(e)}"

@tool
def execute_shell(command: str) -> str:
    """
    Executes a shell command and returns the output.
    USE WITH CAUTION.
    """
    import subprocess
    try:
        result = subprocess.run(
            command, 
            shell=True, 
            capture_output=True, 
            text=True, 
            timeout=30
        )
        return f"STDOUT: {result.stdout}\nSTDERR: {result.stderr}"
    except Exception as e:
        return f"Error executing command: {str(e)}"

# Collection of tools for agents
CORE_TOOLS = [read_file, write_file, execute_shell]
