export interface RegisterDto{
    email: string
    username: string
    password: string
}

export interface LoginDto{
    email: string
    password: string
}

type User = {
    id: string
    email: string
    username: string
    role: string
    createdAt: Date
}

export interface AuthResponse {
    user: User
    accessToken: string
    refreshToken: string
}


