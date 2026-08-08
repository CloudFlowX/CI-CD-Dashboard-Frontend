# Cloud Orchestrator - Backend API

This is the backend API for the **Cloud Orchestrator** platform, providing comprehensive CI/CD pipeline management, repository tracking, user authentication, and integrations with external tools like GitHub Actions.

## 🚀 Tech Stack

- **Node.js & Express.js** - Web framework for handling API routes
- **MongoDB & Mongoose** - NoSQL Database and object modeling for storing users, repositories, and pipelines
- **JSON Web Tokens (JWT)** - Secure, stateless user authentication
- **Bcrypt.js** - Password hashing and security
- **Cors & Helmet** - API security and cross-origin resource sharing
- **Morgan** - HTTP request logging
- **Dotenv** - Environment variable management
- **Express Validator** - Request payload validation

*(Additional integrations prepared for scaling: `bullmq`, `ioredis`, `socket.io`, `simple-git`)*

## 📂 Project Structure

```text
CI-CD-backend/
├── src/
│   ├── config/         # Database and third-party configuration (e.g., db.js)
│   ├── controllers/    # Business logic for API endpoints
│   │   ├── auth.controller.js
│   │   ├── github.controller.js
│   │   ├── pipeline.controller.js
│   │   └── repository.controller.js
│   ├── middleware/     # Custom Express middlewares (auth, roles, error handling)
│   ├── models/         # Mongoose Database Schemas
│   │   ├── Pipeline.js
│   │   ├── Repository.js
│   │   └── User.js
│   ├── routes/         # Express Router definitions mapped to controllers
│   │   ├── auth.routes.js
│   │   ├── github.routes.js
│   │   ├── pipeline.routes.js
│   │   └── repository.routes.js
│   ├── app.js          # Express application setup, global middlewares, and route injection
│   └── server.js       # Node.js server initialization and DB connection
├── package.json        # Project metadata and dependencies
└── .env                # Environment variables (Port, Mongo URI, JWT Secret)
```

## 🔌 API Endpoints

All endpoints are prefixed with `/api/v1`.

### Authentication (`/api/v1/auth`)
- `POST /register` - Register a new user (Admin, Developer, Viewer)
- `POST /login` - Authenticate user and return JWT
- `GET /me` - Get current authenticated user details
- `POST /logout` - Clear authentication token

### Repositories (`/api/v1/repositories`)
- `GET /` - List all tracked repositories
- `POST /` - Register a new repository (Admin/Developer only)
- `GET /:id` - Get repository details
- `PUT /:id` - Update repository configuration
- `DELETE /:id` - Remove a repository (Admin only)

### Pipelines (`/api/v1/pipelines`)
- `GET /` - List all CI/CD pipeline runs and statuses
- `POST /` - Trigger a new pipeline run
- `GET /:id` - Get specific pipeline status and stages
- `POST /:id/trigger` - Rerun an existing pipeline
- `DELETE /:id` - Delete pipeline execution record

### GitHub Actions Integration (`/api/v1/github`)
- `GET /runs` - Fetch recent GitHub Actions workflow runs
- `POST /trigger` - Dispatch a GitHub Actions workflow manually

## 🛡️ Security & Middlewares

1. **`protect` Middleware**: Verifies the JWT provided in the `Authorization` header (`Bearer <token>`). Rejects requests lacking a valid token.
2. **`authorize(...roles)` Middleware**: Ensures the authenticated user possesses the correct role (e.g., `admin`, `developer`, `viewer`) to access a specific route.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string (Local or MongoDB Atlas)

### Setup Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Create a `.env` file in the root directory:
   ```env
   PORT=5002
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/cloud_orchestrator
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=30d
   NODE_ENV=development
   ```

3. **Run the Server (Development):**
   ```bash
   npm run dev
   ```
   *The server uses `nodemon` and will auto-restart on file changes.*

4. **Run the Server (Production):**
   ```bash
   npm start
   ```

## 📈 Recent Updates
- ✅ **MongoDB Integration:** Successfully configured robust database connections resolving previous timeout issues.
- ✅ **Pipeline Data API:** Implemented full mock-to-real backend fetching, generating structured pipeline histories for frontend analytics.
- ✅ **GitHub Actions API:** Added proxy routes to securely mock, fetch, and trigger GitHub Actions without exposing secrets directly to the frontend.
