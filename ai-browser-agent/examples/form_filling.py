"""
Example: Form Filling
Demonstrates filling out a web form.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent import BrowserAgent


def form_filling_example():
    """Example: Fill out a contact form."""
    
    task = """
    Go to https://www.example.com/contact and fill out the contact form with:
    - Name: John Doe
    - Email: john@example.com
    - Message: I'm interested in your services
    Then submit the form.
    """
    
    with BrowserAgent() as agent:
        result = agent.execute_task(task)
        
        print(f"\nForm submission completed: {result['completed']}")
        print(f"Actions taken: {len(result['actions'])}")


if __name__ == "__main__":
    form_filling_example()
