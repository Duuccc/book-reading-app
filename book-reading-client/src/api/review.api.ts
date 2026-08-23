import api from "./axios.js"
import type { Review, ReviewStats, Pagination } from "../types/index.js"

export const reviewApi = {
    getReviews: (bookId: string, params?: Record<string, unknown>) => 
        api.get<{ data: Review[]; stats: ReviewStats; pagination: Pagination }>(
            `/books/${bookId}/reviews`, { params }
        ).then(r => r.data),

    createReview: (bookId: string, rating: number, content?: string) =>
        api.post<{ data: Review }>(`/books/${bookId}/reviews`, { rating, content }).then(r => r.data.data),
    
    getMyReview: (bookId: string) => 
        api.get<{ data: Review | null }>(`/books/${bookId}/reviews/my-review`).then(r => r.data.data) 
}