import api from "./axios.js";
import type { Book, Pagination } from  "../types/index.js"

interface BooksResponse {
    data: Book[]
    pagination: Pagination
}

export const bookApi = {
    getBooks: (params?: Record<string, unknown>) => 
        api.get<{ data: BooksResponse }>("/books", { params }).then(r => r.data),
    
    getBookBySlug: (slug: string) => 
        api.get<{ data: Book }>(`books/${slug}`).then(r => r.data.data),

    getTrending: () => 
        api.get<{ data: Book[] }>("/recommendations/trending").then(r => r.data.data),

    getSimilar: (bookId: string) =>
        api.get<{ data: Book[] }>(`/recommendations/similar/${bookId}`).then(r => r.data.data),

    getForYou: () => 
        api.get<{ data: Book[] }>("/recommendations/for-you").then(r => r.data.data),

    search: (q: string, params?: Record<string, unknown>) => 
        api.get<{ data: Book[]; pagination: Pagination }>("/search", { params: { q, ...params } }).then(r => r.data),

    toggleBookmark: (bookId: string) => 
        api.post<{ data: { bookmarked: boolean } }>(`/bookmarks`, { bookId }).then(r => r.data.data),

    checkBookmark: (bookId: string) => 
        api.get<{ data: { bookmarked: boolean }}>('/bookmarks/check', { params: { bookId }}).then(r => r.data.data),

    toggleFollow: (bookId: string) => 
        api.post<{ data: { following: boolean }}>(`/notifications/follows/${bookId}`, {}).then(r => r.data.data)
}