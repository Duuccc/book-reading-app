import prisma from "../../database/prisma.js"
import { ApiError } from "../../utils/ApiError.js"
import { generateUniqueSlug } from "../../utils/slugGenerator.js"
import type { CreateBookDto, UpdateBookDto, BookQuery } from "./book.dto.js"

export class BookService {
    async createBook(authorId: string, data: CreateBookDto){
        const slug = await generateUniqueSlug(
            data.title,
            async (s) => {
                const book = await prisma.book.findUnique({
                    where: { slug: s }
                })
                return book ? true : false
            }
        )

       
        const book = await prisma.book.create({
            data: {
                title: data.title,
                slug,
                description: data.description ?? null,
                authorId,
                ...(data.genreIds?.length && {
                    genres:  {
                        create: data.genreIds.map((genreId) => { return { genreId }})
                    }
                })
            },
            include: {
                author: { select: { id: true, username: true, avatar: true }},
                ...(data.genreIds?.length && {genres: { include: { genre: true }}})
            }
        })
        

        return book
    }

    async getBooks(query: BookQuery) {
        const page = Number(query.page) || 1
        const limit = Number(query.limit) || 20;
        const skip = (page - 1) * limit

        const where: Record<string, unknown> = {
            isPublished: true
        }

        if(query.status) where.status = query.status
        if(query.authorId) where.authorId = query.authorId
        if(query.genreId) {
            where.genres = { some: { genreId: query.genreId }}
        }
        if(query.search) {
            where.title = {contains: query.search, mode: "insensitive"}
        }

        const [books, total] = await Promise.all([
            prisma.book.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: {
                    author: { select: { id: true, username: true, avatar: true }},
                    genres: { include: { genre: true }},
                    _count: { select: { chapters: true }}
                }
            }),
            prisma.book.count({ where })
        ])

        return {
            books,
            pagination : {
                page,
                limit,
                total,
                totalPages: Math.ceil(total/limit)
            }
        }
    }

    async getBookBySlug(slug: string) {
        const book = await prisma.book.findUnique({
            where: { slug: slug },
            include: {
                author: { select: { id: true, username: true, avatar: true }},
                genres: { include: { genre: true }},
                _count: { select: { chapters: true }},
                chapters: {
                    where: { isPublished: true },
                    orderBy: { chapterNumber: "asc" },
                    take: 3,
                    select: { id: true, title: true, chapterNumber: true, createdAt: true }
                }
            }
        })

        if(!book) throw ApiError.notFound("Book not found")
        return book
    }

    async updateBook(bookId: string, userId: string, userRole: string, data: UpdateBookDto){
        const book = await prisma.book.findUnique({
            where: {
                id: bookId
            }
        })

        if(!book) {
            throw ApiError.notFound("Book not found")
        }

        if(book.authorId !== userId && userRole !== "ADMIN"){
            throw ApiError.forbiddden("You do not have privilege to modify this book")
        }

        const { genreIds, ...rest } = data

        const updated = await prisma.book.update({
            where: { id: bookId },
            data: {
                ...(data.title && {title: data.title}),
                ...(data.description && {description: data.description}),
                ...(data.status && {status: data.status}),
                ...(data.isPublished !== undefined && {isPublished: data.isPublished}),

                ...(genreIds && {
                    genres: {
                        deleteMany: {},
                        create: genreIds.map((genreId) => {
                            return { genreId }
                        })
                    }
                })
            },
            include: {
                genres: { include: { genre: true }},
                author: {select:{id: true, username:true}}
            }
        })
        return updated
    }

    async deleteBook(bookId: string, userId: string, userRole:string){
        const book = await prisma.book.findUnique({ where: {  id: bookId }})
        if(!book) {
            throw ApiError.notFound("Book not Found")
        }

        if(book.authorId !== userId && userRole !== "ADMIN"){
            throw ApiError.forbiddden("You do not have privilege to remove this book")
        }

        await prisma.book.delete({
            where: {
                id: bookId
            }
        })
    }
}

export const bookService = new BookService()