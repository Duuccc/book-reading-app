import redis from "../database/redis.js"
import { logger } from "./logger.js"

export const TTL = {
    SHORT: 60,
    MEDIUM: 60 * 10,
    LONG: 60 * 60,
    DAY: 60 * 60 * 24
} as const

export const CacheKey = {
    bookList: (page: number, limit: number, filters: string) => `books:list:${page}:${limit}:${filters}`,
    bookDetails(slug: string) {
        return `books:detail:${slug}`
    },
    bookChapters: (bookId: string, page: number) => `books:${bookId}:chapters:${page}`,
    bookReviews: (bookId: string, page: number, sort: string) => `books:${bookId}:reviews:${page}:${sort}`,

    search: (query: string) => `search:${Buffer.from(query).toString("base64")}`,
    trending: () => "recommendations:trending",
    similar: (bookId: string) => `recommendations:similar:${bookId}`,
    forYou: (userId: string) => `recommendations:forYou:${userId}`,
    genres: () => "genres:all"
} as const 

export const cache = {
    async getOrSet<T>(key: string, fetcher: () => Promise<T>, ttl: number = TTL.MEDIUM): Promise<T> {
        try {
            const cachedData = await redis.get(key)
            if (cachedData) {
                logger.info(`Cache hit for key: ${key}`)
                return JSON.parse(cachedData) as T
            }
        } catch (error) {
            logger.error(`Error occurred while fetching from cache for key: ${key}`, error)
        }

        const data = await fetcher()

        try{
            await redis.setex(key, ttl, JSON.stringify(data))
            logger.info(`Cache set for key: ${key} (TTL: ${ttl}s)`)
        } catch (error) {
            logger.error(`Error occurred while setting cache for key: ${key}`, error)
        }

        return data
    },

    async del(key: string): Promise<void> {
        try {
            await redis.del(key)    
            logger.debug(`Cache deleted for key: ${key}`)
        } catch (error) {
            logger.error(`Error occurred while deleting cache for key: ${key}`, error)
        }
    },

    async delPattern(pattern: string): Promise<void> {
        try {
            const keys = await redis.keys(pattern)
            if(keys.length > 0) {
                await redis.del(...keys)
                logger.debug(`Cache deleted for pattern: ${pattern}`)
            }
        }catch (error) {
            logger.error(`Error occurred while deleting cache for pattern: ${pattern}`, error)
        }
    }
}