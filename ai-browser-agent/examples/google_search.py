"""
Example: Simple Google Search
Demonstrates basic browser automation with the AI agent.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent import BrowserAgent


def google_search_example():
    """Example: Search Google for a topic."""
    
    task = "Go to google.com and search for 'AI browser automation'"
    
    with BrowserAgent() as agent:
        result = agent.execute_task(task)
        
        print(f"\nTask completed: {result['completed']}")
        print(f"Steps taken: {result['steps_taken']}")
        print(f"Final URL: {result['final_url']}")


if __name__ == "__main__":
    google_search_example()
