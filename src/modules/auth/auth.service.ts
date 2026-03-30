import bcrypt from "bcryptjs"
import prisma from "../../database/prisma.js"
import { generateTokens, verifyRefreshToken } from "../../utils/jwt.util.js"
import { ApiError } from "../../utils/ApiError.js"
import { config } from "../../config/env.js"
import type { RegisterDto, LoginDto, AuthResponse } from "./auth.dto.js"
import e from "express"

export class AuthService {
    
    async register(data: RegisterDto): Promise<AuthResponse> {
        const existing = await prisma.user.findFirst({
            where: { OR: [{ email: data.email }, { username: data.username }]}
        })

        if (existing) {
            const field = existing.email === data.email? "Email" : "Username"
            throw ApiError.badRequest(`${field} is already used`)
        }

        const hashedPassword = await bcrypt.hash(data.password, 12)

        return prisma.$transaction( async (tx) => {
            const user = await tx.user.create({
                data: {
                    email: data.email,
                    username: data.username,
                    password: hashedPassword,
                },
                select: {
                    id: true, email: true, username: true,
                    role: true, createdAt: true
                }
            })

            const tokens = generateTokens({ userId: user.id, role: user.role })

            await tx.refreshToken.create({
                data: {
                    userId: user.id,
                    token: tokens.refreshToken,
                    expiresAt: new Date(Date.now() + config.jwt.refreshExpiryMs)
                }
            })

            return { user,  ...tokens }
        })
    }

    async login(data: LoginDto): Promise<AuthResponse> {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        })

        const dummyHash = "$2a$12$dummyhashtopreventtimingattacksXXXXXXXXXXXXXXXX"
        const isValid = await bcrypt.compare(data.password, user?.password ?? dummyHash)

        if (!user || !isValid){
            throw ApiError.unauthorized("Incorrect email or password")
        }

        const tokens = generateTokens({ userId: user.id, role: user.role })

        await prisma.refreshToken.create({
            data:{
                userId: user.id,
                token: tokens.refreshToken,
                expiresAt: new Date(Date.now() + config.jwt.refreshExpiryMs)
            }
        })

        const { password: _, ...safeUser } = user
        return { user: safeUser, ...tokens }
    }

    async refreshToken(token: string) {
        const payload = verifyRefreshToken(token)

        const stored = await prisma.refreshToken.findUnique({ where: {token} })

        if(!stored || stored.userId !== payload.userId ){
            throw ApiError.unauthorized("Invalid refresh token")
        }

        if (stored.expiresAt < new Date()){
            await prisma.refreshToken.delete({ where : {token} })
            throw ApiError.unauthorized("expired refresh token")
        }

        return prisma.$transaction(async (tx) => {
            await tx.refreshToken.delete({ where : { token } })

            // const user = await tx.user.findUniqueOrThrow({
            //     where: {id: payload.userId},
            //     select: {id: true, role: true}
            // })

            const tokens = generateTokens({ userId: payload.userId, role: payload.role})

            await tx.refreshToken.create({
                data: {
                    userId: payload.userId,
                    token: tokens.refreshToken,
                    expiresAt: new Date(Date.now() + config.jwt.refreshExpiryMs),
                }
            })

            return tokens
        })
    }

    async logout(token: string): Promise<void> {
        await prisma.refreshToken.deleteMany({ where: { token } })
    }

    async logoutAll(userId: string): Promise<void> {
        await prisma.refreshToken.deleteMany({ where: { userId } })
    }
}

export const authService = new AuthService()