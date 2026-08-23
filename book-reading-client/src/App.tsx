import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import Navbar from "./components/layout/Navbar";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { useAuthStore } from "./stores/auth.store";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import BookDetailPage from "./pages/BookDetailPage";
import ReadingPage from "./pages/ReadingPage";
import SearchPage from "./pages/SearchPage";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000*60*5, retry: 1}
  }
})

export default function App() {
  const {hydrate} = useAuthStore()
  
  useEffect(() => { hydrate() }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-700">
          <Navbar>
          </Navbar>
          <Routes>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/register" element={<RegisterPage />}></Route>
            <Route path="/search" element={<SearchPage />}></Route>
            <Route path="/books/:slug" element={<BookDetailPage />}></Route>
            <Route path="/books/:bookId/read/:chapterNumber" element={<ReadingPage />}></Route>
          </Routes>
        </div>
        <Toaster position="bottom-right" toastOptions={{ style: { background: "#1f2937", color: "#f9fafb", border: '1px solid #374151' } }}></Toaster>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

