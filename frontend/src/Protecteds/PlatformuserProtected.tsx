import DashboardLayout from '@/components/Layout/DashboardLayout'
import { PlatformUserContext } from '@/contexts/PlatformUserContext'
import { Loader2 } from 'lucide-react'
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'

const PlatformuserProtected = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoggedIn } = useContext(PlatformUserContext)
    if (!isAuthenticated) {
        return null
    }
    if (!isLoggedIn) {
        return <Navigate to={'/login'} />
    }
    return children
}

export default PlatformuserProtected
