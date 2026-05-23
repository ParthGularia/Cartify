# 🛒 Cartify
**AI-Powered E-Commerce Platform with Visual Search & Intelligent Recommendations**

An innovative full-stack e-commerce prototype that combines a modern React storefront with a sophisticated Flask backend, featuring AI-driven product recommendations, intelligent chatbot assistance, anomaly detection, and sentiment analysis.

---

## 🎯 Project Overview

**Cartify** is a next-generation commerce platform designed to demonstrate how AI/ML technologies can enhance the shopping experience. It solves key e-commerce challenges:

- **Product Discovery** – Find items via text search, image uploads, or AI recommendations
- **Customer Support** – AI chatbot provides personalized assistance 24/7
- **Fraud Prevention** – Visual anomaly detection for seller verification


**Type**: Full-stack SPA with serverless backend  
**Users**: Individual customers, sellers/merchants  
**Core Workflow**: Browse → Search/Recommend → Cart → Support (via chatbot/anomaly detection)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| **🤖 AI Shopping Assistant** | LangChain + Google Generative AI chatbot with persistent conversation history |
| **🖼️ Visual Recommendations** | Upload a product image to find similar items in catalog |
| **🔍 Smart Search** | Token-based search with category & price filtering |
| **✅ Anomaly Detection** | ResNet50 + SSIM for seller image verification & fraud detection |
| ** Dual-Role Auth** | Customer & seller authentication via Supabase |
| **💾 Chat History** | Persistent conversation storage per user |
| **📱 Responsive UI** | Mobile-optimized with Tailwind CSS 4.0 |
| **⚡ Fast Performance** | Vite bundling, lazy loading, optimized assets |
| **🌐 CORS-Protected APIs** | Scoped blueprint-level CORS configuration |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, React Router 7, Tailwind CSS 4, Vite 6, Lucide Icons |
| **Backend** | Flask 3, Flask-CORS, Supabase SDK |
| **Authentication** | Supabase Auth (JWT-based) |
| **AI/ML** | LangChain, Google Generative AI (Gemini 2.5), ResNet50, TensorFlow |
| **Image Processing** | OpenCV, scikit-image (SSIM), scikit-learn (cosine similarity) |
| **Data Processing** | Pandas, NumPy |
| **Deployment** | Vercel (serverless), Railway, Render, Google Cloud Run |
| **Build Tools** | Vite, npm, pip |

---

## 📁 Project Structure

```
Cartify/
├── Frontend/                    # React SPA
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── Login.jsx       # Auth component
│   │   │   ├── Signup.jsx      # Registration flow
│   │   │   ├── Navbar.jsx      # Header navigation
│   │   │   ├── CustomerHome.jsx # Main customer dashboard
│   │   │   ├── SellerHome.jsx  # Seller dashboard
│   │   │   ├── Search.jsx      # Search bar component
│   │   │   ├── SearchedProducts.jsx # Search results
│   │   │   ├── Cart.jsx        # Shopping cart
│   │   │   ├── Chatbot.jsx     # AI assistant UI
│   │   │   └── AnomalyDetection.jsx # Image verification
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Global auth state
│   │   ├── services/
│   │   │   ├── api.js          # API client wrapper
│   │   │   ├── supabaseClient.js # Supabase init
│   │   │   └── supabaseOrders.js # Order management
│   │   ├── hooks/
│   │   │   ├── useOrders.js    # Order fetching hook
│   │   │   └── useProfile.js   # User profile hook
│   │   ├── assets/             # Product images (Baby, Kids, Men, Women)
│   │   ├── data/
│   │   │   └── OrderDetails.js # Sample order data
│   │   ├── App.jsx             # Main router setup
│   │   └── main.jsx            # Entry point
│   ├── vite.config.js          # Vite configuration
│   ├── eslint.config.js        # Linting rules
│   └── package.json            # Dependencies
│
├── Backend/                     # Flask API
│   ├── app/
│   │   ├── __init__.py         # Flask app factory
│   │   ├── config/
│   │   │   └── settings.py     # Environment & config loader
│   │   ├── routes/             # API endpoints
│   │   │   ├── chatbot_routes.py    # /chat endpoints
│   │   │   ├── recommendation_routes.py # /recommend endpoints
│   │   │   ├── anomaly_routes.py    # /upload (anomaly detection)
│   │   │   └── search_routes.py     # /search endpoints
│   │   ├── models/             # ML models
│   │   │   ├── chatbot_model.py    # LangChain chatbot wrapper
│   │   │   ├── recommendation_model.py # ResNet50 + similarity
│   │   │   └── anomaly_model.py    # SSIM & cosine similarity
│   │   └── utils/
│   │       └── conversation_db.py # Chat history management
│   ├── app.py                  # Entry point
│   ├── requirements.txt         # Python dependencies
│   ├── vercel.json            # Serverless configuration
│   ├── DEPLOYMENT.md          # Deployment guide
│   ├── recommend_data.csv     # Product dataset
│   └── final_file.csv         # Catalog metadata
│
└── README.md                   # This file
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `app/__init__.py` | Flask app factory with blueprint registration |
| `app/config/settings.py` | Environment loader, config management |
| `app/routes/*_routes.py` | REST endpoint blueprints with CORS |
| `app/models/*_model.py` | ML model wrappers, feature extraction |
| `app/utils/conversation_db.py` | Chat history management utilities |
| `Frontend/src/context/AuthContext.jsx` | Global auth state management |
| `Frontend/src/services/api.js` | HTTP client for backend |
| `vite.config.js` | Frontend build & dev server config |

---

## 🚀 Quick Start

### Backend Setup

```bash
# 1. Navigate to backend
cd Backend

# 2. Create virtual environment
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # macOS/Linux

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create .env file
cat > .env << EOF
SECRET_KEY=your-secret-key-here
GOOGLE_API_KEY=your-google-api-key
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
FLASK_DEBUG=True
EOF

# 5. Start server
python app.py
```

Server runs on `http://localhost:5000`

### Frontend Setup

```bash
# 1. Navigate to frontend
cd Frontend

# 2. Install dependencies
npm install

# 3. Create .env.local (if needed)
cat > .env.local << EOF
VITE_API_BASE_URL=http://localhost:5000
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
EOF

# 4. Start dev server
npm run dev
```

App runs on `http://localhost:5173`

---

## 📡 API Endpoints

### Authentication
```
POST /login          - Customer/seller login
POST /register       - User registration
```

### AI Chatbot
```
POST /chat                    - Send message & get AI response
DELETE /chat/delete-history   - Clear conversation history
```

### Product Recommendations
```
POST /recommend             - Get recommendations from uploaded image
POST /recommend/search      - Text-based search with filters
```

### Image Anomaly Detection
```
POST /upload               - Compare images for fraud detection
```

### Search
```
GET /search                - Search users/sellers
GET /search/products       - Catalog search
```

### Response Format Example
```json
{
  "bot": "How can I help you find the perfect product?",
  "username": "user@example.com",
  "user_role": "customer",
  "thread_id": "user_main_thread"
}
```

---

## 🗂️ Environment Variables

Create a `.env` file in the `Backend/` directory:

```env

# Flask
SECRET_KEY=your-very-secure-secret-key-change-this
FLASK_DEBUG=False

# AI/ML
GOOGLE_API_KEY=sk-proj-your-google-api-key

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://yourdomain.com

# Optional
PORT=5000
```

| Variable | Required | Purpose |
|----------|----------|---------|
| `SECRET_KEY` | ✅ | Flask session encryption |
| `GOOGLE_API_KEY` | ✅ | Gemini API for chatbot/sentiment |
| `ALLOWED_ORIGINS` | ❌ | CORS allowed domains (defaults to `*`) |
| `FLASK_DEBUG` | ❌ | Debug mode (default: False) |
| `PORT` | ❌ | Server port (default: 5000) |

---

## 🎨 Frontend Architecture

### Routing Structure
- `/login` – Authentication page
- `/signup` – Registration page
- `/women`, `/men`, `/kids`, `/baby` – Category dashboards
- `/seller` – Seller dashboard
- `/search` – Search results
- `/cart` – Shopping cart
- Protected routes require authentication via `ProtectedRoute` wrapper

### State Management
- **Global**: `AuthContext` (user, session, role)
- **Local**: `useState` for UI state (cart, search, chatbot)
- **Persistence**: Chat history via API, cart in React state

### Key Components
- `Navbar` – Search bar & navigation
- `Chatbot` – Floating AI assistant
- `AnomalyDetection` – Image upload verification
- `Cart` – Shopping cart with quantity control

---

## ⚙️ Backend Architecture

### Flask Factory Pattern
```python
# app/__init__.py
from flask import Flask

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)
    CORS(app, resources={...})
    # Register blueprints...
    return app
```

### Blueprint-Based Organization
Each feature has its own blueprint with scoped CORS:
- `chatbot_routes.py` – LangChain + Google AI
- `recommendation_routes.py` – ResNet50 + cosine similarity
- `anomaly_routes.py` – SSIM + image comparison
- `search_routes.py` – Pandas-based catalog search

### Error Handling
- Graceful fallbacks when ML dependencies missing
- Try/except blocks for all external API calls
- Proper HTTP status codes (400, 500, etc.)

### CORS Security
```python
CORS(bp, resources={
    r'/chat*': {'origins': ALLOWED_ORIGINS}
})
```

---

## 🚀 Deployment

### Vercel (Recommended for Serverless)

1. **Set environment variables** in Vercel dashboard
2. **Deploy**:
   ```bash
   cd Backend
   vercel deploy
   ```
3. **Frontend**: Deploy from GitHub via Vercel

See `Backend/DEPLOYMENT.md` for detailed steps.

### Alternative Platforms

| Platform | Pros | Cons |
|----------|------|------|
| **Railway** | Great ML support, easy scaling | Paid tier required |
| **Render** | Free tier, good docs | Slower startup |
| **Google Cloud Run** | Excellent ML libraries | Learning curve |
| **AWS Lambda** | Industry standard | Complex setup |

### Docker Deployment

```dockerfile
# Backend
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

---

## 📦 Dependencies Overview

### Frontend (`package.json`)
- **React 18** – UI framework
- **Vite 6** – Lightning-fast bundler
- **Tailwind CSS 4** – Utility-first styling
- **React Router 7** – Client-side routing
- **Supabase** – Backend-as-a-service auth
- **Lucide Icons** – Beautiful SVG icons

### Backend (`requirements.txt`)
- **Flask 3** – Web framework
- **flask-pymongo** – MongoDB driver
- **LangChain** – AI orchestration
- **google-generativeai** – Gemini API for chatbot
- **TensorFlow** – Deep learning
- **OpenCV** – Image processing
- **scikit-learn** – ML utilities
- **Pandas** – Data manipulation

---

## 🔐 Security Considerations

### Current Implementation
✅ Supabase JWT authentication  
✅ CORS configuration per blueprint  
✅ Graceful error messages (no stack traces)

### Recommended Improvements
- [ ] Add request validation (Pydantic/Flask-RESTful)
- [ ] Enable HTTPS in production
- [ ] Add CSRF protection
- [ ] Implement API key rotation
- [ ] Add logging/monitoring (Sentry)
- [ ] Implement rate limiting on endpoints

---

## 🧪 Testing & Linting

```bash
# Frontend
cd Frontend
npm run lint         # ESLint check
npm run build        # Build production

# Backend
cd Backend
pip install pytest pytest-cov
pytest              # Run tests
pytest --cov        # With coverage
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📋 Roadmap

- [ ] Add product image gallery
- [ ] Implement user reviews & ratings
- [ ] Add order management system
- [ ] Support multiple payment gateways
- [ ] Real-time inventory updates
- [ ] Advanced recommendation algorithms (collaborative filtering)
- [ ] Mobile app (React Native)
- [ ] Admin dashboard
- [ ] Analytics & insights
- [ ] Multi-language support

---

## 🐛 Known Issues & Workarounds

| Issue | Workaround |
|-------|-----------|
| PyTorch version conflicts on Vercel | Use `requirements-minimal.txt` |
| CORS errors in browser | Add origin to `ALLOWED_ORIGINS` |
| Missing Google API key | Chatbot returns fallback message |

---

## 📚 Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [React Documentation](https://react.dev)
- [LangChain Docs](https://python.langchain.com/)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [OpenCV Docs](https://docs.opencv.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)

---

## 📄 License

This project is licensed under the MIT License – see LICENSE file for details.

---

##  Authors

- **Dev Team** – Full-stack development
- Built as a proof-of-concept for AI-powered e-commerce

---

##  FAQ

**Q: Can I use this in production?**  
A: This is a prototype. For production, add security hardening, tests, and proper error handling.

**Q: How do I add more products?**  
A: Update `recommend_data.csv` and `final_file.csv` in the Backend folder.

**Q: Can I change the AI model?**  
A: Yes! Modify `GOOGLE_API_KEY` to use any LangChain-compatible LLM, or swap `ResNet50` for other vision models.

**Q: What's the max chat history?**  
A: No hard limit; consider adding pagination if users have >100 conversations.

---

**Built with  using React, Flask, and AI**
