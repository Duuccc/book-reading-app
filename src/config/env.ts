import "dotenv/config"
import { access } from "node:fs"

const requireEnv = (key: string): string => {
    const value = process.env[key]
    if(!value) throw new Error(`Missing required environment variable: ${key}`)
    return value
}

export const config = {
    app : {
        port: parseInt(process.env.PORT ?? '3000'),
        env: process.env.NODE_ENV ?? 'development',
        allowedOrigins: process.env.ALLOWED_ORIGINS?.split(",") ?? [],
        isDev: process.env.NODE_ENV === "development",
    },
    jwt: {
        accessSecret: requireEnv("JWT_ACCESS_SECRET"),
        refreshSecret: requireEnv("JWT_REFRESH_SECRET"),
        accessExpiry: "15m" as const,
        refreshExpiry: "7d" as const,
        refreshExpiryMs: 7*24*60*60*1000,
    }
} as const