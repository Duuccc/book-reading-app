import { Redis } from "ioredis"
import { logger } from "../utils/logger.js"

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    retryStrategy: (times: any) => {
        if(times > 3) {
            logger.error("Redis connection failed after 3 attempts")
            return null
        }
        return Math.min(times * 200, 1000)
    }
})

redis.on("connect", () => {
    logger.info("Connected to Redis")
})

redis.on("error", (err: any) => {
    logger.error("Redis error:", err)
})

export default redis