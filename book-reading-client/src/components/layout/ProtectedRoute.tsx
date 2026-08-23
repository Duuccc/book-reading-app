import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../stores/auth.store";
import type React from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuthStore()
    const location = useLocation()

    if(!isAuthenticated){
        return <Navigate to="/login" state={{ from: location.pathname }} replace></Navigate>
    }

    return <>{children}</>
}