import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Bookmark, Bell, Star, Clock } from "lucide-react";
import { bookApi } from "../api/book.api";
import { chapterApi } from "../api/chapter.api";
import { reviewApi } from "../api/review.api";
import StarRating from "../components/ui/StarRating";
import Button from "../components/ui/Button";
import { useAuthStore } from "../stores/auth.store";
import toast from "react-hot-toast";

export default function BookDetailPage () {
    const { slug } = useParams<{ slug: string }>()
    const { isAuthenticated } = useAuthStore()
    const queryClient = useQueryClient()

    const { data: book, isLoading } = useQuery({
        queryKey: ["book", slug],
        queryFn: () => bookApi.getBookBySlug(slug!)
    })

    const { data: chapters } = useQuery({
        queryKey: ["chapters", book?.id],
        queryFn: () => chapterApi.getChapters(book!.id),
        enabled: !!book?.id
    })

    const { data: reviewData } = useQuery({
        queryKey: ["reviews", book?.id],
        queryFn: () => reviewApi.getReviews(book!.id),
        enabled: !!book?.id
    })

    console.log('reviewData:', reviewData);

    const { data: bookmarkStatus } = useQuery({
        queryKey: ["bookmark", book?.id],
        queryFn: () => bookApi.checkBookmark(book!.id),
        enabled: !!book?.id && isAuthenticated
    })

    const bookmarkMutation = useMutation({
        mutationFn: () => bookApi.toggleBookmark(book!.id),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["bookmark", book?.id ]})
            toast.success(data.bookmarked ? "Added bookmark" : "Deleted bookmark")
        }
    })

    if(isLoading) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <h1>Somehting wrong</h1>
                    <div className="h-8 bg-gray-800 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-800 rounded w-1/3"></div>
                    <div className="h-32 bg-gray-800 rounded"></div>
                </div>
            </div>
        )
    }

    if(!book) return <div className="text-center py-16 text-gray-400">Not found book</div>

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="flex gap-6 mb-8">
                <div className="w-40 flex-shrink-0">
                    <div className="aspect-[2/3] bg-gray-800 rounded-xl overflow-hidden">
                        {book.coverUrl ? (
                            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <BookOpen size={40} className="text-gray-600"></BookOpen>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 space-y-3">
                    <h1 className="text-2xl font-bold">{book.title}</h1>
                    <p className="text-gray-400">by {book.author.username}</p>

                    <div className="flex flex-wrap gap-2">
                        {book.genres.map(({ genre }) => (
                            <span key={genre.id} className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                                {genre.name}
                            </span>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                            <BookOpen size={14} />
                            {book._count.chapters} chapter
                        </span>
                        {reviewData && (
                            <span className="flex items-center gap-1">
                                <Star size={14} className="fill-yellow-400 text-yellow-400" />
                                {reviewData.stats.averageRating} ({reviewData.stats.totalReviews})
                            </span>
                        )}
                    </div>

                    {isAuthenticated && (
                        <div className="flex gap-2">
                            <Button
                                variant="secondary" size="sm"
                                onClick={() => bookmarkMutation.mutate()}
                                loading={bookmarkMutation.isPending}
                            >
                                <Bookmark size={16} className={bookmarkStatus?.bookmarked ? "fill-current text-primary-400" : ""}></Bookmark>
                                {bookmarkStatus?.bookmarked ? "Bookmarked": "Bookmark"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {book.description && (
                <div className="mb-8">
                    <h2 className="text-lg font-semibold mb-2">Introduction</h2>
                    <p className="text-gray-400 leading-relaxed">{book.description}</p>
                </div>
            )}

            <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Chapter list</h2>
                <div className="space-y-2">
                    {chapters?.data.map((chapter) => (
                        <Link 
                            key={chapter.id}
                            to={`/books/${book.id}/read/${chapter.chapterNumber}`}
                            className="flex items-center justify-between p-3 bg-gray-900 hover:bg-gray-800 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
                        >
                            <span className="text-sm">{chapter.title}</span>
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock size={12}></Clock>
                                {Math.ceil(chapter.wordCount / 200)} reading minutes
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {reviewData && reviewData.data.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-4">
                        Review ({reviewData.stats.totalReviews})
                    </h2>

                    <div className="flex items-center gap-3 mb-4 p-4 bg-gray-900 rounded-xl border border-gray-800">
                        <span className="text-4xl font-bold">{reviewData.stats.averageRating}</span>
                        <div>
                            <StarRating rating={Math.round(reviewData.stats.averageRating)} />
                            <p className="text-sm text-gray-400 mt-1">{reviewData.stats.totalReviews} reviews</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {reviewData.data.map((review) => (
                            <div key={review.id} className="p-4 bg-gray-900 rounded-xl border border-gray-800">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-sm">{review.user.username}</span>
                                    <StarRating rating={review.rating} size={14} />
                                </div>
                                {review.content && <p className="text-gray-400 text-sm">{review.content}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}