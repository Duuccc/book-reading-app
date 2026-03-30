export const ReviewSort = {
    LATEST: "latest",
    HIGHEST: "highest",
    LOWEST: "lowest",
} as const

export type ReviewSort = typeof ReviewSort[keyof typeof ReviewSort]

export interface CreateReviewDto{
    bookId: string
    rating: number
    content?: string
}

export interface UpdateReviewDto {
    rating?: number
    content?: string
}

export interface ReviewQuery {
    page?: number
    limit?: number
    sort?: ReviewSort
}