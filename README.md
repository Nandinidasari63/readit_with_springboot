# 📖 Readit - Reddit Clone

A modern Reddit clone built with React, TypeScript, Deno, and MongoDB. Features
user authentication, post creation/deletion, subscriptions, and likes.

## ✨ Features

- **✅ Create & Delete Posts** - Share your thoughts with the community
- **✅ User Feed** - See posts from users you subscribe to
- **✅ User Search & Subscribe** - Discover and follow other users
- **✅ Like Posts** - Show appreciation for quality content
- **✅ Authentication** - Secure login with username/password or GitHub OAuth
- **✅ MongoDB Persistence** - All data safely stored in MongoDB
- **✅ Material UI** - Beautiful, responsive user interface
- **✅ Production Ready** - Deployable on Render with auto-deployment from
  GitHub

## 🏗️ Architecture

### Technology Stack

**Frontend:**

- React 19 + TypeScript
- Vite (fast build tool)
- Material UI (component library)
- date-fns (date formatting)
- Redux pattern for state management

**Backend:**

- Deno 2 (secure JavaScript/TypeScript runtime)
- Hono (lightweight web framework)
- MongoDB (document database)
- JWT-compatible session management

**Deployment:**

- Render (hosting platform)
- MongoDB Atlas (cloud database)
- GitHub OAuth (social login)

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (for frontend)
- Deno 2.0+ (for backend)
- MongoDB 5.0+ (local or cloud)
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd readit-Nandinidasari63
   ```

2. **Setup Backend**
   ```bash
   cd backend
   deno cache deno.json

   # Create .env file
   cat > .env << EOF
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback
   MONGODB_URI=mongodb://localhost:27017
   FRONTEND_URL=http://localhost:5173
   EOF

   # Start backend
   deno task dev
   ```
   Backend runs on: `http://localhost:8000`

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```
   Frontend runs on: `http://localhost:5173`

4. **Access the app**
   - Open `http://localhost:5173` in your browser
   - Create an account or login with GitHub

## 📦 Project Structure

```
readit-Nandinidasari63/
├── backend/
│   ├── main.ts                    # Entry point
│   ├── app.ts                     # Route handlers
│   ├── deno.json                  # Deno dependencies
│   ├── .env                       # Environment variables
│   ├── db/
│   │   └── client.ts              # MongoDB setup
│   └── services/
│       ├── auth_service.ts        # Auth logic
│       ├── user_service.ts        # User operations
│       ├── post_service.ts        # Post operations
│       ├── feed_service.ts        # Feed aggregation
│       ├── like_service.ts        # Like functionality
│       └── subscription_service.ts # Subscription logic
├── frontend/
│   ├── src/
│   │   ├── main.tsx               # React entry point
│   │   ├── App.tsx                # Main app component
│   │   ├── api.tsx                # API client
│   │   ├── reducer.tsx            # State reducer
│   │   ├── actions.tsx            # Action handlers
│   │   └── components/
│   │       ├── Auth.tsx           # Authentication UI
│   │       ├── Post.tsx           # Post components
│   │       └── Users.tsx          # User search
│   ├── package.json
│   └── tsconfig.json
├── render.yaml                    # Render deployment config
├── DEPLOYMENT.md                  # Deployment guide
└── README.md
```

## 🔐 Authentication

### Local Setup

1. Sign up with username and password, or
2. Click "Login with GitHub" button

### GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App:
   - **Application name**: Readit
   - **Homepage URL**: `http://localhost:5173` (local) or your deployed URL
   - **Authorization callback URL**:
     `http://localhost:8000/auth/github/callback`
3. Copy Client ID and Secret to `.env`

## 📡 API Endpoints

### Auth

- `POST /signup` - Create new user (body: `{username, password}`)
- `POST /login` - Login (body: `{username, password}`)
- `POST /logout` - Logout
- `GET /me` - Get current user info
- `GET /auth/github/login` - GitHub OAuth login
- `GET /auth/github/callback` - GitHub OAuth callback

### Feed

- `GET /posts` - Get user's feed (posts from self and subscriptions)
- `POST /add` - Create post (body: `{title, body}`)
- `POST /delete` - Delete post (body: `{id, userId}`)

### Users

- `GET /users` - Get all users

### Subscriptions

- `POST /subscribe` - Subscribe to user (body: `{targetUserId}`)
- `POST /unsubscribe` - Unsubscribe (body: `{targetUserId}`)

### Likes

- `POST /like` - Like post (body: `{postId}`)
- `POST /unlike` - Unlike post (body: `{postId}`)

## 🗄️ Database Schema

### Users Collection

```typescript
{
  _id: ObjectId,
  name: string,           // Username
  githubId?: number,      // GitHub ID if OAuth login
  passwordHash?: string,  // Hashed password if local login
  createdAt?: Date
}
```

### Posts Collection

```typescript
{
  _id: ObjectId,
  title: string | null,
  body: string | null,
  time: string,           // ISO timestamp
  userId: string,         // Post author ID
  name: string            // Author username
}
```

### Subscriptions Collection

```typescript
{
  _id: ObjectId,
  userId: string,         // Follower ID
  targetUserId: string    // Following ID
}
```

### Likes Collection

```typescript
{
  _id: ObjectId,
  userId: string,
  postId: string
}
```

## 🚀 Deployment on Render

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy

1. Push code to GitHub
2. Go to https://render.com
3. Connect GitHub and select your repository
4. Set environment variables (GitHub OAuth, MongoDB URI)
5. Deploy backend and frontend services

## 📝 Environment Variables

### Backend (.env)

```
GITHUB_CLIENT_ID=your_client_id
GITHUB_CLIENT_SECRET=your_client_secret
GITHUB_REDIRECT_URI=http://localhost:8000/auth/github/callback
MONGODB_URI=mongodb://localhost:27017  # or MongoDB Atlas URI
FRONTEND_URL=http://localhost:5173     # For CORS and redirects
```

### Frontend (Vite auto-loads)

```
VITE_API_URL=http://localhost:8000     # Backend URL
```

## 🧪 Testing

### Test Locally

1. Start MongoDB: `brew services start mongodb-community` (macOS)
2. Start backend: `cd backend && deno task dev`
3. Start frontend: `cd frontend && npm run dev`
4. Open http://localhost:5173
5. Sign up and test features

### Test Accounts

Create as many test accounts as needed with usernames like:

- alice
- bob
- charlie
- testuser

## 📚 Development Workflow

### Adding Features

1. Create backend endpoint in `app.ts`
2. Add corresponding service method
3. Create frontend API call in `api.tsx`
4. Add action handler in `actions.tsx`
5. Create or update React components
6. Test locally

### Code Structure

- **Services**: Business logic and database operations
- **Components**: UI and user interaction
- **Actions**: Async operations and state updates
- **Reducer**: State management

## 🔗 Useful Links

- [Render Documentation](https://render.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Deno Documentation](https://docs.deno.com)
- [React Documentation](https://react.dev)
- [Material UI](https://mui.com)

## 🐛 Troubleshooting

### MongoDB Connection Error

```bash
# Start local MongoDB (macOS)
brew services start mongodb-community
```

### Port Already in Use

```bash
# Change backend port
# Edit main.ts: Deno.serve({ port: 8001 }, app.fetch)

# Change frontend port
# Edit vite.config.ts: server: { port: 5174 }
```

### CORS Errors

- Check `FRONTEND_URL` matches frontend origin
- Verify credentials mode is `include` in fetch calls
- Check browser console for specific errors

### GitHub OAuth Not Working

- Verify callback URL matches GitHub OAuth App settings
- Check Client ID and Secret in `.env`
- Ensure redirect URLs match (no trailing slashes)

## 📄 License

MIT License - feel free to use this project for learning and personal projects.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues, questions, or suggestions:

1. Check existing issues on GitHub
2. Create a new issue with details
3. Include environment and error messages

---

**Happy Posting! 📝**

Built with ❤️ using React, Deno, and MongoDB
