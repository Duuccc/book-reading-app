import { describe, it, expect } from "vitest";
import { generateSlug } from "../../utils/slugGenerator.js";

describe("generateSlug", () => {
    it("should convert to lowercase", () => {
        expect(generateSlug("Hello World")).toBe('hello-world')
    })

    it("should replace spaces with hyphens", () => {
        expect(generateSlug("book title here")).toBe("book-title-here")
    })

    it("should remove Vietnamese diacritics", () => {
        expect(generateSlug("Đắc Nhân Tâm")).toBe("dac-nhan-tam")
    })

    it("should handle multiple spaces", () => {
        expect(generateSlug("hello    world")).toBe("hello-world")
    })

    it("should remove special characters", () => {
        expect(generateSlug("Hello! World@2024")).toBe("hello-world2024")
    })

    it("should handle empty string", () => {
        expect(generateSlug("")).toBe("")
    })
})