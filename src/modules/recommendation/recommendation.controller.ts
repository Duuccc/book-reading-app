import type { Request, Response, NextFunction } from "express";
import { recommendationService } from "./recommendation.service.js";
import { ApiResponse } from "../../utils/ApiResponse.js";

const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) =>
  (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

export const getSimilarBooks = asyncHandler(async (req, res, next) => {
    const books = await recommendationService.getSimilarBooks(req.params.bookId as string)
    return ApiResponse.success(res, books)
})

export const getPersonalizedBooks = asyncHandler(async (req, res, next)=>{
    const books = await recommendationService.getPersonalizedBooks(req.user!.userId)
    return ApiResponse.success(res, books)
})

export const getTrendingBooks = asyncHandler(async (req, res, next) => {
    const books = await recommendationService.getTrendingBooks()
    return ApiResponse.success(res, books)
})