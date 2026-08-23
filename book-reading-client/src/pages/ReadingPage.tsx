import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { chapterApi } from "../api/chapter.api";
import { useAuthStore } from "../stores/auth.store";
import Button from "../components/ui/Button"

export default function ReadingPage() {
    const { bookId, chapterNumber } = useParams<{ bookId: string; chapterNumber: string}>()
    const navigate = useNavigate()
    const { isAuthenticated } = useAuthStore()
    const [page, setPage] = useState(1)

    const {data, isLoading} = useQuery({
        queryKey: ["reading", bookId, chapterNumber, page],
        queryFn: () => chapterApi.readChapter(bookId!, Number(chapterNumber), page)
    })

    useEffect(() => {
        if(data && isAuthenticated) {
            chapterApi.updateProgress(bookId!, data.data.chapter.id, page).catch(() => {})
        }
    }, [data, page, bookId, isAuthenticated])

    useEffect(() => { setPage(1) }, [chapterNumber])

    if(isLoading){
        return (
            <div className="max-w-3xl mx-auto px-4 py-8 animate-pulse space-y-4">
                <div className="h-6 bg-gray-800 rounded w-1/3"></div>
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-4 bg-gray-800 rounded" ></div>
                ))}
            </div>
        )
    }

    if(!data) return null

    const { chapter, reading, navigation } = data.data

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="mb-8 text-center">
                <Link to={`/books/${chapter.book.slug}`} className="text-gray-400 hover:text-white text-sm flex items-center justify-center gap-1 mb-2">
                    <ArrowLeft size={14} />
                    {chapter.book.title}
                </Link>
                <h1 className="text-xl font-bold">{chapter.title}</h1>
                <p className="text-gray-500 text-sm mt-1">
                    Page {reading.currentPage} / {reading.totalPages}
                </p>
            </div>

            <div className="h-1 bg-gray-800 rounded-full mb-8">
                <div className="h-1 bg-primary-500 rounded-full transition-all duration-300"
                    style={{ width: `${(reading.currentPage / reading.totalPages) * 100}%`}}
                ></div>
            </div>

            <div className="prose prose-invert max-w-none text-gray-200 text-lg leading-8">
                {reading.content.split("\n").map((para, i) => (
                    <p key={i} className="mb-4">{para}</p>
                ))}
            </div>

            <div className="flex items-center justify-center gap-4 mt-12">
                <Button
                    variant="secondary"
                    onClick={() => setPage((p) => p - 1)}
                    disabled={!reading.hasPrevPage}
                >
                    <ChevronLeft size={18} />Previous page
                </Button>

                <span className="text-gray-400 text-sm">
                    {reading.currentPage}/{reading.totalPages}
                </span>

                <Button
                    variant="secondary"
                    onClick={() => setPage((p) => p+1)}
                    disabled={!reading.hasNextPage}
                >
                    Next page <ChevronRight size={18} />
                </Button>
            </div>

            <div className="flex items-center justify-between mt-8 pt-8 border-t border-gray-800">
                <Button
                    variant="ghost"
                    disabled={!navigation.prevChapter}
                    onClick={() => navigation.prevChapter && navigate(`/books/${bookId}/read/${navigation.prevChapter.chapterNumber}`)}
                >
                    ← {navigation.prevChapter?.title ?? "Previous chapter"}
                </Button>

                <Button
                    variant="ghost"
                    disabled={!navigation.nextChapter}
                    onClick={() => navigation.nextChapter && navigate(`/books/${bookId}/read/${navigation.nextChapter.chapterNumber}`)}
                >
                    {navigation.nextChapter?.title ?? "Next chapter"} →
                </Button>
            </div>
        </div>
    )
}