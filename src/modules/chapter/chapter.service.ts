import { start } from "node:repl";
import prisma from "../../database/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import type { CreateChapterDto, UpdateChapterDto, ChapterQuery } from "./chapter.dto.js";
import { notificationService } from "../notification/notification.service.js";
import { error } from "node:console";
import { logger } from "../../utils/logger.js";
import { TTL, cache, CacheKey } from "../../utils/cache.js";

const WORDS_PER_PAGE = 1000

export class ChapterService{
    async createChapter(bookId: string, userId: string, userRole: string, data: CreateChapterDto){
        const book = await prisma.book.findUnique({ where: { id: bookId }})
        if(!book){
            throw ApiError.notFound("Book not found")
        }

        if(book.authorId !== userId && userRole !== "ADMIN"){
            throw ApiError.forbiddden("You do not have privilege to add chapter")
        }
        
        const existing = await prisma.chapter.findUnique({
            where: {
                bookId_chapterNumber:{
                    bookId,
                    chapterNumber: data.chapterNumber
                }    
            }
        })

        if(existing) {
            throw ApiError.badRequest(`Chapter ${data.chapterNumber} already exists`)
        }

        const wordCount = this._countWords(data.content);

        const chapter = await prisma.chapter.create({
            data: {
                ...data,
                bookId,
                wordCount,
            }
        })

        if(data.isPublished){
            notificationService.notifyNewChapter(bookId, chapter.id).catch((error) => {
                logger.error("Notify chapter failed:", error)
            })
        }

        await cache.delPattern(`books:${bookId}:chapters:*`)

        return chapter
    }

    async getChapters(bookId: string, query: ChapterQuery){
        const page = Number(query.page) || 1

        return cache.getOrSet(
            CacheKey.bookChapters(bookId, page),
            async () => {
                const limit = Number(query.limit) || 50
                const skip = (page - 1) * limit
                const [chapters, total] = await Promise.all([
                    prisma.chapter.findMany({
                        where: { bookId, isPublished: true },
                        skip, take: limit,
                        orderBy: { chapterNumber: "asc" },
                        select: { id: true, title: true, chapterNumber: true, wordCount: true, createdAt: true }
                    }),
                    prisma.chapter.count({ where: { bookId, isPublished: true }})
                ])
                return { chapters, pagination: { page, limit, total, totalPages: Math.ceil(total/limit)}}
            },
            TTL.MEDIUM
        )
    }

    async readChapter(bookId: string, chapterNumber: number, page: number = 1) {
        const chapter = await prisma.chapter.findUnique({
            where: {
                bookId_chapterNumber: {bookId, chapterNumber},
                isPublished: true,
            },
            include: {
                book: {select: {title:true,slug:true}}
            }
        })

        if(!chapter){
            throw ApiError.notFound("Chapter not found")
        }

        const words = chapter.content.split(/\s+/);
        const totalPages = Math.ceil(words.length / WORDS_PER_PAGE)
        const currentPage = Math.min(Math.max(page, 1), totalPages)

        const startIndex = (currentPage - 1) * WORDS_PER_PAGE
        const pageContent = words.slice(startIndex, startIndex + WORDS_PER_PAGE).join(' ')
        

        const [prevChapter, nextChapter] = await Promise.all([
            prisma.chapter.findFirst({
                where: {bookId, chapterNumber: {lt: chapterNumber}, isPublished: true},
                orderBy: { chapterNumber: "desc"},
                select: { chapterNumber: true, title: true },
            }),
            prisma.chapter.findFirst({
                where: {bookId, chapterNumber: {gt:chapterNumber}, isPublished: true},
                orderBy: {chapterNumber: "asc"},
                select: {chapterNumber:true, title: true}
            })
        ])

        return {
            chapter: {
                id: chapter.id,
                title: chapter.title,
                chapterNumber: chapter.chapterNumber,
                wordCount: chapter.wordCount,
                book: chapter.book
            },
            reading: {
                content: pageContent,
                currentPage,
                totalPages,
                hasNextPage: currentPage < totalPages,
                hasPrevPage: currentPage > 1
            },
            navigation : {
                prevChapter,
                nextChapter,
            }
        }
    }

    async updateChapter(
        chapterId: string,
        userId: string,
        userRole: string,
        data: UpdateChapterDto
    ){
        const chapter = await prisma.chapter.findUnique({
            where: { id: chapterId },
            include: { book: true }
        })
        if(!chapter) throw ApiError.notFound("Chapter not found")
        
        if(chapter.book.authorId !== userId && userRole !== "ADMIN"){
            throw ApiError.forbiddden("You do not have privilege to modify this chapter")
        }

        const updateData: Record<string, unknown> = {...data}
        if(data.content) {
            updateData.wordCount = this._countWords(data.content)
        }

        const updated = await prisma.chapter.update({ where: {id: chapterId}, data: updateData})

        await cache.delPattern(`books:${chapter.bookId}:chapters:*`)
        
        const justPublished = !chapter!.isPublished && updated.isPublished
        if(justPublished){
            await Promise.all([
                cache.del(CacheKey.bookDetails(chapter.book.slug)),
                cache.del(CacheKey.trending()),
            ])
            notificationService.notifyNewChapter(updated.bookId, updated.id).catch((err) => {
                logger.error("Notify chapter failed:", err)
            })
        }

        return updated
    }

    async deleteChapter(chapterId: string, userId: string, userRole: string){
        const chapter = await prisma.chapter.findUnique({
            where: {id:chapterId},
            include: {book: true}
        })
        if(!chapter){
            throw ApiError.notFound("Chapter not found")
        }

        if(chapter.book.authorId !== userId && userRole !== "ADMIN"){
            throw ApiError.forbiddden("You do not have privilege to delete this chapter")
        }

        await prisma.chapter.delete({
            where: {
                id: chapterId
            }
        })
    }

    private _countWords(text: string): number {
        return text.trim().split(/\s+/).filter(Boolean).length
    }
}

export const chapterService = new ChapterService()