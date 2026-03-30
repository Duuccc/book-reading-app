import type { Request, Response, NextFunction } from "express";
import { progressService, ProgressService } from "./progress.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
(req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)

export const upsertProgress = asyncHandler(async (req, res) => {
    const progress = await progressService.upsertProgress(req.user!.userId, req.body)
    return ApiResponse.success(res, progress, "Update progress successfully")
})

export const getProgress = asyncHandler(async (req, res) => {
    const result = await progressService.getProgress(
        req.user!.userId,
        req.params.bookId as string
    )

    return ApiResponse.success(res, result)
})

export const getAllProgress = asyncHandler(async (req, res) => {
    const result = await progressService.getAllProgress(req.user!.userId)
    return ApiResponse.success(res, result)
})

export const deleteProgress = asyncHandler(async (req, res) => {
    await progressService.deleteProgress(req.user!.userId, req.params.bookId as string)
    return ApiResponse.success(res, null, "Reset reading progress")
})