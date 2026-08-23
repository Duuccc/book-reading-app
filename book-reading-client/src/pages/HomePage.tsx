import { useQuery } from "@tanstack/react-query"
import { bookApi } from "../api/book.api"
import BookGrid from "../components/book/BookGrid"
import { useAuthStore } from "../stores/auth.store"

export default function HomePage() {
    const { isAuthenticated } = useAuthStore()

    const { data: trending, isLoading: trendingLoading } = useQuery({
        queryKey: ["trending"],
        queryFn: bookApi.getTrending,
        staleTime: 1000 * 60 * 5
    })

    const { data: latest, isLoading: latestLoading } = useQuery({
        queryKey: ["books", "latest"],
        queryFn: () => bookApi.getBooks({ sort: "latest", limit: 12 })
    })

    const { data: forYou, isLoading: forYouLoading} = useQuery({
        queryKey: ["for-you"],
        queryFn: bookApi.getForYou,
        enabled: isAuthenticated
    })

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-12">
            <section className="text-center py-12">
                <h1 className="text-xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                    Online Book Store
                </h1>
                <p className='text-gray-400 text-lg'>There are so many interesting books waiting for you</p>
            </section>

            {
                isAuthenticated && (
                    <section>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            For you
                        </h2>
                        <BookGrid books={forYou ?? []} loading={forYouLoading} />
                    </section>
                )
            }

            <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    On Trending
                </h2>
                <BookGrid books={trending ?? []} loading={trendingLoading} />
            </section>

            <section>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    New Updated
                </h2>
                <BookGrid books={latest?.data.data ?? []} loading={latestLoading} />
            </section>
        </div>
    )
}