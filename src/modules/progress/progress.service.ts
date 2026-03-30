import prisma from "../../database/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import type { UpsertProgressDto } from "./progres.dto.js";

export class ProgressService{ 
    async upsertProgress(userId: string, data: UpsertProgressDto){
        const {bookId, chapterId, currentPage} = data

        const chapter = await prisma.chapter.findFirst({
            where: {
                id: chapterId,
                bookId
            }
        })
        if(!chapter) throw ApiError.notFound("Not found")
        
        if(currentPage < 1) throw ApiError.badRequest("Page number invalid")

        // update + insert
        const progress = await prisma.readingProgress.upsert({
            where: { userId_bookId: { userId, bookId }},
            create: { userId, bookId, chapterId, currentPage },
            update: { chapterId, currentPage },
            include: {
                chapter: {
                    select: {title: true, chapterNumber: true}
                },
                book: {
                    select: { title: true, slug: true }
                }
            }
        })
        
        return progress
    }

    async getProgress(userId: string, bookId: string){
        const progress = await prisma.readingProgress.findUnique({
            where: { userId_bookId: {userId, bookId}},
            include: {
                chapter: {select: {title: true, chapterNumber: true}},
                book: {select: {title: true, slug: true}}
            }
        })

        if(!progress){
            return { started: false, progress: null }
        }

        return { started: true, progress }
    }

    async getAllProgress(userId: string){
        const progressList = await prisma.readingProgress.findMany({
            where: {
                userId
            },
            orderBy: {updatedAt: "desc"},
            include: {
                book: {
                    select: {
                        id: true, title: true, slug: true, coverUrl: true,
                        _count: {select: { chapters: { where: {isPublished: true }} }}
                    }
                },
                chapter: {select: {chapterNumber: true, title: true}}
            }
        })

        const result = progressList.map((p) => (
            {
                ...p,
                percentage: Math.round(
                    (p.chapter.chapterNumber / p.book._count.chapters ) * 100
                ) 
            }
        ))

        return result
    }

    async deleteProgress(userId: string, bookId: string){
        await prisma.readingProgress.deleteMany({
            where: {
                userId,
                bookId
            }
        })
    }
}

export const progressService = new ProgressService()