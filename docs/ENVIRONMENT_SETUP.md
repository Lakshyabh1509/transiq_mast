# TransactIQ - Environment Setup Guide

Complete guide for setting up the TransactIQ development environment.

---

## 📋 Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| **Node.js** | 18+ (20 recommended) | Frontend runtime |
| **npm/pnpm** | 9+ | Package management |
| **Python** | 3.11+ | Backend runtime |
| **PostgreSQL** | 15+ | Primary database |
| **Redis** | 7+ | Query caching |
| **Git** | 2.40+ | Version control |

### Optional
- **Docker** & **Docker Compose** - Containerized setup
- **VS Code** - Recommended IDE with extensions

---

## 🚀 Quick Start (Docker)

The fastest way to get everything running:

```bash
# Clone repository
git clone https://github.com/your-org/transactiq.git
cd transactiq

# Start all services
docker-compose up -d

# Access
# Frontend: http://localhost:5173
# Backend:  http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## 🔧 Manual Setup

### 1. Clone Repository

```bash
git clone https://github.com/your-org/transactiq.git
cd transactiq
```

### 2. Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
.\venv\Scripts\activate
# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
```

**Edit `backend/.env`:**
```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/transactiq

# Redis (optional for development)
REDIS_URL=redis://localhost:6379

# Security
APP_SECRET_KEY=your-super-secret-key-change-in-production

# CORS
CORS_ORIGINS=http://localhost:5173,http://localhost:5174
```

**Start Backend:**
```bash
uvicorn app.main:app --reload --port 8000
```

### 3. Frontend Setup

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

**Edit `frontend/.env`:**
```env
# API URL (backend)
VITE_API_URL=http://localhost:8000

# Supabase (optional - for production auth)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Start Frontend:**
```bash
npm run dev
```

### 4. Database Setup

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE transactiq;

# Exit
\q
```

The backend will auto-create tables on first run (SQLAlchemy).

---

## 📁 Environment Files Reference

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `REDIS_URL` | ❌ | Redis connection (caching) |
| `APP_SECRET_KEY` | ✅ | JWT/session secret |
| `CORS_ORIGINS` | ✅ | Allowed frontend origins |
| `DEBUG` | ❌ | Enable debug mode |

### Frontend (`frontend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_API_URL` | ✅ | Backend API URL |
| `VITE_SUPABASE_URL` | ❌ | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | ❌ | Supabase anonymous key |

---

## 🧪 Development Workflow

### Running Both Services

**Terminal 1 - Backend:**
```bash
cd backend
.\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Demo Mode

Click **"Try Demo"** on login page - no database required!

### TypeScript Check

```bash
cd frontend
npx tsc --noEmit
```

### Linting

```bash
# Frontend
npm run lint

# Backend
pip install ruff
ruff check .
```

---

## 🗄️ Database Seeding

Load sample data for development:

```bash
cd backend
python -m app.scripts.seed_data
```

Or upload via UI:
1. Login as demo admin
2. Navigate to **Upload Data**
3. Download sample CSV
4. Upload the CSV file

---

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Rebuild after changes
docker-compose up -d --build

# Reset database
docker-compose down -v
docker-compose up -d
```

---

## 🔧 VS Code Extensions

Recommended extensions for development:

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "ms-python.python",
    "ms-python.vscode-pylance",
    "charliermarsh.ruff"
  ]
}
```

---

## 🌐 Production Deployment

### Environment Variables (Production)

```env
# Backend
DATABASE_URL=postgresql://user:pass@prod-host:5432/transactiq
REDIS_URL=redis://prod-redis:6379
APP_SECRET_KEY=<strong-random-key>
DEBUG=false

# Frontend
VITE_API_URL=https://api.transactiq.com
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=<production-anon-key>
```

### Build Commands

```bash
# Frontend production build
cd frontend
npm run build

# Output in frontend/dist/
```

---

## ❓ Troubleshooting

| Issue | Solution |
|-------|----------|
| `EACCES` on npm install | Run with admin/sudo or fix npm permissions |
| Database connection failed | Check PostgreSQL is running and credentials |
| CORS errors | Verify `CORS_ORIGINS` includes frontend URL |
| Port already in use | Kill process or use different port (`--port 5174`) |
| Module not found | Re-run `npm install` or `pip install -r requirements.txt` |

---

## 📚 Additional Resources

- [Supabase Setup Guide](./SUPABASE_SETUP.md) - Authentication integration
- [API Documentation](http://localhost:8000/docs) - Swagger/OpenAPI docs
- [README.md](../README.md) - Project overview

---

<p align="center">
  <strong>Happy Coding! 🚀</strong>
</p>
