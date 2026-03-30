import jwt from "jsonwebtoken"
import { config } from "../config/env.js"
import { ApiError } from "./ApiError.js"

export interface JwtPayload {
    userId: string
    role: string
}

export const generateTokens = (payload: JwtPayload) => {
    return {
        accessToken: jwt.sign(payload, config.jwt.accessSecret, {
            expiresIn: config.jwt.accessExpiry,
        }),
        refreshToken: jwt.sign(payload, config.jwt.refreshSecret, {
            expiresIn: config.jwt.refreshExpiry
        })
    }
}

export const verifyAccessToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, config.jwt.accessSecret) as JwtPayload
    }catch( error ){
        if (error instanceof jwt.TokenExpiredError){
            throw ApiError.unauthorized("Token expired")
        }
        throw ApiError.unauthorized("Invalid Token")
    }
}

export const verifyRefreshToken = (token: string): JwtPayload => {
    try{
        return jwt.verify(token, config.jwt.refreshSecret) as JwtPayload
    } catch {
        throw ApiError.unauthorized("Invalid Refresh Token")
    }
}