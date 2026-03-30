import prisma from "../../database/prisma.js";
import { ApiError } from "../../utils/ApiError.js";

export class FollowService {

    async toggleFollow(userId: string, bookId: string){
        const book = await prisma.book.findUnique({
            where: {
                id: bookId
            }
        })

        if(!book) throw ApiError.notFound("Not Found")
        
        const existing = await prisma.follow.findUnique({
            where: {
                userId_bookId: {userId, bookId}
            }
        })

        if(existing){
            await prisma.follow.delete({
                where: {
                    id: existing.id
                }
            })
            return {
                following: false,
                message: "this account has been unfollowed"
            }
        }

        await prisma.follow.create({
            data: {userId, bookId}
        })
        return {following: true, message: "Followed"}
    }

    async checkFollow(userId: string, bookId: string) {
        const follow = await prisma.follow.findUnique({
            where: {
                userId_bookId: {
                    userId, bookId
                }
            }
        })

        return { following: Boolean(follow)}
    }

    async getFollowedBooks(userId: string){
        const follows = await prisma.follow.findMany({
            where: {userId},
            orderBy: {createdAt: "desc"},
            include : {
                book: {
                    include: {
                        author: {
                            select: {
                                id: true, username: true, avatar: true
                            }
                        },
                        _count: {
                            select: {
                                chapters: {
                                    where: {
                                        isPublished: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        return follows.map((f) => f.book)
    }
}

export const followService = new FollowService()

