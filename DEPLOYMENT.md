# Readit - Deployment Guide

## Overview

Readit is a Reddit-like application built with:

- **Frontend**: React + TypeScript + Material UI + Vite
- **Backend**: Deno + Hono + MongoDB
- **Authentication**: Username/Password + GitHub OAuth

## Prerequisites

### Local Development

- Node.js 20+ (for frontend)
- Deno 2.0+ (for backend)
- MongoDB 5.0+ (local or cloud)
- Git

### Deployment (Render)

- GitHub account
- Render account (free tier available)
- MongoDB Atlas account (free tier available)

## Local Development Setup

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd readit-Nandinidasari63
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies (Deno handles this automatically)
deno cache deno.json

# Create/update .env file with:
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback
MONGODB_URI=mongodb://localhost:27017  # or your MongoDB connection string
FRONTEND_URL=http://localhost:5173

# Start development server
deno task dev
```

Backend runs on: `http://localhost:8000`

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on: `http://localhost:5173`

## GitHub OAuth Setup (Required for Phase 7)

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create a new OAuth App with:
   - **Application name**: Readit
   - **Homepage URL**: `http://localhost:5173` (local) or your deployed URL
   - **Authorization callback URL**:
     `http://localhost:8000/auth/github/callback` (local) or
     `https://your-backend.onrender.com/auth/github/callback` (production)
3. Copy Client ID and Client Secret to `.env`

## Database Setup

### Option 1: Local MongoDB

```bash
# macOS with Homebrew
brew install mongodb-community
brew services start mongodb-community

# Start MongoDB shell
mongosh
```

### Option 2: MongoDB Atlas (Cloud)

1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/readit
   ```

## Deployment on Render

### Step 1: Prepare GitHub Repository

```bash
# Add render.yaml to root (already done)
# Push to GitHub
git add .
git commit -m "Add deployment configuration"
git push origin main
```

### Step 2: Create MongoDB Atlas Database

1. Go to MongoDB Atlas
2. Create free cluster
3. Create database user and whitelist IP
4. Get connection string

### Step 3: Deploy on Render

1. Go to https://render.com
2. Connect GitHub account
3. Create new Web Service
4. Select your repository
5. Configure:
   - **Name**: readit-backend
   - **Runtime**: Deno
   - **Build Command**: `echo "Backend ready"`
   - **Start Command**: `deno run --allow-net --allow-env main.ts`
6. Add environment variables:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `GITHUB_REDIRECT_URI=https://readit-backend.onrender.com/auth/github/callback`
   - `MONGODB_URI=your_mongodb_connection_string`
   - `FRONTEND_URL=https://readit-frontend.onrender.com`

7. Create Frontend Web Service:
   - **Name**: readit-frontend
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview`
   - **Root Directory**: `frontend`

8. Add environment variables:
   - `VITE_API_URL=https://readit-backend.onrender.com`

### Step 4: Update GitHub OAuth Callback

Update your GitHub OAuth App settings:

- Set Authorization callback URL to:
  `https://readit-backend.onrender.com/auth/github/callback`

## Project Structure

```
readit-Nandinidasari63/
├── backend/                 # Deno/Hono backend
│   ├── main.ts             # Entry point
│   ├── app.ts              # Route handlers
│   ├── deno.json           # Dependencies
│   ├── db/                 # Database
│   │   └── client.ts       # MongoDB connection
│   └── services/           # Business logic
│       ├── auth_service.ts
│       ├── user_service.ts
│       ├── post_service.ts
│       ├── feed_service.ts
│       ├── like_service.ts
│       └── subscription_service.ts
├── frontend/               # React/Vite frontend
│   ├── src/
│   │   ├── main.tsx        # Entry point
│   │   ├── App.tsx         # Main app component
│   │   ├── api.tsx         # API calls
│   │   ├── reducer.tsx     # State management
│   │   ├── actions.tsx     # Action handlers
│   │   └── components/
│   │       ├── Auth.tsx    # Auth flow
│   │       ├── Post.tsx    # Posts
│   │       └── Users.tsx   # User search/subscribe
│   └── package.json
└── render.yaml             # Render deployment config
```

## API Endpoints

### Authentication

- `POST /signup` - Create new user
- `POST /login` - Login with username/password
- `POST /logout` - Logout
- `GET /me` - Get current user
- `GET /auth/github/login` - GitHub OAuth login
- `GET /auth/github/callback` - GitHub OAuth callback

### Posts

- `GET /posts` - Get user's feed
- `POST /add` - Create post
- `POST /delete` - Delete post

### Users

- `GET /users` - Get all users

### Subscriptions

- `POST /subscribe` - Subscribe to user
- `POST /unsubscribe` - Unsubscribe from user

### Likes

- `POST /like` - Like a post
- `POST /unlike` - Unlike a post

## Features Implemented

✅ **Phase 1**: Create, Read, Delete posts (frontend) ✅ **Phase 2**: Backend
integration with fetch on render ✅ **Phase 3**: MongoDB persistence ✅ **Phase
4**: Authentication (username/password) ✅ **Phase 5**: Search and subscribe to
users ✅ **Phase 6**: Like posts ✅ **Phase 7**: GitHub OAuth ✅ **Phase 8**:
Render deployment configuration

## Future Enhancements

- [ ] Progressive loading (posts load as you scroll)
- [ ] Real-time updates (WebSockets/SSE)
- [ ] Redis caching
- [ ] JWT tokens instead of session cookies
- [ ] Image uploads
- [ ] Comment threads
- [ ] Notifications

## Troubleshooting

### MongoDB Connection Error

- Ensure MongoDB is running locally: `brew services start mongodb-community`
- Or check MongoDB Atlas connection string is correct

### CORS Errors

- Check `FRONTEND_URL` environment variable matches frontend origin
- Ensure credentials are set to `include` in fetch calls

### GitHub OAuth Redirect Issues

- Verify redirect URI in GitHub OAuth App matches `GITHUB_REDIRECT_URI`
- Check `FRONTEND_URL` for production deployment

## Environment Variables Summary

### Backend (.env)

```
GITHUB_CLIENT_ID=your_id
GITHUB_CLIENT_SECRET=your_secret
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback
MONGODB_URI=mongodb://localhost:27017
FRONTEND_URL=http://localhost:5173
```

### Frontend (Vite auto-loads)

```
VITE_API_URL=http://localhost:8000
```

## Testing Locally

1. Start MongoDB: `brew services start mongodb-community`
2. Start backend: `cd backend && deno task dev`
3. Start frontend: `cd frontend && npm run dev`
4. Visit: http://localhost:5173
5. Sign up with test account or GitHub OAuth

## Production Monitoring

On Render:

- Check service logs for errors
- Monitor MongoDB Atlas metrics
- Set up error alerting in Render dashboard

## Support

For issues or questions, check:

- Render documentation: https://render.com/docs
- MongoDB Atlas docs: https://docs.atlas.mongodb.com
- Deno docs: https://docs.deno.com
