import prisma from "../../database/prisma.js";
import { ApiError } from "../../utils/ApiError.js";
import type {CreateReviewDto, UpdateReviewDto, ReviewQuery} from "./review.dto.js"

export class ReviewService {
    async createReview(userId: string, data: CreateReviewDto){
        const { bookId, rating, content } = data

        if(rating < 1 || rating > 5){
            throw ApiError.badRequest("Rating must be in range 1 to 5")
        }

        const book = await prisma.book.findUnique({ where: {id: bookId}})
        if(!book) throw ApiError.notFound("not found")

        if(book.authorId === userId){
            throw ApiError.badRequest("Cannot self rate your book")
        }

        const existing = await prisma.review.findUnique({
            where: {userId_bookId: {userId, bookId}}
        })

        if(existing){
            throw ApiError.badRequest("You already reviewed this book")
        }

        const review = await prisma.review.create({
            data: {userId, bookId, rating, content: content ?? null},
            include: {
                user: {select: {id: true, username:true, avatar: true}},
            },
        })

        return review
    }

    async getBookReviews(bookId: string, query: ReviewQuery){
        const page = Number(query.page) || 1
        const limit = Number(query.limit) || 10
        const skip = (page - 1) * limit

        const orderBy = {
            latest: {createdAt: "desc" as const},
            highest: {rating: "desc" as const},
            lowest: {rating: "asc" as const}
        }[query.sort ?? "latest"]

        const [reviews, total, stats] = await Promise.all([
            prisma.review.findMany({
                where: {bookId},
                skip,
                take: limit,
                orderBy,
                include: {
                    user: {
                        select: {
                            id: true, username: true, avatar: true
                        }
                    }
                }
            }),
            prisma.review.count({ where: { bookId }}),

            prisma.review.aggregate({
                where: { bookId },
                _avg: { rating: true },
                _count: {rating: true},
            }),
        ])

        const distribution = await prisma.review.groupBy({
            by: ["rating"],
            where: {bookId},
            _count: { rating: true },
            orderBy: {rating: "asc"}
        })

        return {
            reviews,
            stats: {
                averageRating: Number(stats._avg.rating?.toFixed(1)) || 0,
                totalReviews: Number(stats._count.rating),
                distribution: distribution.map((d) => ({
                    star: d.rating,
                    count: d._count.rating
                }))
            },
            pagination: {page, limit, total, totalPages: Math.ceil(total/limit)},
        }
    }

    async updateReview(reviewId: string, userId: string, data: UpdateReviewDto){
        const review = await prisma.review.findUnique({
            where: {
                id: reviewId
            }
        })

        if(!review) throw ApiError.notFound("NOT FOUND")
            
        if (review.userId !== userId){
            throw ApiError.forbiddden('forbidden')
        }

        if(data.rating && (data.rating < 1 || data.rating > 5)){
            throw ApiError.badRequest("rating should be in range 1 to 5")
        }

        return prisma.review.update({
            where: {
                id: reviewId
            },
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        avatar: true
                    }
                }
            }
        })
    }

    async deleteReview(reviewId: string, userId: string, userRole: string){
        const review = await prisma.review.findUnique({where: {id: reviewId}})
        if(!review) throw ApiError.notFound("Review not found")
        
        if(review.userId !== userId && userRole !== "ADMIN"){
            throw ApiError.forbiddden("Forbidden")
        }

        await prisma.review.delete({where: {id: reviewId}})
    }

    async getUserReview(userId: string, bookId: string){
        const review = await prisma.review.findUnique({
            where: {
                userId_bookId: {userId, bookId}
            }
        })
        return review
    }
}

export const reviewService = new ReviewService()

