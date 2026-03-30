import type { Request, Response, NextFunction } from "express";
import { reviewService, ReviewService } from "./review.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
(req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)

export const createReview = asyncHandler(async (req, res) => {
    const review = await reviewService.createReview(req.user!.userId, req.body)
    return ApiResponse.created(res, review, "Created review")
})

export const getBookReviews = asyncHandler(async (req, res) => {
    const result = await reviewService.getBookReviews(req.params.bookId as string, req.query)
    return ApiResponse.paginated(res, result.reviews, result.pagination)
})

export const updateReview = asyncHandler(async (req, res) => {
    const review = await reviewService.updateReview(
        req.params.id as string,
        req.user!.userId,
        req.body
    )
    return ApiResponse.success(res, review, "Updated successfully")
})

export const deleteReview = asyncHandler(async (req, res) => {
    await reviewService.deleteReview(
        req.params.id as string,
        req.user!.userId,
        req.user!.role
    )

    return ApiResponse.success(res, null, "Deleted")
})

export const getUserReview = asyncHandler(async (req, res) => {
    const review = await reviewService.getUserReview(
        req.user!.userId,
        req.params.bookId as string
    )

    return ApiResponse.success(res, review)
})