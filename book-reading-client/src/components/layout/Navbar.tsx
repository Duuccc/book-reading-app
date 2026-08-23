import {Link, useNavigate, useLocation} from "react-router-dom"
import { BookOpen, Search, Library, LogOut, User } from "lucide-react"
import { useAuthStore } from "../../stores/auth.store"
import api from "../../api/axios"
import toast from "react-hot-toast"

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuthStore()
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = async () => {  
        const refreshToken = localStorage.getItem("refreshToken")
        try{
            await api.post("/auth/logout", { refreshToken })
        } catch {}
        logout()
        toast.success("Logout")
        navigate("/login")
    }

    const isActive = (path: string) => 
        location.pathname === path ? "text-white" : "text-gray-400 hover:text-white"

    return (
        <nav className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 font-bold text-lg">
                    <BookOpen size={22} className="text-primary-500" />
                    <span className="hidden sm:block">BookApp</span>
                </Link>

            {/* Nav links */}
                <div className="flex items-center gap-1">
                    <Link to="/search" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive('/search')}`}>
                        <Search size={16} />
                        <span className="hidden sm:block">Tìm kiếm</span>
                    </Link>
                    {isAuthenticated && (
                        <Link to="/library" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${isActive('/library')}`}>
                            <Library size={16} />
                            <span className="hidden sm:block">Thư viện</span>
                        </Link>
                    )}  
                </div>

                {/* Auth */}
                <div className="flex items-center gap-2">
                    {isAuthenticated ? (
                        <>
                            <span className="text-sm text-gray-400 hidden sm:block">{user?.username}</span>
                            <button onClick={handleLogout}
                                className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login"
                                className="text-sm text-gray-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors">
                                Đăng nhập
                            </Link>
                            <Link to="/register"
                                className="text-sm px-4 py-1.5 bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors font-medium">
                                 Đăng ký
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
  );

}