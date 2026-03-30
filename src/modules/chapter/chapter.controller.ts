import type { Request, Response, NextFunction } from "express";
import { chapterService, ChapterService } from "./chapter.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
(req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)

export const createChapter = asyncHandler(async (req, res) => {
    const chapter = await chapterService.createChapter(
        req.params.bookId as string,
        req.user!.userId,
        req.user!.role,
        req.body
    )
    return ApiResponse.created(res, chapter, "Created chapter")
})

export const getChapters = asyncHandler(async (req, res) => {
    const result = await chapterService.getChapters(req.params.bookId as string, req.query)
    return ApiResponse.paginated(res, result.chapters, result.pagination)
})

export const readChapter = asyncHandler(async (req, res) => {
    const page = Number(req.query.page) || 1
    const result = await chapterService.readChapter(
        req.params.bookId as string,
        Number(req.params.chapterNumber),
        page
    )
    return ApiResponse.success(res, result)
})

export const updateChapter = asyncHandler(async (req, res) => {
    const chapter = await chapterService.updateChapter(
        req.params.id as string,
        req.user!.userId,
        req.user!.role,
        req.body
    )
    return ApiResponse.success(res, chapter, "Updated chapter")
})

export const deleteChapter = asyncHandler(async (req, res) => {
    await chapterService.deleteChapter(
        req.params.id as string,
        req.user!.userId,
        req.user!.role
    )
    return ApiResponse.success(res, null, "Deleted chapter")
})