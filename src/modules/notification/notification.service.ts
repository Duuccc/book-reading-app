import { title } from "node:process";
import prisma from "../../database/prisma.js";

export class NotificationService {
    async notifyNewChapter(bookId: string, chapterId: string){
        const [book, chapter] = await Promise.all([
            prisma.book.findUnique({
                where: {
                    id: bookId
                },
                select: {
                    title: true,
                    slug: true
                }
            }),
            prisma.chapter.findUnique({
                where: {
                    id: chapterId
                },
                select: {
                    title: true,
                    chapterNumber: true
                }
            })
        ])

        if(!book || !chapter) return

        const followers = await prisma.follow.findMany({
            where: {bookId},
            select: {userId: true}
        })

        if(followers.length === 0) return

        await prisma.notification.createMany({
            data: followers.map((f) => ({
                userId: f.userId,
                type: "NEW_CHAPTER" as const,
                title: `${book.title} has new chapter`,
                message: `Chapter ${chapter.chapterNumber}: ${chapter.title} has just been uploaded`,
                metadata: {
                    bookId,
                    chapterId,
                    slug: book.slug,
                    chapterNumber: chapter.chapterNumber,
                },
                isRead: false,
                createdAt: new Date()
            }))
        })
    }

    async getNotifications(userId: string, page = 1, limit = 20){
        const skip = (page - 1) * limit
        
        const [notifications, total, unreadCount] = await Promise.all([
            prisma.notification.findMany({
                where: { userId },
                skip,
                take: limit,
                orderBy: {"createdAt" : "desc"}
            }),
            prisma.notification.count({ where: { userId }}),
            prisma.notification.count({ where: {userId, isRead: false}})
        ])

        return {
            notifications,
            unreadCount,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total/limit)
            }
        }
    }

    async markAsRead(userId: string, notificationId: string){
        return prisma.notification.updateMany({
            where: {
                id: notificationId,
                userId
            },
            data: {
                isRead: true
            }
        })
    }

    async markAllAsRead(userId: string){
        return prisma.notification.updateMany({
            where: { userId, isRead: false },
            data: {isRead: true}
        })
    }

    async deleteNotification(userId: string, notificationId: string){
        await prisma.notification.deleteMany({
            where: {userId, id: notificationId}
        })
    }
}

export const notificationService = new NotificationService()