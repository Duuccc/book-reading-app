import api from "./axios.js"
import type { Chapter, ReadingData, Pagination } from "../types/index.js"

export const chapterApi = {
    getChapters: (bookId: string, params?: Record<string, unknown>) => 
        api.get<{ data: Chapter[]; pagination: Pagination }>(`/books/${bookId}/chapters`, { params }).then(r => r.data),

    readChapter: (bookId: string, chapterNumber: number, page = 1) =>
        api.get<{ data: ReadingData }>(`/books/${bookId}/chapters/${chapterNumber}/read`, { params: { page }}).then(r => r.data),

    updateProgress: (bookId: string, chapterId: string, currentPage: number) =>
        api.post("/progress", { bookId, chapterId, currentPage })
}

