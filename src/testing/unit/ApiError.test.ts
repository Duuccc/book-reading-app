import { describe, it, expect } from "vitest"
import { ApiError } from "../../utils/ApiError.js"

describe("ApiError", () => {
    it("should create error with correct statusCode and message", () => {
        const err = new ApiError(400, "Bad request")
        expect(err.statusCode).toBe(400)
        expect(err.message).toBe("Bad request")
        expect(err.isOperational).toBe(true)
    })

    it("should be instance of Error", () => {
        const err = new ApiError(400, "Bad request")
        expect(err).toBeInstanceOf(Error)
    })

    describe("Static methods", () => {
        it("bad request should return 400", () => {
            expect(ApiError.badRequest("msg").statusCode).toBe(400)
        })

        it("unauthorized should return 401", () => {
            expect(ApiError.unauthorized().statusCode).toBe(401)
        })

        it("forbidden should return 403", () => {
            expect(ApiError.forbiddden().statusCode).toBe(403)
        })
    
        it("notFound should return 404", () => {
            expect(ApiError.notFound().statusCode).toBe(404)
        })

        it("should include errors array", () => {
            const errors = [{fields: "email", message: "Invalid"}]
            const err = ApiError.badRequest("Validation failed", errors)
            expect(err.errors).toEqual(errors)
        })
    })
}) 

