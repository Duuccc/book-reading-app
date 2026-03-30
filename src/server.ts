import "dotenv/config"
import app from "./app.js"
import { config } from "./config/env.js"
import prisma from "./database/prisma.js"
import { logger } from "./utils/logger.js";

const start = async () => {
    try{
        await prisma.$connect()
        logger.info("Database connected")

        const server = app.listen(config.app.port, () => {
            logger.info(`Server on port ${config.app.port} [${config.app.env}]`)
        })

        const shutdown = async (signal: string) => {
            logger.info(`${signal} - shutting down gracefully`)
            server.close(async () => {
                await prisma.$disconnect()
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