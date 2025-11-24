# Cartify

AI-assisted commerce prototype that pairs a Vite/React storefront with a Flask backend packed with recommendation, chatbot, anomaly detection, and sentiment analysis services. The repo is split into two top-level folders:

- `Frontend/` – Vite 6 + React 18 SPA with Tailwind CSS 4.0, reusable components for customer/seller flows, in-app chatbot UI, anomaly detection workflow, and sample product catalog data.
- `Backend/` – Flask 3 app configured for Vercel/Serverless deployment, MongoDB persistence via `flask-pymongo`, LangChain/Google Generative AI hooks, and several ML-assisted endpoints.

## Highlights

- **AI shopping assistant** (`app/routes/chatbot_routes.py`) uses LangChain + Google Generative AI to personalize replies and persists conversation history per user.
- **Visual recommendations** (`app/routes/recommendation_routes.py`) accept an uploaded product image, match it against `recommend_data.csv`, and return the closest items plus deeplinks.
- **Anomaly detection** (`app/routes/anomaly_routes.py`) compares seller-uploaded proof photos against catalog assets using cosine similarity + SSIM via `app/models/anomaly_model.py`.
- **Sentiment pulse** (`app/routes/sentiment_routes.py`) classifies customer feedback and returns canned guidance for agents.
- **Account & search flows** (`app/routes/login_routes.py`, `app/routes/search_routes.py`) handle seller/customer onboarding and quick lookups against MongoDB collections.
- **Graceful ML fallbacks** warn when heavy dependencies (Torch, TensorFlow, OpenCV, etc.) are missing so basic API traffic continues to work.

## Tech Stack

| Layer     | Tools |
|-----------|-------|
| Frontend  | React 18, React Router 7, Tailwind CSS 4 via `@tailwindcss/vite`, Lucide icons, Vite tooling |
| Backend   | Flask 3, flask-cors, flask-pymongo, LangChain, Google Generative AI SDK, NumPy/Pandas/SciKit, Torch/TensorFlow, OpenCV |
| Data      | MongoDB Atlas (customers/sellers + chat history), CSV datasets (`recommend_data.csv`, `final_file.csv`) cached in `Backend/` |

## Backend Setup

1. Install Python 3.12+ and MongoDB Atlas (or a local instance).
2. `cd Backend`
3. Create a venv and install dependencies (full ML stack):  
   ```bash
   python -m venv .venv
   .venv\Scripts\activate  # Windows
   pip install -r requirements.txt
   ```
   *If deploying to Vercel without GPUs, read `Backend/DEPLOYMENT.md` for the minimal requirements workflow.*
4. Create `Backend/.env` (or set system vars) with the values below.
5. Start the API:
   ```bash
   python app.py
   ```

### Required Environment Variables

| Name | Purpose |
|------|---------|
| `MONGO_URI` | Connection string for customers/sellers/chat collections. |
| `SECRET_KEY` | Flask session signing key. |
| `GOOGLE_API_KEY` | Enables LangChain Google responses for the chatbot + sentiment. |
| `ALLOWED_ORIGINS` | Comma-separated list of domains allowed via CORS (defaults to `http://localhost:3000`). |
| `FLASK_DEBUG` | Optional (`True`/`False`) – toggles Flask debug logging. |

The loader in `app/config/settings.py` automatically reads `.env` two directories above that file, so placing the file inside `Backend/` is sufficient.

## Frontend Setup

1. Install Node.js 20+.
2. `cd Frontend`
3. Install deps and start Vite dev server:
   ```bash
   npm install
   npm run dev
   ```
4. By default the SPA proxies requests directly to `http://127.0.0.1:5000`. Update component fetch URLs or create a Vite proxy if the backend lives elsewhere.

## API Overview

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/login`, `/register` | Customer/seller auth flows with MongoDB storage. |
| `POST` | `/chat` | Sends a message to the AI assistant; persists per-user threads. |
| `DELETE` | `/chat/delete-history` | Bulk removes stored chats for a user. |
| `POST` | `/recommend` | Accepts an `image` form field and returns similar products. |
| `POST` | `/recommend/search` | Text-based search with category/price filters over CSV data. |
| `POST` | `/upload` | Image anomaly detection (seller verification workflow). |
| `POST` | `/sentiment`, `/sentiment/batch` | Single or batch sentiment analysis responses. |
| `GET` | `/search` | Searches customers/sellers collections. |
| `GET` | `/search/products` | Placeholder endpoint for catalog search. |

Each blueprint in `app/routes/` configures its own CORS scope based on `ALLOWED_ORIGINS`.

## Data & Models

- `recommend_data.csv` & `final_file.csv` – sample catalog metadata used by recommendation/search endpoints.
- `app/models/*` – thin wrappers for embedding extraction, SSIM calculations, and chatbot/sentiment prompts. Heavy dependencies such as Torch, TensorFlow, OpenCV, and Transformers are listed in `Backend/requirements.txt`.
- `app/utils/conversation_db.py` provides helper utilities for persisting and pruning chat history in MongoDB.

## Deployment Notes

- `Backend/vercel.json` contains the minimal serverless configuration; see `Backend/DEPLOYMENT.md` for dependency trade-offs, platform recommendations (Vercel, Railway, Render, Cloud Run), and environment variable checklists.
- Frontend can be shipped via Vercel/Netlify/Cloudflare Pages. Point `VITE_BACKEND_URL` (if you add it) or hard-coded fetch URLs to the deployed Flask API.

## Next Steps

- Secure credentials (hash passwords, move secrets to a vault, add validation).
- Replace placeholder CSV logic with a proper product collection.
- Add automated tests and CI linting (`npm run lint`, `pytest`/`pytest-cov` recommendations).
- Containerize both services for predictable dev/prod parity.
