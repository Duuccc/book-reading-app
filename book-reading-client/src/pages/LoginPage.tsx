import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { BookOpen } from "lucide-react";
import api from "../api/axios"
import { useAuthStore } from "../stores/auth.store"
import Button from "../components/ui/Button";
import toast from "react-hot-toast";

export default function LoginPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { setAuth } = useAuthStore()
    const from = (location.state as { from?: string })?.from ?? "/"

    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({ email: "", password: ""})

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try{
            const {data} = await api.post("/auth/login", form)
            setAuth(data.data.user, data.data.accessToken, data.data.refreshToken)
            toast.success(`Welcome ${data.data.user.username}!`)
            navigate(from, { replace: true })
        } catch {

        }finally{
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-primary-600/20 rounded-2xl mb-4">
                        <BookOpen size={28} className="text-primary-400" />
                    </div>
                    <h1 className="text-2xl font-bold">Login</h1>
                    <p className="text-gray-400 mt-1">Welcome back</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 bg-gray-900 p-6 rounded-2xl border border-gray-800">
                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Email</label>
                        <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-primary-500 focus:outline-none transition text-sm"
                            placeholder="email@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                        <input type="password" required
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg focus:border-primary-500 focus:outline-none transition text-sm"
                            placeholder="********"
                        />
                    </div>
                    
                    <Button type="submit" loading={loading} className="w-full" >
                        Login
                    </Button>

                    <div>
                        <label className="block text-sm text-gray-400 mb-1.5">Password</label>
                    </div>
                </form>

                <p className="text-center text-gray-400 mt-4 text-sm">
                    don't have account?{" "}
                    <Link to="/register" className="text-primary-400 hover:underline">Register</Link>
                </p>
            </div>
        </div>
    )
}