import google.generativeai as genai
from typing import Dict, Any, List
from .config import Config
from .plot_tools import execute_plot_code, execute_query_dataframe, generate_plot_code
from .web_search import WebSearchTool
from .column_info import get_column_info
import json
import re
import pandas as pd

class GeminiLLM:
    def __init__(self):
        self.config = Config()
        genai.configure(api_key=self.config.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        self.web_search = WebSearchTool()
        self.tools = {
            'execute_sql': self._execute_sql_tool,
            'web_search': self._web_search_tool,
            'plot_graph': self._plot_graph_tool,
            'get_columns': self._get_columns_tool
        }
    
    def _execute_sql_tool(self, query: str, db) -> Dict[str, Any]:
        """Execute SQL query and return results"""
        try:
            data = db.execute_custom_query(query)
            return {"success": True, "data": data, "count": len(data)}
        except Exception as e:
            return {"success": False, "error": str(e), "data": []}
    

    
    def _web_search_tool(self, query: str, context: str = "") -> Dict[str, Any]:
        """Secure web search implementation"""
        try:
            # Sanitize query
            if not query or len(query.strip()) < 2:
                return {
                    "success": False,
                    "error": "Query too short or empty",
                    "results": []
                }
            
            # Perform search
            search_result = self.web_search.comprehensive_search(query, context)
            return search_result
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Search failed: {str(e)}",
                "results": []
            }
    
    def _plot_graph_tool(self, plot_code: str, data: List[Dict]) -> Dict[str, Any]:
        """Generate plot from data"""
        try:
            df = pd.DataFrame(data)
            plot_html = execute_plot_code(plot_code, df)
            return {
                "success": True,
                "plot": plot_html,
                "error": None
            }
        except Exception as e:
            return {
                "success": False,
                "plot": "",
                "error": str(e)
            }
    
    def _get_columns_tool(self, table: str) -> Dict[str, Any]:
        """Get detailed column information for a table"""
        try:
            column_info = get_column_info(table)
            return {
                "success": True,
                "columns": column_info['columns'],
                "descriptions": column_info['descriptions'],
                "count": column_info['count']
            }
        except Exception as e:
            return {
                "success": False,
                "error": str(e),
                "columns": []
            }
    
    def process_with_tools(self, user_message: str, table: str, db) -> dict:
        """Process user message using LLM with tools"""
        try:
            print(f"🔍 Processing message: '{user_message}' for table: {table}")
            
            # Get table columns
            columns = db.get_table_columns(table) if table else []
            print(f"📋 Available columns: {columns[:10]}...")  # Show first 10
            
            # Create system prompt with available tools
            system_prompt = f"""You are an AI assistant with access to these tools:
1. execute_sql(query) - Execute SQL queries on database
2. plot_graph(plot_code, data) - Create plots using plotly
3. web_search(query) - Search web for information about terms/concepts

Available table: {table}
Available columns: {', '.join(columns)}

User request: {user_message}

IMPORTANT RULES:
- If user asks for "plot", "graph", "chart", "histogram", "scatter", "visualization" - ALWAYS use plot_graph
- If user asks for "relation", "relationship", "correlation" between columns - use plot_graph with scatter plot
- If user mentions specific column names and wants to see them plotted - use plot_graph
- Only show raw data if user specifically asks for "data", "table", "records", "list"

Process this request step by step:
1. If user asks about a term/concept you don't know, use web_search to find information
2. If user wants to plot/visualize data, first execute SQL to get data, then create plot
3. If user wants to see data, execute SQL query
4. Always provide AI response explaining what you did

For plots, use this format for plot_code:
- Histogram: fig = px.histogram(data, x='column_name', nbins=30, title='Title')
- Scatter: fig = px.scatter(data, x='col1', y='col2', title='Title')
- Log scale: add log_y=True for log scale on Y axis

Respond in JSON format:
{{
    "steps": [
        {{"action": "execute_sql", "query": "SELECT ...", "reasoning": "why"}},
        {{"action": "plot_graph", "code": "fig = px.histogram(...)", "reasoning": "why"}}
    ],
    "response": "AI explanation of results"
}}"""

            # Get LLM response
            response = self.model.generate_content(system_prompt)
            response_text = response.text.strip()
            print(f"🤖 LLM raw response length: {len(response_text)}")
            print(f"🤖 LLM response preview: {response_text[:200]}...")
            
            # Try to parse JSON response
            try:
                if response_text.startswith('```json'):
                    response_text = response_text.replace('```json', '').replace('```', '').strip()
                
                plan = json.loads(response_text)
                print(f"✅ LLM plan parsed successfully")
                print(f"📋 Plan steps: {[step.get('action') for step in plan.get('steps', [])]}")
            except Exception as e:
                print(f"❌ JSON parsing failed: {str(e)}")
                print(f"🔄 Using fallback processing")
                # Fallback if JSON parsing fails
                return self._fallback_processing(user_message, table, db, columns)
            
            # Execute planned steps
            results = {"data": None, "plot": None, "ai_response": "", "search_info": ""}
            
            for i, step in enumerate(plan.get("steps", [])):
                action = step.get("action")
                print(f"🔧 Executing step {i+1}: {action}")
                
                if action == "web_search":
                    search_query = step.get("query", "")
                    search_result = self._web_search_tool(search_query, user_message)
                    if search_result["success"]:
                        results["search_info"] += f"\n\n**Search Results for '{search_query}':**\n{search_result['summary']}"
                
                elif action == "execute_sql":
                    query = step.get("query", "")
                    print(f"🗄️ Executing SQL: {query}")
                    sql_result = self._execute_sql_tool(query, db)
                    print(f"📊 SQL result: success={sql_result['success']}, data_count={len(sql_result.get('data', []))}")
                    if sql_result["success"]:
                        results["data"] = sql_result["data"]
                
                elif action == "plot_graph":
                    if results["data"]:
                        plot_code = step.get("code", "")
                        print(f"📈 Executing plot code: {plot_code}")
                        plot_result = self._plot_graph_tool(plot_code, results["data"])
                        print(f"🎨 Plot result: success={plot_result['success']}")
                        if plot_result["success"]:
                            results["plot"] = plot_result["plot"]
                            print(f"🎯 Plot HTML generated: length={len(plot_result['plot'])}")
                        else:
                            print(f"❌ Plot generation failed: {plot_result.get('error', 'Unknown error')}")
                    else:
                        print(f"⚠️ No data available for plotting")
            
            # Determine response type
            if results["plot"]:
                response_type = "query_with_data"
                show_in_tab = True
                data_to_send = None  # Don't send data table for plots
                print(f"🎯 Final result: PLOT generated (length: {len(results['plot'])})")
            elif results["data"]:
                response_type = "query_with_data"
                show_in_tab = True
                data_to_send = results["data"]
                print(f"📊 Final result: DATA returned ({len(results['data'])} records)")
            else:
                response_type = "ai_only"
                show_in_tab = False
                data_to_send = None
                print(f"💬 Final result: AI response only")
            
            # Combine AI response with search info
            final_response = plan.get("response", "Request processed successfully.")
            if results["search_info"]:
                final_response += results["search_info"]
            
            return {
                "response": final_response,
                "data": data_to_send,
                "plot": results["plot"],
                "response_type": response_type,
                "show_in_query_tab": show_in_tab,
                "error": None
            }
            
        except Exception as e:
            return {
                "response": f"Error processing request: {str(e)}",
                "data": None,
                "plot": None,
                "response_type": "ai_only",
                "show_in_query_tab": False,
                "error": str(e)
            }
    
    def _fallback_processing(self, user_message: str, table: str, db, columns: List[str]) -> dict:
        """Fallback processing when JSON parsing fails"""
        try:
            print(f"🔄 FALLBACK: Processing '{user_message}'")
            message_lower = user_message.lower()
            
            # Check if user is asking about a term/concept
            question_words = ['what', 'explain', 'define', 'meaning', 'means']
            if any(word in message_lower for word in question_words):
                print(f"🔍 FALLBACK: Detected question about concept")
                # Extract potential search terms
                search_terms = self._extract_search_terms(user_message, columns)
                if search_terms:
                    search_result = self._web_search_tool(search_terms, user_message)
                    if search_result["success"]:
                        return {
                            "response": f"Here's what I found about '{search_terms}':\n\n{search_result['summary']}",
                            "data": None,
                            "plot": None,
                            "response_type": "ai_only",
                            "show_in_query_tab": False,
                            "error": None
                        }
            
            # Handle plotting requests
            if any(word in message_lower for word in ['plot', 'hist', 'graph', 'chart', 'scatter', 'visualization', 'relation']):
                print(f"🎨 FALLBACK: Detected plot request")
                # Extract column names from message
                mentioned_cols = [col for col in columns if col.lower() in message_lower]
                print(f"📋 FALLBACK: Mentioned columns: {mentioned_cols}")
                
                if mentioned_cols:
                    # Build SQL query for mentioned columns
                    if len(mentioned_cols) == 1:
                        sql_query = f"SELECT {mentioned_cols[0]} FROM {table} WHERE {mentioned_cols[0]} IS NOT NULL LIMIT 1000"
                    else:
                        col_list = ', '.join(mentioned_cols)
                        where_clause = ' AND '.join([f"{col} IS NOT NULL" for col in mentioned_cols])
                        sql_query = f"SELECT {col_list} FROM {table} WHERE {where_clause} LIMIT 1000"
                else:
                    # Default query
                    sql_query = f"SELECT * FROM {table} LIMIT 1000"
                
                print(f"🗄️ FALLBACK: Executing SQL: {sql_query}")
                sql_result = self._execute_sql_tool(sql_query, db)
                
                if sql_result["success"] and sql_result["data"]:
                    print(f"📊 FALLBACK: Got {len(sql_result['data'])} records")
                    plot_code = generate_plot_code(user_message, columns)
                    print(f"📈 FALLBACK: Generated plot code: {plot_code}")
                    plot_result = self._plot_graph_tool(plot_code, sql_result["data"])
                    
                    if plot_result["success"] and plot_result["plot"]:
                        print(f"🎯 FALLBACK: Plot generated successfully (length: {len(plot_result['plot'])})")
                        return {
                            "response": f"Generated plot for {user_message}",
                            "data": None,
                            "plot": plot_result["plot"],
                            "response_type": "query_with_data",
                            "show_in_query_tab": True,
                            "error": None
                        }
                    else:
                        # If plot failed, show data instead
                        print(f"❌ FALLBACK: Plot failed, returning data. Error: {plot_result.get('error', 'Unknown')}")
                        return {
                            "response": f"Could not generate plot, showing data instead. Error: {plot_result.get('error', 'Unknown')}",
                            "data": sql_result["data"][:50],  # Limit to 50 rows
                            "plot": None,
                            "response_type": "query_with_data",
                            "show_in_query_tab": True,
                            "error": None
                        }
            
            # Handle data display requests
            elif any(word in message_lower for word in ['show', 'display', 'list', 'top']):
                sql_query = self._generate_simple_sql(user_message, table, columns)
                sql_result = self._execute_sql_tool(sql_query, db)
                
                return {
                    "response": f"Retrieved {len(sql_result['data']) if sql_result['success'] else 0} records from {table}",
                    "data": sql_result["data"] if sql_result["success"] else None,
                    "plot": None,
                    "response_type": "query_with_data",
                    "show_in_query_tab": True,
                    "error": None
                }
            
            return {
                "response": "I can help you query data, create plots, or explain terms. Try asking 'what does pl_orbper mean?' or 'show data' or 'plot histogram'.",
                "data": None,
                "plot": None,
                "response_type": "ai_only",
                "show_in_query_tab": False,
                "error": None
            }
            
        except Exception as e:
            return {
                "response": f"Error in fallback processing: {str(e)}",
                "data": None,
                "plot": None,
                "response_type": "ai_only",
                "show_in_query_tab": False,
                "error": str(e)
            }
    
    def _generate_simple_sql(self, user_message: str, table: str, columns: List[str]) -> str:
        """Generate simple SQL query based on user message"""
        message_lower = user_message.lower()
        
        # Extract limit if mentioned
        limit = 100
        if 'top' in message_lower:
            words = message_lower.split()
            for i, word in enumerate(words):
                if word == 'top' and i + 1 < len(words):
                    try:
                        limit = min(int(words[i + 1]), 1000)
                    except:
                        pass
        
        # Extract column if mentioned
        mentioned_cols = [col for col in columns if col.lower() in message_lower]
        
        if mentioned_cols:
            return f"SELECT {', '.join(mentioned_cols)} FROM {table} LIMIT {limit}"
        else:
            return f"SELECT * FROM {table} LIMIT {limit}"
    
    def _extract_search_terms(self, user_message: str, columns: List[str]) -> str:
        """Extract search terms from user message"""
        message_lower = user_message.lower()
        
        # Check for column names in the message
        for col in columns:
            if col.lower() in message_lower:
                return col
        
        # Extract terms after question words
        question_patterns = [
            r'what (?:is |does |means? )?([\w_]+)',
            r'explain ([\w_]+)',
            r'define ([\w_]+)',
            r'meaning of ([\w_]+)'
        ]
        
        for pattern in question_patterns:
            match = re.search(pattern, message_lower)
            if match:
                return match.group(1)
        
        # Fallback: return the message itself (cleaned)
        return re.sub(r'[^\w\s]', '', user_message).strip()