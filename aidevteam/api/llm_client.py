"""
LLM Client for Agent Generation

Supports OpenAI (default) and can be extended for other providers.
"""
import os
from typing import Optional
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

class LLMClient:
    """Client for interacting with LLM APIs."""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OPENAI_API_KEY environment variable is required")
        self.client = OpenAI(api_key=self.api_key)
        self.model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    
    def generate(self, system_prompt: str, user_prompt: str, max_tokens: int = 2000) -> str:
        """Generate a response from the LLM."""
        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                max_tokens=max_tokens,
                temperature=0.7
            )
            return response.choices[0].message.content or ""
        except Exception as e:
            return f"Error generating response: {str(e)}"


# Prompt templates for each agent role
PROMPTS = {
    "product_owner": {
        "system": """You are a strategic, user-focused Product Owner. You represent the end-user and the business.
Your job is to break down a sprint goal into clear, actionable user stories.
Format your response as Markdown with proper headers for each story.
Include: Story ID, Title, Description (As a... I want... So that...), and Acceptance Criteria.""",
        
        "user": """Sprint Goal: {goal}

Create 3 detailed user stories that break down this goal into implementable features.
Be specific and technical. Each story should be independently deliverable."""
    },
    
    "architect": {
        "system": """You are a Software Architect focused on system design, security, and scalability.
Your job is to create a technical design document that guides implementation.
Format your response as Markdown with proper code blocks for diagrams (ASCII art) and configurations.
Include: Overview, Tech Stack, Architecture Diagram, API Endpoints, Database Schema (if applicable), and Security Considerations.""",
        
        "user": """Sprint Goal: {goal}

User Stories:
{stories}

Create a comprehensive technical design document for implementing these user stories.
Be specific about technologies, patterns, and implementation details."""
    },
    
    "developer": {
        "system": """You are a Senior Backend Developer who writes clean, well-documented code.
Your job is to implement the core functionality based on the technical design.
Format your response as a complete Python file with proper imports, docstrings, and type hints.
Use FastAPI for the API layer. Include error handling and basic validation.""",
        
        "user": """Sprint Goal: {goal}

Technical Design:
{design}

Implement the main API file (main.py) that addresses the core functionality.
Include: Imports, Models, Endpoints, and a main block to run the server.
Make the code production-ready with proper error handling."""
    },
    
    "qa_engineer": {
        "system": """You are a detail-oriented QA Engineer who writes comprehensive test suites.
Your job is to create a test report that verifies the implementation meets requirements.
Format your response as a Markdown test report.
Include: Summary, Test Results (with pass/fail status), Coverage Analysis, and Recommendations.""",
        
        "user": """Sprint Goal: {goal}

Source Code:
{code}

Create a comprehensive test report that:
1. Lists all tests that would be run
2. Shows pass/fail status for each test
3. Calculates overall coverage
4. Provides recommendations for improvement

Make this realistic and thorough."""
    }
}


def get_llm_client() -> LLMClient:
    """Factory function to get LLM client instance."""
    return LLMClient()
