import BookCard from "./BookCard";
import type { Book } from "../../types/index";

interface Props {
    books: Book[]
    loading?: boolean
}

export default function BookGrid({ books, loading }: Props) {
    if(loading) {
        return (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="bg-gray-800 rounded-xl aspect-[2/3] animate-pulse"></div>
                ))}
            </div>
        )
    }

    if(books.length === 0) {
        return <div className="text-center py-16 text-gray-500">No Book</div>
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {books.map((book) => <BookCard key={book.id} book={book} />)}
        </div>
    )
}


