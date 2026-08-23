import { describe, it, expect, beforeAll, afterAll, expectTypeOf } from "vitest";
import request from "supertest"
import app from "../../app.js"
import prisma from "../../database/prisma.js";
import { defineScript } from "redis";

describe("book API", () => {
    let authorToken: string
    let readerToken: string
    let createdBookId: string
    let createdBookSlug: string

    const authorUser = {
        email: "testbookauthor@example.com",
        username: "testbookauthor",
        password: "Test@1234"
    }

    const readerUser = {
        email: "testbookreader@example.com",
        username: "testbookreader",
        password: "Test@1234"
    }

    beforeAll(async () => {
        await request(app).post("/api/auth/register").send(authorUser)
        await prisma.user.update({
            where: { email: authorUser.email },
            data: { role: "AUTHOR" }
        })
        const loginRes = await request(app).post("/api/auth/login").send({
            email: authorUser.email,
            password: authorUser.password
        })
        authorToken = loginRes.body.data.accessToken

        const readerRes = await request(app).post("/api/auth/register").send(readerUser)
        readerToken = readerRes.body.data.accessToken
    })

    afterAll(async () => {
        await prisma.book.deleteMany({ where: { author: { email: authorUser.email }}})
        await prisma.refreshToken.deleteMany({
            where: { user: { email: { in: [authorUser.email, readerUser.email]}}}
        })
        await prisma.user.deleteMany({
            where: {
                email: {
                    in: [authorUser.email, readerUser.email]
                }
            }
        })
    })

    describe("POST /api/books", () => {
        it("should create book as AUTHOR", async () => {
            const res = await request(app).post("/api/books").set("Authorization", `Bearer ${authorToken}`).send(
                { title: "Test book", description: "Test description"}
            )

            expect(res.status).toBe(201)
            expect(res.body.data.title).toBe("Test book")
            expect(res.body.data).toHaveProperty("slug")

            createdBookId = res.body.data.id
            createdBookSlug = res.body.data.slug
        })

        it("should return 403 for READER role", async () => {
            const res = await request(app).post("/api/books").set("Authorization", `Bearer ${readerToken}`).send({ title: "Hacked Book"})
            expect(res.status).toBe(403)
        })

        it("should return 401 without token", async () => {
            const res = await request(app).post("/api/books").send({title: "No Auth Book"})

            expect(res.status).toBe(401)
        })
    })

    describe("GET /api/books", () => {
        it("should return book list (public)", async () => {
            const res = await request(app).get("/api/books")

            expect(res.status).toBe(200)
            expect(Array.isArray(res.body.data)).toBe(true)
            expect(res.body).toHaveProperty("pagination")
        })

        it("should support pagination params", async () => {
            const res = await request(app).get("/api/books?page=1&limit=5")

            expect(res.status).toBe(200)
            expect(res.body.pagination.limit).toBe(5)
            expect(res.body.pagination.page).toBe(1)
        })
    })

    describe("GET /api/books/:slug", () => {
        it("should return book detail", async () => {
            const res = await request(app).get(`/api/books/${createdBookSlug}`)

            expect(res.status).toBe(200)
            expect(res.body.data.slug).toBe(createdBookSlug)
        })

        it("should return 404 for non-existent slug", async () => {
            const res = await request(app).get("/api/books/this-does-not")

            expect(res.status).toBe(404)
        })
    })

    describe("PATCH /api/books/:id", () => {
        it("should update book as owner", async () => {
            const res = await request(app).patch(`/api/books/${createdBookId}`).set("Authorization", `Bearer ${authorToken}`).send(
                {description: "Updated description"}
            )

            expect(res.status).toBe(200)
            expect(res.body.data.description).toBe("Updated description")
        })

        it("should return 403 for non-owner", async () => {
            const res = await request(app).patch(`/api/books/${createdBookId}`).set("Authorization", `Bearer ${readerToken}`).send({
                description: "Hacked"
            })

            expect(res.status).toBe(403)
        })
    })

    describe("DELETE /api/books/:id", () => {
        it("should delete book as owner", async () => {
            const res = await request(app).delete(`/api/books/${createdBookId}`).set("Authorization", `Bearer ${authorToken}`)

            expect(res.status).toBe(200)
        })

        it("should return 404 after deletion", async () => {
            const res = await request(app).get(`/api/books/${createdBookSlug}`)
            expect(res.status).toBe(404)
        })
    })
})