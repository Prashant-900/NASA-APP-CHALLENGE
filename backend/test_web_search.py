#!/usr/bin/env python3
"""
Test script for the web search functionality
Run this to verify the web search tool is working correctly
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from ai.web_search import WebSearchTool

def test_web_search():
    """Test the web search functionality"""
    print("Testing Web Search Tool...")
    
    search_tool = WebSearchTool()
    
    # Test cases
    test_queries = [
        "pl_orbper",
        "habitable zone",
        "TESS mission",
        "exoplanet transit method"
    ]
    
    for query in test_queries:
        print(f"\n--- Testing query: '{query}' ---")
        
        try:
            result = search_tool.comprehensive_search(query)
            
            if result['success']:
                print(f"✓ Search successful")
                print(f"  Total results: {result['total_results']}")
                print(f"  Summary: {result['summary'][:200]}...")
                
                for i, search_result in enumerate(result['results'][:2]):
                    print(f"  Result {i+1}: {search_result['title']} ({search_result['source']})")
            else:
                print(f"✗ Search failed: {result.get('summary', 'Unknown error')}")
                
        except Exception as e:
            print(f"✗ Exception occurred: {str(e)}")
    
    print("\n--- Testing NASA Exoplanet Archive terms ---")
    
    # Test NASA-specific terms
    nasa_terms = ["pl_rade", "st_teff", "sy_dist", "k2", "toi"]
    
    for term in nasa_terms:
        try:
            nasa_results = search_tool.search_nasa_exoplanet_archive(term)
            if nasa_results:
                print(f"✓ Found NASA info for '{term}': {nasa_results[0]['title']}")
            else:
                print(f"- No NASA info for '{term}'")
        except Exception as e:
            print(f"✗ Error searching NASA archive for '{term}': {str(e)}")

if __name__ == "__main__":
    test_web_search()