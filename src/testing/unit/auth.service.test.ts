// import { beforeEach, describe, expect, it, vi } from "vitest"

// vi.mock("bcryptjs", () => ({
//     default: {
//         hash: vi.fn().mockResolvedValue("hashed-password")
//     }
// }))

// vi.mock("../../utils/jwt.util.js", () => ({
//     generateTokens: vi.fn().mockReturnValue({
//         accessToken: "access-token",
//         refreshToken: "refresh-token"
//     })
// }))

// vi.mock("../../config/env.js", () => ({
//     config: {
//         jwt: {
//             refreshExpiryMs: 1000 * 60 * 60
//         }
//     }
// }))

// const prismaMock = {
//     user: {
//         findFirst: vi.fn()
//     },

//     refreshToken: {
//         create: vi.fn()
//     },

//     $transaction: vi.fn()
// }

// vi.mock("../../database/prisma.js", () => ({
//     default: {
//         user: {
//             findFirst: vi.fn()
//         },

//         refreshToken: {
//             create: vi.fn()
//         },

//         $transaction: vi.fn()
//     },
// }))

// import prisma from "../../database/prisma.js"
// import { authService } from "../../modules/auth/auth.service.js"

// const mockFindFirst = vi.mocked(prisma.user.findFirst)
// const mockTransaction = vi.mocked(prisma.$transaction)

// describe("AuthService", () => {
//     beforeEach(() => {
//         vi.clearAllMocks()
//     })

//     describe("register", () => {
//         it("creates a new user", async () => {
//             mockFindFirst.mockResolvedValue(null)

//             mockTransaction.mockImplementation(async (callback: any) => {
//                 return callback({
//                     user: {
//                         create: vi.fn().mockResolvedValue({
//                             id: "1",
//                             email: "duc@test.com",
//                             username: "duc",
//                             role: "READER",
//                             createdAt: new Date(    )
//                         })
//                     },
//                     refreshToken: {
//                         create: vi.fn().mockResolvedValue({})
//                     }
//                 })
//             })

//             const result = await authService.register({
//                 email: "duc@test.com",
//                 username: "duc",
//                 password: "123456"
//             })

//             expect(prisma.user.findFirst).toHaveBeenCalledOnce()

//             expect(result).toEqual({
//                 user: {
//                     id: "1",
//                     email: "duc@test.com",
//                     username: "duc",
//                     role: 'READER',
//                     createdAt: expect.any(Date)
//                 },
//                 accessToken: "access-token",
//                 refreshToken: "refresh-token"
//             })
//         })

//         it("throws when email already exists", async () => {
//             mockFindFirst.mockResolvedValue({
//                 id: "1",
//                 email: "duc@test.com",
//                 username: "someone",
//                 password: "secret",
//                 avatar: null,
//                 role: "READER",
//                 isVerified: true,
//                 createdAt: new Date(),
//                 updatedAt: new Date()
//             })

//             await expect(
//                 authService.register({
//                     email: "duc@test.com",
//                     username: "duc",
//                     password: "123456"
//                 })
//             ).rejects.toThrow("Email is already used")
//         })
//     })
// })