import requests
import json
from typing import Dict, List, Any, Optional
from urllib.parse import quote_plus
import re
import time
from .config import Config

class WebSearchTool:
    """Secure web search implementation for RAG system"""
    
    def __init__(self):
        self.config = Config()
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'NASA-Exoplanet-Research-Bot/1.0'
        })
        # Rate limiting
        self.last_request_time = 0
        self.min_request_interval = 1.0  # 1 second between requests
    
    def search_duckduckgo(self, query: str, max_results: int = 5) -> List[Dict[str, Any]]:
        """Search using DuckDuckGo Instant Answer API (no API key required)"""
        try:
            # Rate limiting
            current_time = time.time()
            if current_time - self.last_request_time < self.min_request_interval:
                time.sleep(self.min_request_interval - (current_time - self.last_request_time))
            
            # Sanitize query
            clean_query = self._sanitize_query(query)
            if not clean_query:
                return []
            
            # Use DuckDuckGo Instant Answer API
            url = "https://api.duckduckgo.com/"
            params = {
                'q': clean_query,
                'format': 'json',
                'no_html': '1',
                'skip_disambig': '1'
            }
            
            response = self.session.get(url, params=params, timeout=10)
            response.raise_for_status()
            
            self.last_request_time = time.time()
            
            data = response.json()
            results = []
            
            # Extract abstract if available
            if data.get('Abstract'):
                results.append({
                    'title': data.get('Heading', 'DuckDuckGo Result'),
                    'snippet': data.get('Abstract', ''),
                    'url': data.get('AbstractURL', ''),
                    'source': 'DuckDuckGo'
                })
            
            # Extract related topics
            for topic in data.get('RelatedTopics', [])[:max_results-len(results)]:
                if isinstance(topic, dict) and topic.get('Text'):
                    results.append({
                        'title': topic.get('FirstURL', '').split('/')[-1].replace('_', ' '),
                        'snippet': topic.get('Text', ''),
                        'url': topic.get('FirstURL', ''),
                        'source': 'DuckDuckGo'
                    })
            
            return results[:max_results]
            
        except Exception as e:
            print(f"DuckDuckGo search error: {str(e)}")
            return []
    
    def search_wikipedia(self, query: str, max_results: int = 3) -> List[Dict[str, Any]]:
        """Search Wikipedia for scientific information"""
        try:
            # Rate limiting
            current_time = time.time()
            if current_time - self.last_request_time < self.min_request_interval:
                time.sleep(self.min_request_interval - (current_time - self.last_request_time))
            
            clean_query = self._sanitize_query(query)
            if not clean_query:
                return []
            
            # Wikipedia API search
            search_url = "https://en.wikipedia.org/api/rest_v1/page/summary/" + quote_plus(clean_query)
            
            response = self.session.get(search_url, timeout=10)
            
            self.last_request_time = time.time()
            
            if response.status_code == 200:
                data = response.json()
                return [{
                    'title': data.get('title', ''),
                    'snippet': data.get('extract', ''),
                    'url': data.get('content_urls', {}).get('desktop', {}).get('page', ''),
                    'source': 'Wikipedia'
                }]
            
            return []
            
        except Exception as e:
            print(f"Wikipedia search error: {str(e)}")
            return []
    
    def search_nasa_exoplanet_archive(self, query: str) -> List[Dict[str, Any]]:
        """Search NASA Exoplanet Archive documentation"""
        try:
            # This is a simplified implementation
            # In production, you would integrate with NASA's actual APIs
            
            # Common exoplanet-related terms and their explanations
            exoplanet_terms = {
                'pl_orbper': 'Orbital Period - The time it takes for a planet to complete one orbit around its host star',
                'pl_rade': 'Planet Radius - The radius of the planet in Earth radii',
                'st_teff': 'Stellar Effective Temperature - The surface temperature of the host star',
                'st_rad': 'Stellar Radius - The radius of the host star in solar radii',
                'st_mass': 'Stellar Mass - The mass of the host star in solar masses',
                'st_logg': 'Stellar Surface Gravity - The logarithm of the surface gravity of the host star',
                'sy_dist': 'System Distance - The distance to the planetary system in parsecs',
                'sy_vmag': 'V-band Magnitude - The apparent brightness of the system in the V-band',
                'sy_kmag': 'K-band Magnitude - The apparent brightness of the system in the K-band',
                'sy_gaiamag': 'Gaia Magnitude - The apparent brightness measured by the Gaia spacecraft',
                'k2': 'K2 Mission - Extended mission of the Kepler Space Telescope',
                'toi': 'TESS Objects of Interest - Candidate exoplanets identified by TESS',
                'tess': 'Transiting Exoplanet Survey Satellite - NASA space telescope',
                'kepler': 'Kepler Space Telescope - NASA mission to discover exoplanets',
                'transit': 'Transit Method - Detection method where planet passes in front of star',
                'habitable zone': 'The region around a star where liquid water could exist on a planet surface'
            }
            
            query_lower = query.lower()
            results = []
            
            for term, description in exoplanet_terms.items():
                if term in query_lower or any(word in term for word in query_lower.split()):
                    results.append({
                        'title': f'NASA Exoplanet Archive: {term.upper()}',
                        'snippet': description,
                        'url': f'https://exoplanetarchive.ipac.caltech.edu/docs/data.html#{term}',
                        'source': 'NASA Exoplanet Archive'
                    })
            
            return results[:3]
            
        except Exception as e:
            print(f"NASA search error: {str(e)}")
            return []
    
    def comprehensive_search(self, query: str, context: str = "") -> Dict[str, Any]:
        """Perform comprehensive search across multiple sources"""
        try:
            all_results = []
            
            # Search NASA terms first for exoplanet-related queries
            nasa_results = self.search_nasa_exoplanet_archive(query)
            all_results.extend(nasa_results)
            
            # Search Wikipedia for scientific context
            wiki_results = self.search_wikipedia(query)
            all_results.extend(wiki_results)
            
            # Search DuckDuckGo for additional information
            ddg_results = self.search_duckduckgo(query, max_results=3)
            all_results.extend(ddg_results)
            
            # Limit total results
            all_results = all_results[:8]
            
            if all_results:
                # Create summary
                summary = self._create_search_summary(query, all_results)
                return {
                    'success': True,
                    'query': query,
                    'results': all_results,
                    'summary': summary,
                    'total_results': len(all_results)
                }
            else:
                return {
                    'success': False,
                    'query': query,
                    'results': [],
                    'summary': f"No relevant information found for '{query}'. Try rephrasing your question or using more specific terms.",
                    'total_results': 0
                }
                
        except Exception as e:
            return {
                'success': False,
                'query': query,
                'results': [],
                'summary': f"Search error: {str(e)}",
                'total_results': 0,
                'error': str(e)
            }
    
    def _sanitize_query(self, query: str) -> str:
        """Sanitize search query to prevent injection attacks"""
        if not query or not isinstance(query, str):
            return ""
        
        # Remove potentially dangerous characters
        query = re.sub(r'[<>"\';\\]', '', query)
        
        # Limit length
        query = query[:200]
        
        # Remove extra whitespace
        query = ' '.join(query.split())
        
        return query.strip()
    
    def _create_search_summary(self, query: str, results: List[Dict[str, Any]]) -> str:
        """Create a summary from search results"""
        if not results:
            return f"No information found for '{query}'."
        
        summary_parts = []
        
        # Group by source
        sources = {}
        for result in results:
            source = result.get('source', 'Unknown')
            if source not in sources:
                sources[source] = []
            sources[source].append(result)
        
        for source, source_results in sources.items():
            if source_results:
                best_result = source_results[0]  # Take the first/best result
                snippet = best_result.get('snippet', '')
                if snippet:
                    # Truncate snippet if too long
                    if len(snippet) > 200:
                        snippet = snippet[:200] + "..."
                    summary_parts.append(f"**{source}**: {snippet}")
        
        if summary_parts:
            return "\n\n".join(summary_parts)
        else:
            return f"Found {len(results)} results for '{query}' but no detailed information available."