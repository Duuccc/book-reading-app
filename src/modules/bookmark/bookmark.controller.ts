import type { Request, Response, NextFunction } from "express";
import { bookmarkService } from "./bookmark.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        return fn(req, res, next).catch(next)
    }
}

export const toggleBookmark = asyncHandler(async (req, res) => {
    const result = await bookmarkService.toggleBookmark(req.user!.userId, req.body)
    return ApiResponse.success(res, result, result.message)
})

export const getUserBookmarks = asyncHandler(async (req, res) => {
    const result = await bookmarkService.getUserBookmarks(req.user!.userId, req.query)
    return ApiResponse.paginated(res, result.bookmarks, result.pagination)
})

export const checkBookmark = asyncHandler(async (req, res) => {
    const {bookId, chapterId} = req.query as Record<string, string>
    const result = await bookmarkService.checkBookmark(req.user!.userId, bookId as string, chapterId)
    return ApiResponse.success(res, result)
})