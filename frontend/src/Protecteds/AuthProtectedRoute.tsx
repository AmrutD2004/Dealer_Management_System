
import { AuthContext } from '@/Contexts/AuthContext'
import { Loader2 } from 'lucide-react'
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'

const AuthProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoggedIn } = useContext(AuthContext)
    if (!isAuthenticated) {
        return (
            <div className='max-w-7xl mx-auto'>
                <div className='min-h-screen flex items-center justify-center'>
                    <span className='text-3xl font-medium tracking-tight flex items-center gap-2'><Loader2 size={38} className='animate-spin' />Verifing Session...</span>
                </div>
            </div>
        )
    }
    if (!isLoggedIn) {
        return <Navigate to={'/login'} />
    }
    return children
}

export default AuthProtectedRoute
