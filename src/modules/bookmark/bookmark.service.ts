import prisma from "../../database/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import type { CreateBookmarkDto, BookmarkQuery } from "./bookmark.dto.js";

export class BookmarkService {
    async toggleBookmark(userId: string, data: CreateBookmarkDto){
        const {bookId, chapterId=null} = data

        const book = await prisma.book.findUnique({
            where: {
                id: bookId
            }
        })

        if(!book){
            throw ApiError.notFound("Book not found")
        }

        const existing = await prisma.bookmark.findFirst({
            where: {
                userId,
                bookId,
                chapterId: chapterId ?? null
            }
        })

        if(existing){
            await prisma.bookmark.delete({where:{id:existing.id}})
            return {
                bookmarked: false,
                message: "deleted bookmark"
            }
        }

        const bookmark = await prisma.bookmark.create({
            data: { userId, bookId, chapterId },
            include: {
                book: {select: {title:true, slug:true}},
                chapter: {select: {title: true, chapterNumber:true}}
            }
        })

        return {bookmarked: true, message: "added bookmark", bookmark}
    }

    async getUserBookmarks(userId: string, query: BookmarkQuery){
        const page = Number(query.page) || 1
        const limit = Number(query.limit) || 20
        const skip = (page - 1) * limit

        const where: Record<string, unknown> = {
            userId
        }

        if(query.type === "book") where.chapterId = null
        if(query.type === "chapter") where.chapterId = {not: null}
    
        const [bookmarks, total] = await Promise.all([
            prisma.bookmark.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    book: {
                        select: {
                            id: true, title: true, slug: true, coverUrl: true,
                            status: true,
                            _count: {select: {chapters:true}}
                        }
                    }
                }
            }),
            prisma.bookmark.count({ where })
        ])

        return {
            bookmarks,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        }
    }

    async checkBookmark(userId: string, bookId: string, chapterId?: string){
        const bookmark = await prisma.bookmark.findUnique({
            where: {
                userId_bookId_chapterId: {
                    userId,
                    bookId,
                    chapterId: chapterId ?? ""
                }
            }
        })

        return { bookmarked: Boolean(bookmark) }
    }
}

export const bookmarkService = new BookmarkService()
