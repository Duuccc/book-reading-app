export interface CreateChapterDto {
    title: string
    chapterNumber: number
    content: string
    isPublished?: boolean
}

export interface UpdateChapterDto {
    title?: string
    content?: string
    isPublished?: string
}

export interface ChapterQuery {
    page?: number
    limit?: number
}