# Enhanced RAG System for Exoplanet Detection Dashboard

## Overview

The enhanced RAG (Retrieval-Augmented Generation) system provides intelligent query processing with integrated tools for database operations, Python code execution, and data visualization.

## Features

### LLM Tools Integration
- **SQL Query Execution**: Execute database queries with safety validation
- **Python Code Execution**: Run Python code in sandboxed environment
- **Plot Generation**: Create interactive plots using Plotly
- **Web Search**: Placeholder for future web search capabilities

### Intelligent Query Processing
- **Natural Language Understanding**: Process user requests in natural language
- **Multi-step Reasoning**: Plan and execute complex workflows
- **Context Awareness**: Understand table schemas and data relationships
- **Error Handling**: Robust error handling with fallback mechanisms

### Data Visualization
- **Histogram Plots**: Generate histograms for data distribution analysis
- **Scatter Plots**: Create scatter plots for correlation analysis
- **Line Plots**: Generate time series and trend visualizations
- **Box Plots**: Create box plots for statistical analysis

## Usage Examples

### Data Exploration
```
User: "show top 100 rows of k2 table"
System: Executes SQL query and returns data in table format
```

### Data Visualization
```
User: "plot histogram of dec column"
System: 
1. Executes SQL to get data
2. Generates Python plot code
3. Creates interactive histogram
4. Returns plot to frontend
```

### Complex Queries
```
User: "show planets with radius > 2 earth radii"
System: Generates appropriate SQL query and returns filtered results
```

## Architecture

### Components

1. **RAGGraph**: Main orchestrator class
2. **GeminiLLM**: LLM integration with tool support
3. **DatabaseManager**: Secure database operations
4. **PlotTools**: Visualization generation utilities

### Tool Execution Flow

1. **User Input**: Natural language query received
2. **Intent Analysis**: LLM analyzes user intent and plans tool usage
3. **Tool Execution**: Sequential execution of planned tools
4. **Response Generation**: AI response with data/plots
5. **Frontend Display**: Results displayed in appropriate format

### Security Features

- **SQL Injection Protection**: Parameterized queries and keyword filtering
- **Sandboxed Execution**: Python code runs in isolated subprocess
- **Resource Limits**: Timeout and memory constraints
- **Input Validation**: Comprehensive input sanitization

## API Endpoints

### `/api/chat/stream` (POST)
Stream chat responses with real-time updates
```json
{
  "message": "plot histogram of dec column",
  "table": "k2",
  "query_id": 123
}
```

### `/api/query/data/<query_id>` (GET)
Paginated access to query results
```
GET /api/query/data/123?page=0
```

## Configuration

### Environment Variables
```bash
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=postgresql://user:pass@host:port/db
```

### Available Tables
- `k2`: Kepler K2 mission data
- `toi`: TESS Objects of Interest
- `cum`: Cumulative exoplanet data

## Error Handling

### Fallback Mechanisms
- JSON parsing failures trigger pattern-matching fallback
- SQL errors return user-friendly messages
- Plot generation failures provide alternative responses

### Logging
- Comprehensive error logging for debugging
- Performance metrics tracking
- User interaction analytics

## Testing

Run the test script to verify system functionality:
```bash
python test_rag.py
```

## Performance Considerations

- **Query Caching**: Results cached with TTL for repeated queries
- **Pagination**: Large datasets paginated for optimal performance
- **Resource Limits**: Execution timeouts prevent system overload
- **Memory Management**: Automatic cleanup of temporary files

## Future Enhancements

- **Web Search Integration**: Real-time web search capabilities
- **Advanced Visualizations**: 3D plots and interactive dashboards
- **Multi-table Joins**: Complex cross-table analysis
- **Export Capabilities**: PDF and Excel export options
- **Collaborative Features**: Shared queries and results