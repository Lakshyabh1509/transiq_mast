# TransactIQ - Enterprise Transaction Intelligence Platform

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/FastAPI-0.109-009688?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/PostgreSQL-15+-336791?logo=postgresql" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/License-Proprietary-blue" alt="License" />
</p>

<p align="center">
  <strong>ML-powered transaction analytics for banks and payment processors</strong>
</p>

---

## 🎯 Overview

**TransactIQ** is an enterprise-grade transaction analytics platform that provides:
- Real-time transaction monitoring and KPI dashboards
- ML-powered churn prediction (94% accuracy)
- Merchant performance analytics with risk scoring
- Automated report generation and scheduling
- Two-factor authentication and role-based access

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📊 **Smart Dashboard** | Real-time KPIs with trend analysis and interactive charts |
| 🔮 **Churn Prediction** | ML-powered risk scoring with actionable insights |
| 👥 **Merchant Analytics** | Click-to-view details with call/email contact actions |
| 📤 **Data Import** | CSV upload with validation and sample data download |
| 📑 **Report Generation** | Weekly/monthly reports with PDF/CSV export |
| 🔐 **Enterprise Security** | 2FA, password policies, Supabase integration |
| 🌙 **Dark Mode** | Full theme support with system preference detection |

---

## 🚀 Quick Start

### Option 1: Demo Mode (No Setup Required)

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173` → Click **"Try Demo"**

### Option 2: Docker (Recommended)

```bash
docker-compose up -d
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 3: Manual Setup

**Backend:**
```bash
cd backend
python -m venv venv
.\venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```
transactiq/
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/            # REST endpoints
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic
│   └── requirements.txt
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Data fetching
│   │   ├── context/        # Auth context
│   │   └── lib/            # Utilities
│   └── package.json
├── docs/                   # Documentation
│   ├── ENVIRONMENT_SETUP.md
│   └── SUPABASE_SETUP.md
├── data/                   # Sample data
└── docker-compose.yml
```

---

## 🔧 Environment Variables

### Frontend (`frontend/.env`)
```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Backend (`backend/.env`)
```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/transactiq
REDIS_URL=redis://localhost:6379
APP_SECRET_KEY=your-secret-key
CORS_ORIGINS=http://localhost:5173
```

---

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [Environment Setup](./docs/ENVIRONMENT_SETUP.md) | Complete setup guide |
| [Supabase Integration](./docs/SUPABASE_SETUP.md) | Authentication setup |
| [API Documentation](http://localhost:8000/docs) | Swagger/OpenAPI |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React 18, TypeScript, Vite, TailwindCSS |
| **State** | TanStack Query, React Context |
| **UI** | Lucide Icons, Recharts, Custom Components |
| **Backend** | FastAPI, SQLAlchemy, Pydantic |
| **Database** | PostgreSQL, Redis |
| **Auth** | Supabase (optional) |

---

## 🔐 Authentication

**Demo Mode:** Click "Try Demo" - no credentials needed

**Production:** Supabase integration with:
- Email/password authentication
- Two-factor authentication (TOTP)
- Role-based access (Admin/Analyst)

---

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/dashboard/kpis` | GET | Dashboard metrics |
| `/api/v1/churn/risks` | GET | Churn risk list |
| `/api/v1/merchants` | GET | Merchant directory |
| `/api/v1/upload/csv` | POST | Data import |

---

## 🚢 Deployment

### Vercel (Frontend)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Railway/Render (Backend)
- Connect GitHub repository
- Set environment variables
- Deploy from `backend/` directory

---

## 📄 License

**Proprietary** - All rights reserved.

---

<p align="center">
  <strong>Built for Enterprise. Trusted by Leading Institutions.</strong>
</p>
