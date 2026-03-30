import { isUint8ClampedArray } from "node:util/types"
import prisma from "../../database/prisma.js"
import { ApiError } from "../../utils/ApiError.js"
import type { SearchQuery, SearchResult } from "./search.dto.js"

export class SearchService{
    async search(query: SearchQuery): Promise<SearchResult> {
        const start = Date.now()

        const { q, type, genre, status, sort, page = 1, limit = 20 }= query

        if (!q?.trim()) throw ApiError.badRequest("Please enter search word")
        if (q.trim().length < 2) throw ApiError.badRequest("Search word need to be at least 2 characters")

        const skip = (Number(page) - 1) * Number(limit)

        const where: Record<string, unknown> = { isPublished: true }

        if(status) where.status = status

        if(genre) {
            where.genres = {some:{genre: {slug: genre}}}
        }

        if(!type || type === "book"){
            where.OR = [
                {title: {contains: q, mode: "insensitive"}},
                {description: {contains: q, mode: "insensitive"}}
            ]
        }

        if(type === "genre"){
            where.genres = {
                some: {
                    genre: {
                        name: {
                            contains: q, mode: "insensitive"
                        }
                    }
                }
            }
        }

        type OrderBy = Record<string, unknown>
        const orderByMap: Record<string, OrderBy> = {
            latest: {createdAt: "desc"},
            rating: {reviews: {_count: "desc"}},
            popular: {follows: {_count: "desc"}},

            relevant: {title: "asc"}
        }

        const orderBy = orderByMap[sort ?? "relevant"]

        const dbQuery: any = {
            where,
            skip,
            take: Number(limit),
            include: {
                author: {select: {id: true, username: true, avatar: true}},
                genres: {include: {genre: {select: {id: true, name: true, slug: true}}}},
                _count: {
                    select: {
                        chapters: {
                            where: {isPublished: true}
                        },
                        follows: true,
                        reviews: true
                    }
                }
            }
        }

        if(orderBy){
            dbQuery.orderBy = orderBy
        }

        const [books, total] = await Promise.all([
            prisma.book.findMany(dbQuery),
            prisma.book.count({ where }),
        ])
    
        return {
            books,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages: Math.ceil(total/Number(limit))
            },
            meta: {
                query: q,
                took: Date.now() - start
            }
        }
    }

    async autocomplete(q: string){
        if(!q || q.length < 2) return { suggestion: [] }

        const [books, authors] = await Promise.all([
            prisma.book.findMany({
                where: {
                    isPublished: true,
                    title: { contains: q, mode: "insensitive" }
                },
                take: 5,
                select: {
                    id: true, title: true, slug: true, coverUrl: true
                }
            }),
            prisma.user.findMany({
                where: {
                    role: { in: ["AUTHOR", "ADMIN"] },
                    username: { contains: q, mode:"insensitive" },
                },
                take: 3,
                select: {
                    id: true, username: true, avatar: true
                }
            })
        ])

        return {
            suggestions: [
                ...books.map((b) => ({type:"book", ...b})),
                ...authors.map((a) => ({ type:"author", ...a}))
            ]
        }
    }
}

export const searchService = new SearchService()