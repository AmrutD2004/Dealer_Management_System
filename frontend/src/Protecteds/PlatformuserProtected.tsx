import DashboardLayout from '@/components/Layout/DashboardLayout'
import { PlatformUserContext } from '@/contexts/platformUserContext'
import { Loader2 } from 'lucide-react'
import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'

const PlatformuserProtected = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isLoggedIn } = useContext(PlatformUserContext)
    if (!isAuthenticated) {
        return (
            <DashboardLayout>
                <div className='max-w-7xl mx-auto'>
                    <div className='flex items-center justify-center min-h-screen'>
                        <h1 className='flex items-center gap-2 text-accent-foreground'><Loader2 size={32} />Verifing Session....</h1>
                    </div>
                </div>
            </DashboardLayout>
        )
    }
    if (!isLoggedIn) {
        return <Navigate to={'/login'} />
    }
    return children
}

export default PlatformuserProtected
