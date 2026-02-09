"""
Example: Data Extraction
Demonstrates extracting information from a website.
"""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from agent import BrowserAgent


def data_extraction_example():
    """Example: Extract product information from a website."""
    
    task = """
    Go to https://news.ycombinator.com and extract the titles of the top 5 stories.
    """
    
    with BrowserAgent() as agent:
        result = agent.execute_task(task, use_vision=True)
        
        print(f"\nData extraction completed: {result['completed']}")
        
        # Look for extracted data in actions
        for action in result['actions']:
            if action['action'].get('action') == 'extract':
                print(f"\nExtracted data: {action['result'].get('data', 'N/A')}")


if __name__ == "__main__":
    data_extraction_example()
