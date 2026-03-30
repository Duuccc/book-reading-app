import type { Request, Response, NextFunction } from "express";
import { notificationService } from "./notification.service.js";
import { followService } from "./follow.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

export const toggleFollow = asyncHandler(async (req, res, next) => {
    const result = await followService.toggleFollow(
        req.user!.userId,
        req.params.bookId as string
    )

    return ApiResponse.success(res, result, result.message)
})

export const checkFollow = asyncHandler(async (req, res, next) => {
    const result = await followService.checkFollow(
        req.user!.userId,
        req.params.bookId as string
    )

    return ApiResponse.success(res, result)
})

export const getFollowedBooks = asyncHandler(async (req, res, next) => {
    const books = await followService.getFollowedBooks(req.user!.userId)
    return ApiResponse.success(res, books)
})

export const getNotifications = asyncHandler(async (req, res, next) => {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 20
    const result = await notificationService.getNotifications(
        req.user!.userId, page, limit
    )

    return ApiResponse.paginated(res, result.notifications, result.pagination)
})

export const markAsRead = asyncHandler(async (req, res, next) => {
    await notificationService.markAsRead(req.user!.userId, req.params.id as string)
    return ApiResponse.success(res, null, "Marked as read")
})

export const markAllAsRead = asyncHandler(async (req, res, next) => {
    await notificationService.markAllAsRead(req.user!.userId)
    return ApiResponse.success(res, null, "Marked all as read")
})

export const deleteNotification = asyncHandler(async (req, res, next) => {  
    await notificationService.deleteNotification(req.user!.userId, req.params.id as string)
    return ApiResponse.success(res, null, "deleted notification")
})