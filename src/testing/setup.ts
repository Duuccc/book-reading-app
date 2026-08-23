import { afterAll, beforeAll } from "vitest"
import redis from "../database/redis.js"
import prisma from "../database/prisma.js"

beforeAll(async () => {
    if(process.env.NODE_ENV !== "test"){
        throw new Error("Test must be running with NODE_ENV=\"test\"")
    }
    await prisma.$connect()
})

afterAll(async () => {
    await prisma.refreshToken.deleteMany()
    await prisma.user.deleteMany({
        where: { email: { contains: "test" } }
    })
    await redis.quit()
    await prisma.$disconnect()
})