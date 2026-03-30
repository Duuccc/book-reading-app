import type {Request, Response, NextFunction} from "express"
import { verifyAccessToken } from "../utils/jwt.util.js"
import { ApiError } from "../utils/ApiError.js"
import { Role } from "../generated/prisma/enums.js"

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
    try{
        const auth = req.headers.authorization
        if(!auth?.startsWith('Bearer')){
            throw ApiError.unauthorized()
        }
        req.user = verifyAccessToken(auth.split(" ")[1] as string)
        next()
    } catch(err){
        next(err)
    }
}

export const authorize = (...roles: Role[]) => 
(req: Request, _res: Response, next: NextFunction) => {
    if(!req.user || !roles.includes(req.user.role as Role)){
        return next(ApiError.forbiddden())
    }
    next()
}