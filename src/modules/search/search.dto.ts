export interface SearchQuery {
    q: string
    type?: "book" | "author" | "genre"
    genre?: string
    status?: string
    sort?: "relevant" | "latest" | "rating" | "popular"
    page?: number
    limit?: number
}

export interface SearchResult {
    books: unknown[]
    pagination: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
    meta: {
        query: string
        took: number
    }
}