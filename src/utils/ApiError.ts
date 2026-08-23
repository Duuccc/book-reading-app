export class ApiError extends Error {
    public readonly statusCode: number
    public readonly errors: unknown[]
    public readonly isOperational: boolean

    constructor(statusCode: number, message: string, errors: unknown[] = []) {
        super(message)
        this.statusCode = statusCode
        this.errors = errors
        this.isOperational = true
    }

    static badRequest(msg: string, errors?: unknown[]) {
        return new ApiError(400, msg, errors)
    }
    static unauthorized(msg="Unauthorized") { return new ApiError(401, msg) }
    static forbiddden(msg="Forbidden") { return new ApiError(403, msg) }
    static notFound(msg="Not found") { return new ApiError(404,msg) }
    static internal(msg="Internal server error") { return new ApiError(500, msg) }
}