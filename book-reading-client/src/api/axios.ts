import axios from "axios"
import toast from "react-hot-toast"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3000/api"
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken")
    if(token) config.headers.Authorization = `Bearer ${token}`
    return config
})

let isRefreshing = false
let queue: { 
    resolve: (v: string) => void
    reject: (e: unknown) => void
}[] = []

const processQueue = (error: unknown, token: string | null = null) => {
    queue.forEach((p) => error ? p.reject(error) : p.resolve(token!))
    queue = []
}

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config //take original request 

        if(error.response?.status === 401 && !original._retry){
            if(isRefreshing) {
                return new Promise((resolve, reject) => {
                    queue.push({ resolve, reject })
                }).then((token) => {
                    original.headers.Authorization = `Bearer ${token}`
                    return api(original)
                })
            }

            original._retry = true
            isRefreshing = true

            try {
                const refreshToken = localStorage.getItem("refreshToken")
                if(!refreshToken) throw new Error("No refresh token")

                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_URL ?? "http://localhost:3000/api"}/auth/refresh`,
                    {refreshToken}
                )

                localStorage.setItem("accessToken", data.data.accessToken)
                localStorage.setItem("refreshToken", data.data.refreshToken)
                processQueue(null, data.data.accessToken)
                original.headers.Authorization = `Bearer ${data.data.accessToken}`
                return api(original)
            } catch (err) {
                processQueue(err, null)
                localStorage.removeItem("accessToken")
                localStorage.removeItem("refreshToken")
                window.location.href = "/login"
                return Promise.reject(err)
            } finally {
                isRefreshing = false
            }
        }

        const message = error.response?.data?.message
        if(error.response?.status !== 401 && message) {
            toast.error(message)
        }

        return Promise.reject(error)
    }
)

export default api