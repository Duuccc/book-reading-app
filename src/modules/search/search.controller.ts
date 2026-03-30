import type { Request, Response, NextFunction } from "express";
import { searchService, SearchService } from "./search.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
(req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)

export const search = asyncHandler(async (req, res, next) => {
    const result = await searchService.search(req.query as never)
    return ApiResponse.paginated(res, result.books, result.pagination)
})

export const autocomplete = asyncHandler(async (req, res, next) => {
    const { q } = req.query as { q: string }
    const result = await searchService.autocomplete(q)
    return ApiResponse.success(res, result)
})