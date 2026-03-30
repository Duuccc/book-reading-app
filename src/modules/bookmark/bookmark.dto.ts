export const BookmarkType = {
    BOOK: "book",
    CHAPTER: "chapter"
} as const 

export type BookmarkType = typeof BookmarkType[keyof typeof BookmarkType]

export interface CreateBookmarkDto {
    bookId: string
    chapterId?: string
}

export interface BookmarkQuery{
    type?: BookmarkType
    page?: number
    limit?: number
}