import google.generativeai as genai
from typing import Dict, Any, List
from .config import Config
import json

class GeminiLLM:
    def __init__(self):
        self.config = Config()
        genai.configure(api_key=self.config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
    
    def process_with_tools(self, user_message: str, table: str, db) -> dict:
        """Process user message using tools for multi-step reasoning"""
        try:
            # Analyze user intent first
            intent = self.analyze_user_intent(user_message)
            
            # Get available tools
            available_tools = self.get_available_tools()
            
            # Plan tool usage based on intent
            tool_plan = self.plan_tool_usage(user_message, intent, available_tools, table)
            
            # Execute tools in sequence
            execution_results = self.execute_tool_chain(tool_plan, user_message, table, db)
            
            # Determine response type
            response_type = self.determine_response_type(intent, execution_results)
            
            return {
                "response": execution_results.get('final_response', ''),
                "data": execution_results.get('data') if intent.get('send_data_directly', False) else None,
                "response_type": response_type,
                "show_in_query_tab": response_type == 'query_with_data',
                "error": None
            }
            
        except Exception as e:
            return {
                "response": f"Error processing request: {str(e)}",
                "data": None,
                "response_type": "ai_only",
                "show_in_query_tab": False,
                "error": str(e)
            }
    
    def analyze_user_intent(self, user_message: str) -> Dict[str, Any]:
        """Analyze user intent to determine response strategy"""
        prompt = f"""Analyze this user request:
        
User: {user_message}
        
Determine:
1. needs_query: true/false - Does this need database query?
2. send_data_directly: true/false - Should raw query data be sent to user interface?
3. response_type: "ai_only" or "query_with_data"

Logic:
- If user asks for specific data, records, lists, tables → send_data_directly: true, response_type: "query_with_data"
- If user asks for explanations, analysis, insights, summaries → send_data_directly: false, response_type: "ai_only"
- If user asks general questions → needs_query: false, response_type: "ai_only"
        
Return JSON: {{"needs_query": true/false, "send_data_directly": true/false, "response_type": "..."}}"""
        
        try:
            response = self.model.generate_content(prompt)
            return json.loads(response.text.strip().replace('```json', '').replace('```', ''))
        except (json.JSONDecodeError, Exception) as e:
            print(f"Error analyzing user intent: {str(e)}")
            return {"needs_query": True, "send_data_directly": False, "response_type": "ai_only"}
    
    def get_available_tools(self) -> List[str]:
        """Get list of available tools"""
        return [
            "get_columns",
            "generate_sql", 
            "execute_query",
            "analyze_data",
            "generate_response"
        ]
    
    def plan_tool_usage(self, user_message: str, intent: Dict, tools: List[str], table: str) -> List[Dict]:
        """Plan which tools to use based on intent"""
        plan = []
        
        if intent.get('needs_query', True):
            plan.extend([
                {"tool": "get_columns", "params": {"table": table}},
                {"tool": "generate_sql", "params": {"message": user_message, "table": table}},
                {"tool": "execute_query", "params": {}}
            ])
        
        plan.append({"tool": "generate_response", "params": {"message": user_message, "intent": intent}})
        
        return plan
    
    def execute_tool_chain(self, tool_plan: List[Dict], user_message: str, table: str, db) -> Dict:
        """Execute tools in planned sequence"""
        results = {"steps": []}
        columns = None
        sql_query = None
        data = None
        
        for step in tool_plan:
            tool = step["tool"]
            params = step["params"]
            
            if tool == "get_columns":
                try:
                    columns = db.get_table_columns(table)
                    results["columns"] = columns
                    results["steps"].append({"tool": tool, "result": f"Retrieved {len(columns)} columns"})
                except Exception as e:
                    print(f"Error getting columns: {str(e)}")
                    results["columns"] = []
                    results["steps"].append({"tool": tool, "result": f"Failed to get columns: {str(e)}"})
            
            elif tool == "generate_sql":
                sql_query = self.generate_sql_query(user_message, table, columns or [])
                results["sql_query"] = sql_query
                results["steps"].append({"tool": tool, "result": "SQL query generated"})
            
            elif tool == "execute_query":
                if sql_query:
                    try:
                        print(f"Executing SQL: {sql_query}")
                        data = db.execute_custom_query(sql_query)
                        print(f"Query returned {len(data) if data else 0} records")
                        results["data"] = data
                        results["steps"].append({"tool": tool, "result": f"Retrieved {len(data) if data else 0} records"})
                    except Exception as e:
                        print(f"Query execution error: {str(e)}")
                        results["data"] = []
                        results["steps"].append({"tool": tool, "result": f"Query failed: {str(e)}"})
            

            
            elif tool == "generate_response":
                response = self.generate_response(user_message, data, table, params.get('intent', {}))
                results["final_response"] = response
                results["steps"].append({"tool": tool, "result": "Response generated"})
        
        return results
    
    def determine_response_type(self, intent: Dict, results: Dict) -> str:
        """Determine response type based on intent"""
        return intent.get('response_type', 'ai_only')
    
    def generate_sql_query(self, user_message: str, table: str, columns: list) -> str:
        prompt = f"""Generate SQL query for exoplanet research.
        
User request: {user_message}
Table: {table}
Columns: {', '.join(columns) if columns else 'unknown'}
        
For exoplanet detection, prioritize: period, depth, duration, radius, mass, temperature.
Limit results appropriately based on request.
        
Return only SQL:"""
        
        try:
            response = self.model.generate_content(prompt)
            return response.text.strip().replace('```sql', '').replace('```', '').strip()
        except Exception as e:
            return f"SELECT * FROM {table} LIMIT 10"
    
    def analyze_query_results(self, user_message: str, data: list, table: str) -> str:
        """Analyze query results for insights"""
        try:
            prompt = f"""Analyze this exoplanet data and provide insights.
            
User question: {user_message}
Table: {table}
Records: {len(data)}
Sample: {data[:3] if data else 'No data'}
            
Provide scientific insights about the data patterns, trends, or notable findings.
            
Analysis:"""
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Analysis error: {str(e)}"
    
    def generate_response(self, user_message: str, query_result: list, table: str, intent: Dict = None) -> str:
        try:
            # Sanitize inputs to prevent XSS
            import html
            user_message = html.escape(str(user_message)[:500])  # Limit length and escape
            table = html.escape(str(table))
            
            if intent and intent.get('send_data_directly', False):
                prompt = f"""User asked: {user_message}
Found {len(query_result) if query_result else 0} records from {table}.

Provide a brief explanation that the data is shown in the Query Results tab.

Response:"""
            else:
                # Limit sample data to prevent large prompts
                sample_data = str(query_result[:3] if query_result else 'No data')[:1000]
                prompt = f"""User asked: {user_message}
Data from {table}: {len(query_result) if query_result else 0} records
Sample: {sample_data}

Analyze and explain the findings. Provide insights based on the data.

Response:"""
            
            response = self.model.generate_content(prompt)
            return response.text
        except Exception as e:
            return f"Error generating response: {str(e)}"