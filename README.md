# 📄 ResumeAI — AI Resume Analyzer + Interview Coach

A full-stack MERN application that uses **Google Gemini AI** to analyze resumes and provide:
-  ATS compatibility score
-  Strengths & weaknesses
-  Missing keywords
-  Skill gap analysis
-  Improved bullet points
-  Suggested projects
-  Interview questions

---

## 🏗️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React (Vite), Tailwind CSS, Axios, React Router |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| AI | Google Gemini 1.5 Flash |
| Auth | JWT + bcryptjs |
| File Upload | multer + pdf-parse |

---

## 📁 Folder Structure

```
Resume Analyzer/
├── backend/
│   ├── server.js              ← Express entry point
│   ├── .env                   ← Your environment variables
│   ├── .env.example           ← Template for env vars
│   ├── routes/
│   │   ├── auth.js            ← /signup /login
│   │   └── analyze.js         ← /upload /history
│   ├── models/
│   │   ├── User.js
│   │   └── Resume.js
│   ├── middleware/
│   │   └── auth.js            ← JWT verification
│   └── services/
│       └── geminiService.js   ← Gemini AI integration
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx            ← Routes + ProtectedRoute
        ├── main.jsx
        ├── index.css          ← Global styles + Tailwind
        ├── pages/
        │   ├── Login.jsx
        │   └── Dashboard.jsx
        └── components/
            ├── Navbar.jsx
            ├── ResumeUpload.jsx
            └── AnalysisCard.jsx
```

---

## ⚡ Quick Start

### 1. Clone / Open the project

```bash
cd "Resume Analyzer"
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Copy the env template and fill in your values:

```bash
copy .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resume-analyzer
JWT_SECRET=make_this_a_long_random_string
GEMINI_API_KEY=your_gemini_api_key_here
```

Start the backend:

```bash
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running at http://localhost:5000
```

### 3. Set up the Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Visit: **http://localhost:5173**

---

## 🔑 Getting a Gemini API Key (Free)

1. Go to [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy and paste it into `backend/.env` as `GEMINI_API_KEY`

---

## 🗄️ MongoDB Setup

### Option A — Local MongoDB
Install [MongoDB Community](https://www.mongodb.com/try/download/community) and run it.
Your URI: `mongodb://localhost:27017/resume-analyzer`

### Option B — MongoDB Atlas (Cloud, Free)
1. Create an account at [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free cluster
3. Get your connection string
4. Replace `MONGO_URI` in `.env`

---

## 🌐 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/signup` | No | Register new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| POST | `/api/analyze/upload` | Yes | Upload PDF + analyze |
| GET | `/api/analyze/history` | Yes | Get past analyses |

Auth header format:
```
Authorization: Bearer <your_jwt_token>
```

---

## 🔧 Environment Variables

### Backend (`backend/.env`)
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/resume-analyzer
JWT_SECRET=your_super_secret_jwt_key_here
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend — handled via Vite proxy
The frontend proxies `/api` requests to `http://localhost:5000` automatically (configured in `vite.config.js`). No `.env` needed for frontend.

---

## 📦 Full Install Commands

```bash
# Backend
cd backend && npm install

# Frontend (new terminal)
cd frontend && npm install
```

---

## 🚀 Running the App

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

---

## 💡 How the AI Works

1. User uploads a PDF resume
2. `pdf-parse` extracts the text content
3. The text is sent to **Google Gemini 1.5 Flash** with a structured prompt
4. The prompt asks Gemini to return a strict JSON object with:
   - ATS score, strengths, weaknesses, missing keywords, skill gaps,
     improved bullets, suggested projects, interview questions
5. The JSON is parsed and saved to MongoDB
6. The frontend renders the structured data in beautiful cards

See `backend/services/geminiService.js` for the full prompt.

---

## 🎨 UI Features

- 🌑 Deep dark theme with purple/blue gradients
- 💎 Glassmorphism cards (`backdrop-blur`)
- 🎯 Animated ATS score circle (SVG)
- 📎 Drag-and-drop file upload
- 📊 Upload progress bar
- ⚡ Loading spinners
- 📱 Fully responsive layout
- ✨ Slide-in and fade-in animations

---

## 🧠 Learning Concepts in This Project

| Concept | Where to Find It |
|---------|-----------------|
| React hooks (useState, useEffect) | All components |
| React Router + protected routes | `App.jsx` |
| Axios HTTP requests | All pages |
| JWT authentication flow | `auth.js` route + middleware |
| bcrypt password hashing | `routes/auth.js` |
| Mongoose schemas + CRUD | `models/`, `routes/analyze.js` |
| File upload with multer | `routes/analyze.js` |
| PDF text extraction | `routes/analyze.js` |
| LLM prompt engineering | `services/geminiService.js` |
| Drag-and-drop in React | `ResumeUpload.jsx` |

---

## 📝 License

MIT — Free to use for personal projects and portfolios.
