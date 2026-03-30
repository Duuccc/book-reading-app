import type {Request, Response, NextFunction} from "express"
import {bookService} from "./book.service.js"
import { ApiError } from "../../utils/ApiError.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import type { NetConnectOpts } from "node:net"
import { BookGenreScalarFieldEnum } from "../../generated/prisma/internal/prismaNamespace.js"

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => 
(req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)

export const createBook = asyncHandler(async (req, res) => {
    console.log("1. In controller")
    console.log("Body:", req.body)
    console.log("User:", req.user)

    const book = await bookService.createBook(req.user!.userId, req.body)
    console.log("2.Complete")
    return ApiResponse.created(res, book, "Created")
})

export const getBooks = asyncHandler(async (req, res) => {
    const result = await bookService.getBooks(req.query)
    return ApiResponse.paginated(res, result.books, result.pagination)
})

export const getBookBySlug = asyncHandler(async (req, res) => {
    const book = await bookService.getBookBySlug(req.params.slug as string)
    return ApiResponse.success(res, book)
})

export const updateBook = asyncHandler(async (req, res) => {
    const book = await bookService.updateBook(req.params.id as string, req.user!.userId, req.user!.role, req.body)
    return ApiResponse.success(res, book, "Successfully update")
})

export const deleteBook = asyncHandler(async (req, res) => {
    await bookService.deleteBook(req.params.id as string, req.user!.userId, req.user!.role)
    return ApiResponse.success(res, null, "Deleted")
})