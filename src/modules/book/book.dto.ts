import { BookStatus } from "../../generated/prisma/enums.js"

export interface CreateBookDto {
    title: string
    description?: string
    genreIds?: string[]
}

export interface UpdateBookDto {
    title?: string
    description?: string
    status?: BookStatus
    isPublished?: boolean
    genreIds?: string[]
}

export interface BookQuery {
    page?: number
    limit?: number
    status?: string
    genreId?: string
    authorId?: string
    search?: string
}
