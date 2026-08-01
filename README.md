# 📚 Book Reading App — Backend API

A RESTful API for an online book reading platform built with Node.js, TypeScript, Express, and PostgreSQL.

## 🛠 Tech Stack

| | |
|---|---|
| **Runtime** | Node.js >= 18 |
| **Language** | TypeScript |
| **Framework** | Express.js |
| **ORM** | Prisma |
| **Database** | PostgreSQL |
| **Cache** | Redis |
| **Authentication** | JWT (Access Token + Refresh Token Rotation) |
| **Validation** | express-validator |
| **Logging** | Winston |

## ✨ Features

- 🔐 **Authentication** — Register, Login, Logout, Refresh Token Rotation
- 📚 **Books & Chapters** — CRUD, slug URL, chapter pagination
- 🔖 **Bookmark** — Bookmark books and specific chapters
- 📊 **Reading Progress** — Auto-save reading position
- ⭐ **Rating & Review** — 1-5 star rating with review text
- 🔍 **Search** — Full-text search by title, author, genre + autocomplete
- 💡 **Recommendations** — Trending, Similar, Personalized
- 🔔 **Follow & Notifications** — Follow books, get notified on new chapters
- ⚡ **Redis Caching** — Cache frequently accessed data
- 🛡 **Security** — Rate limiting, Helmet, CORS, bcrypt

## 📁 Project Structure

```
src/
├── config/
│   └── env.ts                    # Environment config + validation
├── database/
│   ├── prisma.ts                 # Prisma client singleton
│   └── redis.ts                  # Redis client
├── middlewares/
│   ├── auth.middleware.ts        # JWT authentication & authorization
│   ├── error.middleware.ts       # Global error handler
│   └── rateLimiter.middleware.ts # Rate limiting
├── modules/
│   ├── auth/                     # Register, Login, Logout, Refresh
│   ├── book/                     # Book CRUD
│   ├── chapter/                  # Chapter CRUD + Reading
│   ├── bookmark/                 # Bookmark toggle
│   ├── progress/                 # Reading progress
│   ├── review/                   # Rating & Review
│   ├── search/                   # Search + Autocomplete
│   ├── recommendation/           # Trending, Similar, Personalized
│   └── notification/             # Follow & Notifications
├── types/
│   └── express.d.ts              # Express Request type extension
├── utils/
│   ├── ApiError.ts
│   ├── ApiResponse.ts
│   ├── cache.ts                  # Redis cache helper
│   ├── cleanup.ts                # Expired token cleanup job
│   ├── jwt.util.ts
│   ├── logger.ts
│   └── slug.ts
├── app.ts
└── server.ts
prisma/
├── schema.prisma                 # Database schema (11 models)
├── migrations/                   # Auto-generated migrations
└── seed.ts                       # Dummy data
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL >= 14
- Redis
- npm >= 9

### Installation

**1. Clone repository**
```bash
git clone https://github.com/your-username/book-reading-app.git
cd book-reading-app
```

**2. Install dependencies**
```bash
npm install
```

**3. Setup environment**
```bash
cp .env.example .env
# Fill in your values
```

**4. Setup database**
```bash
npx prisma migrate dev
npx prisma generate
```

**5. Seed dummy data**
```bash
npm run db:seed
```

**6. Start server**
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Server runs at: `http://localhost:3000`

## ⚙️ Environment Variables

```bash
NODE_ENV=development
PORT=3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/book-reading-app"
REDIS_URL=redis://localhost:6379
JWT_ACCESS_SECRET=your-secret-key-minimum-32-characters
JWT_REFRESH_SECRET=your-refresh-secret-minimum-32-characters
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

## 📜 Available Scripts

```bash
npm run dev          # Development server (hot reload)
npm run build        # Build TypeScript
npm start            # Production server
npm run db:migrate   # Run migrations
npm run db:generate  # Generate Prisma Client
npm run db:studio    # Open Prisma Studio GUI
npm run db:seed      # Seed dummy data
```

## 🧪 Test Accounts

After running `npm run db:seed`:

| Email | Password | Role |
|---|---|---|
| admin@bookapp.com | Test@1234 | ADMIN |
| author1@bookapp.com | Test@1234 | AUTHOR |
| author2@bookapp.com | Test@1234 | AUTHOR |
| reader1@bookapp.com | Test@1234 | READER |
| reader2@bookapp.com | Test@1234 | READER |

## 📡 API Endpoints

Base URL: `http://localhost:3000/api`

> 🔒 = Requires `Authorization: Bearer <access_token>` header

### Auth
```
POST   /auth/register          Register new account
POST   /auth/login             Login
POST   /auth/refresh           Refresh access token
POST   /auth/logout            Logout current device
POST   /auth/logout-all   🔒   Logout all devices
```

### Books
```
GET    /books                  List books (filter, search, paginate)
GET    /books/:slug            Book detail
POST   /books             🔒   Create book        [AUTHOR/ADMIN]
PATCH  /books/:id         🔒   Update book        [AUTHOR/ADMIN]
DELETE /books/:id         🔒   Delete book        [AUTHOR/ADMIN]
```

### Chapters
```
GET    /books/:bookId/chapters               List chapters
GET    /books/:bookId/chapters/:n/read       Read chapter (paginated content)
POST   /books/:bookId/chapters          🔒   Create chapter  [AUTHOR/ADMIN]
PATCH  /books/:bookId/chapters/:id      🔒   Update chapter  [AUTHOR/ADMIN]
DELETE /books/:bookId/chapters/:id      🔒   Delete chapter  [AUTHOR/ADMIN]
```

### Bookmarks 🔒
```
POST   /bookmarks              Toggle bookmark (add/remove)
GET    /bookmarks              My bookmarks
GET    /bookmarks/check        Check bookmark status
```

### Reading Progress 🔒
```
POST   /progress               Update reading position
GET    /progress               All books in progress
GET    /progress/:bookId       Progress for specific book
DELETE /progress/:bookId       Reset progress
```

### Reviews
```
GET    /books/:bookId/reviews             List reviews + stats (public)
POST   /books/:bookId/reviews        🔒   Write review
GET    /books/:bookId/reviews/my-review 🔒 My review
PATCH  /books/:bookId/reviews/:id    🔒   Update review
DELETE /books/:bookId/reviews/:id    🔒   Delete review
```

### Search & Recommendations
```
GET    /search                         Search books
GET    /search/autocomplete            Autocomplete suggestions
GET    /recommendations/trending       Trending books
GET    /recommendations/similar/:bookId Similar books
GET    /recommendations/for-you   🔒   Personalized recommendations
```

### Follow & Notifications 🔒
```
POST   /notifications/follows/:bookId       Toggle follow
GET    /notifications/follows/:bookId/check Check follow status
GET    /notifications/follows               Followed books
GET    /notifications                       Notifications list
PATCH  /notifications/:id/read              Mark as read
PATCH  /notifications/read-all              Mark all as read
DELETE /notifications/:id                   Delete notification
```

## 📦 Response Format

**Success:**
```json
{
  "success": true,
  "message": "Success",
  "data": {}
}
```

**Paginated:**
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

**Error:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": []
}
```

## 🐳 Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Build image only
docker build -t book-reading-app .
```

## 🏥 Health Check

```
GET /health
```
```json
{
  "status": "ok",
  "env": "development",
  "timestamp": "2024-01-15T08:00:00.000Z"
}
```

## 🔒 Security

- JWT Access Token (15 min) + Refresh Token Rotation (7 days)
- Password hashing with bcrypt (cost factor 12)
- Rate limiting: 100 req/min global, 10 req/15min for auth routes
- Helmet for HTTP security headers
- CORS with whitelist
- Input validation with express-validator
- Timing attack prevention on login

## 📊 Database Schema

11 models: `User`, `Book`, `Chapter`, `Genre`, `BookGenre`, `RefreshToken`, `Bookmark`, `ReadingProgress`, `Review`, `Follow`, `Notification`

View with Prisma Studio:
```bash
npm run db:studio
# Opens at http://localhost:5555
```
