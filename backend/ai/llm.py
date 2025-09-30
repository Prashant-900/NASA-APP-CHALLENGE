import google.generativeai as genai
from typing import Dict, Any
from .config import Config

class GeminiLLM:
    def __init__(self):
        self.config = Config()
        genai.configure(api_key=self.config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
    
    def should_execute_query(self, user_message: str) -> bool:
        """Determine if user wants to execute a database query vs just chat"""
        query_indicators = [
            'show', 'find', 'get', 'list', 'search', 'query', 'data', 'records',
            'how many', 'count', 'average', 'maximum', 'minimum', 'sum',
            'where', 'with', 'having', 'filter', 'sort', 'order'
        ]
        return any(indicator in user_message.lower() for indicator in query_indicators)
    
    def generate_sql_query(self, user_message: str, table: str, columns: list) -> str:
        prompt = f"""As a research data analyst, generate a PostgreSQL query to help answer this research question.
        
Research Question: {user_message}
Dataset: {table.upper()}
Available data fields: {', '.join(columns)}
        
Query Requirements:
- Use SELECT statements only
- Focus on columns relevant to the research question
- Apply appropriate filters and aggregations
- Limit to 100 rows for initial analysis
- Use proper PostgreSQL syntax
        
Return only the SQL query:"""
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip().replace('```sql', '').replace('```', '').strip()
        except Exception as e:
            return f"SELECT * FROM {table} LIMIT 10"
    
    def generate_response(self, user_message: str, query_result: list, table: str) -> str:
        try:
            prompt = f"""Answer the user's question directly based on the query results.
            
User asked: {user_message}
Data from {table}: {len(query_result) if query_result else 0} records
Results: {query_result[:3] if query_result else 'No data'}
            
Provide a direct, concise answer to what they asked. Use markdown formatting for readability.
            
Response:"""
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error analyzing data: {str(e)}"
    
    def generate_direct_response(self, user_message: str, table: str) -> str:
        """Generate response without database query for general questions"""
        try:
            prompt = f"""Answer the user's question about {table.upper()} exoplanet data.
            
User asked: {user_message}
            
Provide a direct, helpful answer. Be concise and accurate.
            
Response:"""
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error: {str(e)}"