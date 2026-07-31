
import app from "./app.js"
import { config } from "./config/env.js"
import prisma from "./database/prisma.js"
import redis from "./database/redis.js";
import { startCleanupJob } from "./utils/cleanup.js";
import { logger } from "./utils/logger.js";

const start = async () => {
    try{
        await prisma.$connect()
        logger.info("Database connected")

        await redis.ping()
        logger.info("Redis connected")

        startCleanupJob() // Run immediately on startup

        const server = app.listen(config.app.port, () => {
            logger.info(`Server on port ${config.app.port} [${config.app.env}]`)
        })

        const shutdown = async (signal: string) => {
            logger.info(`${signal} - shutting down gracefully`)
            server.close(async () => {
                await prisma.$disconnect()
                await redis.quit()
                process.exit(0)
            })
        }

        process.on("SIGTERM", () => shutdown("SIGTERM"))
        process.on("SIGINT", () => shutdown("SIGINT"))
    }catch(err){
        logger.error("Start up failed:", err)
        await prisma.$disconnect()
        process.exit(1)
    }
}

start()