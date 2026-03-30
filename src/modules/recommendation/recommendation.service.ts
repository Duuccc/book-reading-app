import { generateKey } from "node:crypto"
import prisma from "../../database/prisma.js"
import { ApiError } from "../../utils/ApiError.js"
import { isModuleNamespaceObject } from "node:util/types"

export class RecommendationService {

    async getSimilarBooks(bookId: string, limit: number = 6) {
        const book = await prisma.book.findUnique({
            where: { id: bookId },
            include: { genres: true }
        })

        if (!book) throw ApiError.notFound("Not found")

        const genreIds = book.genres.map((g) => g.genreId)

        if(genreIds.length === 0){
            return this._getLatestBooks(bookId, limit);
        }

        const similar = await prisma.book.findMany({
                where: {
                    isPublished: true,
                    id: { not: bookId },
                    genres: { some: { genreId: { in: genreIds }}}
                },
                take: limit * 2,
                include: {
                    author: {select: {id: true, username: true}},
                    genres: {include: {genre:true}},
                    _count: {
                        select: {
                            chapters: { where: { isPublished: true }},
                            follows: true
                        }
                    }
                }
        })

        const sorted = similar.map((b) => {
            const matchCount = b.genres.filter((g) => {
                genreIds.includes(g.genreId)
            }).length
            return {...b, matchCount}
        })
        .sort((a, b) => b.matchCount - a.matchCount)
        .slice(0, limit)

        return sorted
    }

    async getPersonalizedBooks(userId: string, limit=10) {
        const recentProgress = await prisma.readingProgress.findMany({
            where: { userId },
            take: 5,
            orderBy: { updatedAt: "desc" },
            include: {
                book: {
                    include: {
                        genres: true
                    }
                }
            }
        })

        const genreCount: Record<string, number> = {}
        for ( const p of recentProgress ){
            for (const g of p.book.genres) {
                genreCount[g.genreId] = (genreCount[g.genreId] || 0) + 1
            }
        }

        const favoriteGenreIds = Object.entries(genreCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([id]) => id)

        const [readBookIds, bookmarkedIds] = await Promise.all([
            prisma.readingProgress.findMany({
                where: { userId },
                select: { bookId: true }
            }),
            prisma.bookmark.findMany({
                where: { userId },
                select: { bookId: true }
            })
        ])

        const excludeIds = [
            ...readBookIds.map((r) => r.bookId),
            ...bookmarkedIds.map((b) => b.bookId)
        ]

        if(favoriteGenreIds.length === 0){
            return this._getLatestBooks(null, limit, excludeIds)
        }

        const books = await prisma.book.findMany({
            where: {
                isPublished: true,
                id: { notIn: excludeIds },
                genres: {
                    some: { genreId: { in: favoriteGenreIds }}
                }
            },
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                author: { select: { id: true, username: true, avatar: true}},
                genres: { include: { genre: true }},
                _count: {
                    select: {
                        chapters: {
                            where: {
                                isPublished: true
                            }
                        },
                        follows: true
                    }
                }
            }
        })

        return books
    }

    async getTrendingBooks(limit = 10){
        const books = prisma.book.findMany({
            where: {
                isPublished: true,
            },
            take: limit,
            orderBy: {
                follows: { _count: "desc" }
            },
            include: {
                author: { select: {id: true, username: true, avatar: true}},
                genres: { include: { genre: true }},
                _count: {
                    select: {
                        chapters: {
                            where: {
                                isPublished: true
                            }
                        },
                        follows: true
                    }
                }   
            }
        })
        return books
    }

    private async _getLatestBooks(
        excludeBookId: string | null,
        limit: number,
        excludeIds: string[] = []
    ){
        const exclude = excludeBookId ? [...excludeIds, excludeBookId] : excludeIds

        return prisma.book.findMany({
            where: {
                isPublished: true,
                ...(exclude.length > 0 && {id: {notIn: exclude}})
                // id: {notIn: e}
            },
            take: limit,
            orderBy: {
                createdAt: "desc"
            },
            include: {
                author: {select: {id: true, username: true, avatar: true}},
                genres: { include: {genre: true}},
                _count: {
                    select: {
                        chapters: {
                            where: {
                                isPublished: true
                            }
                        },
                        follows: true
                    }
                }
            }
        })
    }
}

export const recommendationService = new RecommendationService();