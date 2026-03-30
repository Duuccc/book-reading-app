import type { Request, Response, NextFunction } from "express";
import { Prisma } from "../generated/prisma/client.js";
import { ApiError } from "../utils/ApiError.js";
import { logger } from "../utils/logger.js" 

export const errorMiddleware = (
    err: Error,
    req: Request,
    res: Response,
    _next: NextFunction
) => {
    logger.error({ message: err.message, stack: err.stack, path: req.path })

    if (err instanceof ApiError){
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            errors: err.errors
        })
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        const prismaErrors: Record<string, { status: number, message: string }> = {
            P2002: {
                status: 409, message: "Data already exists"
            },
            P2025: {
                status: 404, message: "Data not found"
            }
        }
        const mapped = prismaErrors[err.code]
        if(mapped) {
            return res.status(mapped.status).json({
                success: false,
                message: mapped.message
            })
        }

        return res.status(500).json({
            success: false,
            message: "Something gone wrong, please try later"
        })
    }
}