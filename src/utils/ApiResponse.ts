import type { Response } from 'express'

export class ApiResponse {
    static success<T>(res: Response, data: T, message = "success",  statusCode = 200){
        return res.status(statusCode).json({ success: true, message, data})
    }

    static created<T>(res: Response, data: T, message = "created"){
        return this.success(res, data, message, 201)
    }

    static paginated<T>(res: Response, 
        data: T[], 
        pagination: {
            page: number
            limit: number
            total: number
            totalPages: number
        },
    ){
        return res.status(200).json({
            success: true,
            data,
            pagination,
        })
    }
}