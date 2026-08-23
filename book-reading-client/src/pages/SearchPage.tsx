import React, { useState, type SubmitEventHandler } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { bookApi } from "../api/book.api";
import BookGrid from "../components/book/BookGrid";

export default function SearchPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [input, setInput] = useState(searchParams.get("q") ?? "")
    const q = input 

    const { data, isLoading } = useQuery({
        queryKey: ["search", q],
        queryFn: () => bookApi.search(q),
        enabled: q.length >= 2
    })

    console.log(data)

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if(input.trim()) setSearchParams({ q: input.trim() })
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <form onSubmit={handleSearch} className="mb-8">
                <div className="relative max-w-xl mx-auto">
                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></Search>
                    <input value={input} onChange={(e) => setInput(e.target.value)}
                        placeholder="Searching book, author,..."
                        className="w-full pl-11 pr-4 py-3 bg-gray-900 text-white border border-gray-700 rounded-xl focus:border-primary-500 focus:outline-none transition"
                    />
                </div>
            </form>

            {q && (
                <div>
                    <p className="text-gray-400 text-sm mb-4">
                        {data ? `${data.pagination.total} results for "${q}"` : "Searching..."} 
                    </p>
                    <BookGrid books={data?.data ?? []} loading={isLoading}></BookGrid>
                </div>
            )}

            {!q && (
                <div className="text-center py-16 text-gray-500">
                    Search your book
                </div>
            )}
        </div>
    )
}