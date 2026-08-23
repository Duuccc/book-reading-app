import type { ButtonHTMLAttributes } from "react";
import { Loader2 } from "lucide-react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>{
    variant?: "primary" | "secondary" | "ghost" | "danger"
    size?: "sm" | "md" | "lg"
    loading?: boolean
}

const variants = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white",
    secondary: "bg-gray-800 hover:bg-gray-700 text-gray-100",
    ghost: "hover:bg-gray-800 text-gray-400 hover:text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white"
}

const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
}

export default function Button({
    variant = "primary",
    size = "md",
    loading,    
    children,
    disabled,
    className='',
    ...props
}: Props) {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={`
                inline-flex items-center justify-center gap-2 rounded-lg font-medium
                transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed
                ${variants[variant]} ${sizes[size]} ${className}    
            `}
        >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {children}
        </button>
    )
}
