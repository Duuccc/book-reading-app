import express from "express"
import helmet from "helmet"
import cors from "cors"
import morgan from "morgan"
import { config } from "./config/env.js"
import { authRouter } from "./modules/auth/auth.route.js"
import { errorMiddleware } from "./middlewares/error.middleware.js" 
import { authRateLimiter, globalRateLimiter } from "./middlewares/rateLimiter.middleware.js"
import { error, timeStamp } from "node:console"
import { bookRouter } from "./modules/book/book.route.js"
import { chapterRouter } from "./modules/chapter/chapter.route.js"
import { bookmarkRouter } from './modules/bookmark/bookmark.route.js';
import { progressRouter } from './modules/progress/progress.route.js';
import { reviewRouter }   from './modules/review/review.route.js';
import { searchRouter } from "./modules/search/search.route.js"
import { recommendationRouter } from "./modules/recommendation/recommendation.route.js"
import { notificationRouter } from "./modules/notification/notification.route.js"

const app = express()

app.use(helmet())
app.use(
    cors({
        origin: config.app.allowedOrigins,
        credentials: true
    })
)

app.use(express.json())

app.use(morgan(config.app.isDev ? "dev" : "combined"))
app.use(globalRateLimiter)

app.use("/api/auth", authRateLimiter, authRouter)
app.use("/api/books", bookRouter)
app.use("/api/books/:bookId/chapters", chapterRouter)

app.use("/api/bookmarks",  bookmarkRouter)
app.use("/api/progress", progressRouter)
app.use("/api/books/:bookId/reviews", reviewRouter)
app.use("/api/search", searchRouter)
app.use("/api/recommendations", recommendationRouter)
app.use("/api/notifications", notificationRouter)

app.get("/health", (_, res) => res.json({
    status: "ok",
    env: config.app.env,
    timestamp: new Date().toISOString()
}))

app.use(errorMiddleware)

export default app