import { describe, it, expect, beforeAll, afterAll } from "vitest";
import request from "supertest"
import app from "../../app.js"
import prisma from "../../database/prisma.js";
import { refreshToken } from "../../modules/auth/auth.controller.js";

describe("Auth API", () => {
    const testUser = {
        email: "testauth@example.com",
        username: "testauth",
        password: "Test@1234"
    }

    afterAll( async () => {
        await prisma.refreshToken.deleteMany({
            where: { user: { email: testUser.email }}
        })
        await prisma.user.deleteMany({ where: { email: testUser.email }})
    })

    describe("POST /api/auth/register", () => {
        it("should register a new user", async () => {
            const res = await request(app).post("/api/auth/register").send(testUser)
            
            expect(res.status).toBe(201)
            expect(res.body.success).toBe(true)
            expect(res.body.data).toHaveProperty("accessToken")
            expect(res.body.data).toHaveProperty("refreshToken")
            expect(res.body.data.user.email).toBe(testUser.email)
            expect(res.body.data.user).not.toHaveProperty("password")
        })

        it("should return 400 for duplicate email", async () => {
            const res = await request(app).post("/api/auth/register").send(testUser)

            expect(res.status).toBe(400)
            expect(res.body.success).toBe(false)
        })

        it("should return 400 for invalid email format", async () => {
            const res = await request(app).post("/api/auth/register").send({ ...testUser, email: "other@test.com", password: "1234"})

            expect(res.statusCode).toBe(400)
        })
    })

    describe("POST /api/auth/login", () => {
        it("should login with correct credentials", async () => {
            const res = await request(app).post("/api/auth/login").send({ email: testUser.email, password: testUser.password})

            expect(res.status).toBe(200)
            expect(res.body.data).toHaveProperty("accessToken")
            expect(res.body.data).toHaveProperty("refreshToken")
        })

        it("should return 401 for wrong password", async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: testUser.email,
                password: "wrongpassword"
            })

            expect(res.status).toBe(401)
        })

        it("should return 401 for non-existent email", async () => {
            const res = await request(app)
                .post("/api/auth/login")
                .send({ email: "ghost@test.com", password: "Test@1234" })

            expect(res.status).toBe(401)
        })

        it("should return same error message for wrong email vs wrong password", async () => {
            const res1 = await request(app).post("/api/auth/login").send({
                email: "ghost@test.com",
                password: "Test@1234"
            })

            const res2 = await request(app).post("/api/auth/login").send({
                email: testUser.email,
                password: "wrongpassword"
            })

            expect(res1.body.message).toBe(res2.body.message)
        })
    })

    describe("POST /api/auth/refresh", () => {
        let refreshToken: string

        beforeAll(async () => {
            const res = await request(app).post("/api/auth/login").send({
                email: testUser.email,
                password: testUser.password
            })
            refreshToken = res.body.data.refreshToken
        })

        it("should return new token pair", async () => {
            const res = await request(app).post("/api/auth/refresh").send({ refreshToken })

            expect(res.status).toBe(200)
            expect(res.body.data).toHaveProperty("accessToken")
            expect(res.body.data).toHaveProperty("refreshToken")
            expect(res.body.data.refreshToken).not.toBe(refreshToken)
        })

        it("should return 401 for invalid refresh token", async () => {
            const res = await request(app).post("/api/auth/refresh").send({ refreshToken: "Invalid" })

            expect(res.status).toBe(401)
        })

        it("should return 400 if refresh token is missing", async () => {
            const res = await request(app).post("/api/auth/refresh").send({})

            expect(res.status).toBe(400)
        })
    })

    describe("POST /api/auth/logout", () => {
        it("should logout successfully", async () => {
            const loginRes = await request(app).post("/api/auth/login").send({ email: testUser.email, password: testUser.password })

            const logoutRes = await request(app).post("/api/auth/logout").send({ refreshToken: loginRes.body.data.refreshToken })
            expect(logoutRes.status).toBe(200)
            expect(logoutRes.body.success).toBe(true)
        })
    })
})