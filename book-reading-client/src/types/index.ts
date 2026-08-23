export interface User {
    id: string
    email: string
    username: string
    role: "READER" | "AUTHOR" | "ADMIN"
    avatar?: string
}

export interface Book {
    id: string
    title: string
    slug: string
    description?: string
    coverUrl?: string
    status: "ONGOING" | "COMPLETED" | "HIATUS"
    author: { id: string; username: string; avatar?: string }
    genres: { genre: { id: string; name: string; slug: string } }[]
    _count: { chapters: number; follows: number; reviews: number}
}   

export interface Chapter {
  id: string;
  title: string;
  chapterNumber: number;
  wordCount: number;
  createdAt: string;
}

export interface ReadingData {
  chapter: {
    id: string;
    title: string;
    chapterNumber: number;
    wordCount: number;
    book: { title: string; slug: string };
  };
  reading: {
    content: string;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  navigation: {
    prevChapter: { chapterNumber: number; title: string } | null;
    nextChapter: { chapterNumber: number; title: string } | null;
  };
}

export interface Review {
  id: string;
  rating: number;
  content?: string;
  createdAt: string;
  user: { id: string; username: string; avatar?: string };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  distribution: { star: number; count: number }[];
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}