import prisma from "../database/prisma.js"
import { logger } from "./logger.js"

export const cleanupExpiredTokens = async () => {
    try {
        const result = await prisma.refreshToken.deleteMany({
            where: { expiresAt: { lt: new Date() }}
        })
        if(result.count > 0) {
            logger.info("Cleanup: Deleted " + result.count + " expired refresh tokens")
        }
    } catch (error) {
        logger.error("Cleanup: Error occurred while deleting expired refresh tokens", error)
    }
}

export const startCleanupJob = () => {
    cleanupExpiredTokens() // Run immediately on startup

    setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000) // Run every hour
    logger.info("Cleanup job started")
}