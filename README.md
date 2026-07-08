# 🌌 ExoQuest — Multi-Mission Exoplanet Analysis Platform

> Built for the **NASA Space Apps Challenge**

ExoQuest is a full-stack web application that lets researchers and enthusiasts explore, query, and classify exoplanet candidates across three major NASA missions — **Kepler**, **K2**, and **TESS (TOI)** — using machine learning models and a natural-language AI assistant powered by Google Gemini.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔭 **Multi-Mission ML Classification** | Upload CSVs or enter features manually to classify stars as *Confirmed*, *Candidate*, or *False Positive* using mission-specific trained models |
| 🤖 **AI Chat Assistant** | Ask natural language questions about the data — the Gemini-powered RAG agent executes SQL, generates Plotly charts, and searches the web |
| 📊 **Data Explorer** | Browse and search the full Kepler, K2, and TOI databases with column-level filtering and live pagination |
| 📈 **Interactive Visualizations** | LLM-generated Plotly charts rendered inline in the Query Response tab |
| 🪐 **Planet Detail View** | Click any record to see a dedicated info page for that star/planet object |
| 📰 **News Tab** | Latest exoplanet-related news with an animated starfield background |
| ⬇️ **Downloadable Results** | Prediction results exported as annotated CSVs with confidence scores |

---

## 🏗️ Architecture

```
NASA-APP-CHALLENGE/
├── backend/                  # Python / Flask API
│   ├── app.py                # Server entry point
│   ├── kepler_wrapper.py     # Kepler ML inference pipeline
│   ├── k2_wrapper.py         # K2 ML inference pipeline (XGBoost)
│   ├── toi_wrapper.py        # TESS/TOI ML inference pipeline
│   ├── database.py           # SQLAlchemy DB connection
│   ├── models/               # Serialised .pkl model + preprocessor files
│   │   ├── kepler.pkl
│   │   ├── kepler_preprocess.pkl
│   │   ├── k2.pkl
│   │   ├── k2_preprocess.pkl
│   │   ├── toi.pkl
│   │   └── toi_preprocess.pkl
│   ├── ai/                   # RAG + LLM layer
│   │   ├── graph.py          # RAGGraph orchestrator
│   │   ├── llm.py            # GeminiLLM with tool dispatch (SQL / plot / search)
│   │   ├── plot_tools.py     # Plotly code execution helpers
│   │   ├── web_search.py     # Web search tool
│   │   ├── pos_col.py        # Column metadata per mission
│   │   └── config.py         # Environment config + validation
│   └── routes/               # Flask Blueprints
│       ├── prediction_routes.py   # /predict (file upload + manual entry)
│       ├── chat_routes.py         # /chat + /chat/stream (SSE)
│       ├── query_routes.py        # /query
│       ├── table_routes.py        # /tables + /columns
│       ├── search_routes.py       # /search
│       ├── sql_tools_routes.py    # /sql-tools
│       └── download_routes.py     # /download
│
└── front/                    # React + Vite frontend
    └── src/
        ├── App.jsx           # Root component + tab routing
        ├── components/
        │   ├── home/         # Landing page
        │   ├── predict/      # File upload + manual prediction UI
        │   ├── chatbot/      # Streaming chat + query results
        │   ├── news/         # News feed
        │   ├── about/        # About page
        │   ├── planetinfo/   # Planet detail view
        │   └── common/       # StarfieldBackground, ShootingStarCursor, etc.
        ├── api/              # Axios API layer
        ├── store/            # State management
        ├── hooks/            # Custom React hooks
        └── theme.jsx         # MUI dark/light themes
```

---

## 🧠 ML Models

Each NASA mission has its own dedicated preprocessing + inference pipeline:

### Kepler
- **Features**: `koi_score`, `koi_period`, `koi_depth`, `koi_prad`, `koi_teq`, `koi_insol`, `koi_model_snr`, `koi_steff`, `koi_slogg`, `koi_srad` (38 total)
- **Preprocessing**: Imputation → feature alignment
- **Output**: `FALSE POSITIVE` / `CANDIDATE` / `CONFIRMED`

### K2 (XGBoost)
- **Features**: Orbital period, planet radius, stellar temperature, discovery metadata, and more
- **Preprocessing**: Numeric coercion → outlier clipping (IQR) → median imputation → standard scaling
- **Output**: Predicted class + **per-class probability scores**

### TESS / TOI
- **Features**: Transit parameters + engineered features (SNR ratios, planet-star radius ratio, absolute magnitude, depth-magnitude ratio)
- **Preprocessing**: Feature engineering → outlier clipping → imputation → scaling → **top-33 feature selection**
- **Output**: Predicted class + **confidence score** + per-class probabilities

---

## 🤖 AI Assistant

The AI assistant is built on a **tool-dispatching RAG architecture**:

1. **User message** → `RAGGraph.process_message()`
2. **Gemini 2.0 Flash** generates a structured JSON plan with ordered steps
3. Steps are executed sequentially:
   - `execute_sql` → read-only PostgreSQL queries
   - `plot_graph` → Plotly Express code executed against query results
   - `web_search` → comprehensive web search for domain explanations
4. Results streamed back word-by-word via **Server-Sent Events (SSE)**

---

## 🚀 Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL database (Neon or local)
- Google Gemini API key

---

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

Start the Flask server:

```bash
python app.py
```

The API will be available at `http://localhost:5000`.

---

### Frontend Setup

```bash
cd front
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔌 API Reference

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/predict` | Upload CSV/XLSX for batch ML prediction |
| `POST` | `/api/predict/manual` | Single-record prediction with JSON features |
| `POST` | `/api/chat` | AI chat query (full response) |
| `POST` | `/api/chat/stream` | AI chat query (SSE streaming) |
| `GET` | `/api/tables` | List available mission tables |
| `GET` | `/api/columns/<table>` | Get columns for a table |
| `GET` | `/api/search` | Search across a table |
| `GET` | `/api/download/<filename>` | Download prediction result CSV |

### Prediction Request Example

```bash
curl -X POST http://localhost:5000/api/predict \
  -F "file=@kepler_data.csv" \
  -F "type=kepler"
```

**Supported `type` values:** `kepler`, `k2`, `toi`

### Chat Request Example

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Plot a histogram of orbital periods", "table": "k2"}'
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **Flask** | REST API server |
| **XGBoost / CatBoost / scikit-learn** | ML model training & inference |
| **Google Gemini 2.0 Flash** | LLM for natural language + tool dispatch |
| **PostgreSQL (Neon)** | Hosted astronomical database |
| **SQLAlchemy** | ORM / query execution |
| **Pandas / NumPy** | Data preprocessing pipelines |
| **Plotly** | Server-side chart rendering |
| **Gunicorn** | Production WSGI server |

### Frontend
| Technology | Purpose |
|---|---|
| **React + Vite** | UI framework + dev tooling |
| **Material UI (MUI)** | Component library |
| **Framer Motion** | Animated panel transitions |
| **Tailwind CSS** | Utility styling |
| **Axios** | API client |

---

## 📁 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | Google AI Studio API key |
| `DATABASE_URL` | ✅ | PostgreSQL connection string (`postgresql://...`) |
| `PORT` | ❌ | Server port (default: `5000`) |
| `FLASK_DEBUG` | ❌ | Enable debug mode (`true`/`false`) |

---

## 🪐 Data Sources

- **Kepler Objects of Interest (KOI)** — [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/)
- **K2 Campaign Data** — [NASA Exoplanet Archive – K2](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=k2targets)
- **TESS Objects of Interest (TOI)** — [NASA TOI Catalog](https://exoplanetarchive.ipac.caltech.edu/cgi-bin/TblView/nph-tblView?app=ExoTbls&config=TOI)

---

## 📄 License

This project was built for the **NASA Space Apps Challenge 2025** and is intended for educational and research use.
