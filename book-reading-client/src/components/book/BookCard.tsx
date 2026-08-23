import { Link } from "react-router-dom";
import { BookOpen, Star } from "lucide-react";
import type {Book} from "../../types/index"

const statusConfig = {
    COMPLETED: { label: "Completed", className: "bg-green-500/20 text-green-400" },
    ONGOING: { label: "On-going", className: "bg-blue-500/20 text-blue-400"},
    HIATUS: { label: "Hiatus", className: "bg-yellow-500/20 text-yellow-400"}
}

export default function BookCard({ book }: {book: Book}) {
    const status = statusConfig[book.status]

    return (
        <Link to={`/books/${book.slug}`} className="group">
            <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-primary-500/50 transition-all duration-200">
                <div className="aspect-[2/3] bg-gray-800 relative overflow-hidden">
                    {book.coverUrl ? (
                        <img 
                            src={book.coverUrl}
                            alt={book.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                            <BookOpen size={32} className="text-gray-600" />
                            <span className="text-gray-600 text-xs text-center px-2 line-clamp-2">
                                {book.title}
                            </span>
                        </div>
                    )}
                    <span className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full fonr-medium ${status.className}`}>
                        {status.label}
                    </span>
                </div>

                <div className="p-3 space-y-1">
                    <h3 className="font-medium text-sm line-clamp-2 text-gray-100">{book.title}</h3>
                    <p className="text-gray-500 text-xs">{book.author.username}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{book._count.chapters} chapters</span>
                        {book._count.reviews > 0 && (
                            <span className="flex items-center gap-0.5">
                                <Star size={10} className="fill-yellow-400 text-yellow-400" />
                                {book._count.reviews}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    )
}