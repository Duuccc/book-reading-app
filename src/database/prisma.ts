// import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client.js"
import { logger } from "../utils/logger.js"

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ 
    adapter,
    log: [
        { emit: "event", level: "query" },
        { emit: "event", level: "error" },
    ] 
})

if (process.env.NODE_ENV === 'development') {
    prisma.$on('query', (e) => {
        if(e.duration > 200){
            logger.warn(`slow query (${e.duration}ms): ${e.query}`);
            
        }
    })
}

export default prisma