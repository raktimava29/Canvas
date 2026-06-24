# MindTube 🎓🧠

**MindTube** is a full-stack collaborative learning platform that pairs a notepad and whiteboard directly with any YouTube video or hosted video URL — so your notes and sketches live alongside the content that inspired them.

> 🚀 **Live demo:** [mindtube-pied.vercel.app](https://mindtube-pied.vercel.app/)

---

## ✨ Features

- 🔑 **Secure auth** — Email/password and Google OAuth, backed by HttpOnly cookies
- 📺 **Video support** — YouTube (standard, shorts, youtu.be), MP4, WebM, OGG
- 📝 **Notepad** — Rich text notes saved per video URL
- 🎨 **Whiteboard** — Freehand canvas with color picker, brush size, undo/redo, and PNG export
- 🔒 **Role-based access** — Only the session owner can edit; others view in read-only mode
- 🔍 **User search** — Find and view other users' public sessions
- 🌗 **Dark / light mode** — Full Chakra UI theme switching
- 📱 **Responsive layout** — Works on desktop and tablet

---

## 🛠️ Tech Stack

### Frontend (`client/`)

| Tool | Purpose |
|---|---|
| React 19 + Vite | UI framework & build tool |
| Chakra UI v2 | Component library & theming |
| Tailwind CSS | Utility classes for layout |
| React Router DOM v7 | Client-side routing |
| `@react-oauth/google` | Google OAuth 2.0 |
| Axios | HTTP client with `withCredentials` for cookie auth |
| Framer Motion | Animations |

### Backend (`server/`)

| Tool | Purpose |
|---|---|
| Python 3.12+ | Language |
| FastAPI | REST API framework |
| Uvicorn | ASGI server |
| MongoDB + PyMongo | Database |
| PyJWT | JWT token signing & verification |
| httpx | Async HTTP client for Google token verification |
| Passlib + bcrypt | Password hashing |
| Pydantic v2 | Request/response validation |
| `uv` | Fast Python package manager |

---

## 🔐 Auth Architecture

MindTube uses a **dual-layer auth** approach:

- **JWT token** is generated on the server and set as an `HttpOnly` cookie — never exposed to JavaScript
- **Cookie config is environment-aware** — `Secure=True, SameSite=None` in production; `Secure=False, SameSite=Lax` in development, so local dev works over plain HTTP
- **Google OAuth** tokens are verified server-side by calling Google's userinfo endpoint — the client only passes an `access_token`; the server independently fetches identity from Google
- **Non-sensitive user display data** (name, email, avatar) is cached in `localStorage` for fast UI rendering — the auth token itself never touches `localStorage`
- All protected routes use `Depends(get_current_user)` which reads only from the cookie

---

## 📁 Project Structure

```
Canvas/
├── docker-compose.yml
├── client/                    # React + Vite frontend
│   ├── Dockerfile
│   ├── .env.example
│   └── src/
│       ├── api/               # Axios instance (withCredentials)
│       ├── assets/            # Images and icons
│       └── components/
│           ├── Home/          # Home, Login, Signup pages
│           ├── Misc/          # SideDrawer, SearchUser, Profile, ColorToggle
│           ├── Notepad/       # Notepad component
│           └── Whiteboard/    # Canvas whiteboard + tools
└── server/                    # FastAPI backend
    ├── Dockerfile
    ├── .env.example
    └── app/
        ├── controllers/       # Business logic
        ├── core/              # Config, DB, security, dependencies, google_auth
        ├── middleware/        # Global error handlers
        ├── routers/           # Route definitions
        └── schemas/           # Pydantic request/response models
```

---

## 🚀 Getting Started

Choose one of three ways to run the project locally:

### Option A — Docker (recommended)

Make sure you have [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed.

```bash
git clone https://github.com/raktimava29/Canvas.git
cd Canvas
git checkout sock
```

Create your env files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Fill in `server/.env` and `client/.env` (see [Environment Variables](#-environment-variables) below).

> ⚠️ **Docker note:** When running via Docker Compose, the frontend and backend run as separate containers. Set `VITE_API_URL=http://localhost:8000` in `client/.env` — Docker Compose exposes the backend on port 8000 of your host machine.

```bash
docker compose up --build
```

The app will be at `http://localhost:5173` and the API at `http://localhost:8000`.

---

### Option B — Manual setup

#### Prerequisites

- Node.js 18+
- Python 3.12+
- MongoDB (local or [Atlas](https://www.mongodb.com/cloud/atlas))
- A Google OAuth Client ID ([create one here](https://console.cloud.google.com/))

#### 1. Clone the repo

```bash
git clone https://github.com/raktimava29/Canvas.git
cd Canvas
git checkout sock
```

#### 2. Backend setup

```bash
cd server

# Install uv if you don't have it
pip install uv

# Install dependencies
uv sync

# Copy and fill in your environment variables
cp .env.example .env
```

Start the server:

```bash
uv run uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

#### 3. Frontend setup

```bash
cd client

npm install

# Copy and fill in your environment variables
cp .env.example .env
```

Start the dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔧 Environment Variables

### `server/.env`

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_minimum_64_chars
DB_NAME=your_database_name
ENVIRONMENT=development
ALLOWED_ORIGINS=http://localhost:5173
```

> In production set `ENVIRONMENT=production` and update `ALLOWED_ORIGINS` to your deployed frontend URL (comma-separated for multiple origins).

### `client/.env`

```env
VITE_API_URL=http://localhost:8000
VITE_GOOGLE_CLIENT_ID=your_google_oauth_client_id
```

---

## 🔌 API Endpoints

### Auth (`/api/user`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/user` | ❌ | Register with email & password — sets HttpOnly cookie |
| POST | `/api/user/login` | ❌ | Login with email & password — sets HttpOnly cookie |
| POST | `/api/user/google-signup` | ❌ | Register via Google OAuth — server-verified |
| POST | `/api/user/google-login` | ❌ | Login via Google OAuth — server-verified |
| POST | `/api/user/logout` | ❌ | Clears the auth cookie |
| GET | `/api/user/me` | ✅ | Returns the currently authenticated user |
| GET | `/api/user` | ✅ | Search users by name |
| GET | `/api/user/{user_id}` | ✅ | Get user by ID |

### Content (`/api/content`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/content/save` | ✅ | Save or update notepad + whiteboard for a video URL |
| GET | `/api/content` | ✅ | Fetch content by video URL |

---

## 🖥️ Screenshots

### Profile
![Profile](./client/src/assets/two.png)

### Editable Session
![Editable Content](./client/src/assets/one.png)

### Read-Only View
![Read Only](./client/src/assets/three.png)
![Read Only](./client/src/assets/four.png)

---

© 2026 MindTube. All rights reserved.