# Setup Instructions

## Backend Setup

1. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env file and add your Gemini API key
```

3. Start the Flask server:
```bash
python app.py
```

## Frontend Setup

1. Install Node.js dependencies:
```bash
cd frontend
npm install
```

2. Start the React development server:
```bash
npm start
```

## API Structure

### Frontend API Organization
- `src/api/client.js` - Base API client configuration
- `src/api/dataApi.js` - Data-related API calls
- `src/api/chatApi.js` - Chat/AI-related API calls
- `src/api/index.js` - API exports

### Backend AI System
- `ai/config.py` - Configuration settings
- `ai/database.py` - Database operations
- `ai/llm.py` - Gemini LLM wrapper
- `ai/graph.py` - LangGraph RAG implementation

## Chat Features
- Ask questions about K2, TOI, or CUM datasets
- AI will ask for column specification if not provided
- Read-only database queries
- Error handling for invalid requests