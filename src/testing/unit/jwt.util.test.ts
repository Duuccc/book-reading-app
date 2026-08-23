import { describe, it, expect, beforeAll } from "vitest";
import { generateTokens, verifyAccessToken, verifyRefreshToken } from "../../utils/jwt.util.js"
import { ApiError } from "../../utils/ApiError.js";
import { token } from "morgan";
import { execPath } from "node:process";

beforeAll(() => {
    process.env.JWT_ACCESS_SECRET = "0a952e792d24d57168865ba8193d839bd43f43a1e99a483e0525c42b85286519"
    process.env.JWT_REFRESH_SECRET = "aef559a2e4dbea10688048fff83b7bae5d4662d4e5fe5bd9294170124d6504e9"
})

describe("JWT Utilities", () => {
    const payload = { userId: "test-user-id", role: "READER"}

    describe("generateTokens", () => {
        it("should generate access and refresh tokens", () => {
            const tokens = generateTokens(payload)
            expect(tokens).toHaveProperty("accessToken")
            expect(tokens).toHaveProperty("refreshToken")
            expect(typeof tokens.accessToken).toBe("string")
        })

        it("should generate different tokens each call", () => {
            const t1 = generateTokens(payload)
            const t2 = generateTokens(payload)
            expect(t1.accessToken).not.toBe(t2.accessToken)
        })
    })

    describe("verifyAccessToken", () => {
        it("should verify valid access token", () => {
            const { accessToken } = generateTokens(payload)
            const decoded = verifyAccessToken(accessToken)
            expect(decoded.userId).toBe(payload.userId)
            expect(decoded.role).toBe(payload.role)
        })

        it("should throw ApiError for invalid token", () => {
            expect(() => verifyAccessToken("invalid")).toThrow(ApiError)
        })

        it("should throw 401 for invalid token", () => {
            try{
                verifyAccessToken("invalid")
            } catch (err) {
                expect(err).toBeInstanceOf(ApiError)
                expect((err as ApiError).statusCode).toBe(401)
            }
        })
    })

    describe("verifyRefreshToken", () => {
        it("should verify valid refresh token", () => {
            const {refreshToken} = generateTokens(payload)
            const decoded = verifyRefreshToken(refreshToken)
            expect(decoded.userId).toBe(payload.userId)
        })

        it("should throw for invalid refresh token", () => {
            expect(() => verifyRefreshToken("invalid")).toThrow(ApiError)
        })
    })


})