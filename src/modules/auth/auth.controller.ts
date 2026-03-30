import type { Request, Response, NextFunction} from "express"
import { validationResult } from "express-validator"
import { authService } from "./auth.service.js"
import { ApiResponse } from "../../utils/ApiResponse.js"
import { ApiError } from "../../utils/ApiError.js"

const validate = (req: Request) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        throw ApiError.badRequest("Invalid data", errors.array())
    }
}

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => 
(req: Request, res: Response, next: NextFunction) => fn(req, res, next).catch(next)

export const register = asyncHandler(async (req, res) => {
    validate(req)
    const result = await authService.register(req.body)
    return ApiResponse.created(res, result, "Register successfully")
})

export const login = asyncHandler(async (req, res) => {
    validate(req)
    const result = await authService.login(req.body)
    return ApiResponse.success(res, result, "Login successfully")
})

export const refreshToken = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body as { refreshToken? : string }
    if (!refreshToken) throw ApiError.badRequest("Missing refresh token")   

    const tokens = await authService.refreshToken(refreshToken)
    return ApiResponse.success(res, tokens, "Token was refreshed")
})

export const logout = asyncHandler(async (req, res) => {
    const { refreshToken } = req.body as { refreshToken?: string }
    if(!refreshToken) throw ApiError.badRequest("Missing refresh token")
    
    await authService.logout(refreshToken)
    return ApiResponse.success(res, null, "Successfully log out")
})

export const logoutAll = asyncHandler(async (req, res) => {
    await authService.logoutAll(req.user!.userId)
    return ApiResponse.success(res, null, "Log out all devices")
})