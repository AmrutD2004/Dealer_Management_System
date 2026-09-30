import { isAuth } from "@/api/endpoint";
import { toast } from "@/components/ui/toast";
import React, { createContext, useEffect, useState } from "react";

export const PlatformUserContext = createContext<any | null>(null)
type platformUserInfo = {
    id: string,
    email: string,
    passwordHash: string,
    role: string,
    createdAt: Date,
    updatedAt: Date
}
export const PlatformUserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [platformUserInfo, setPlatformUserInfo] = useState<platformUserInfo | null>(null)
    const isUserAuthenticated = async () => {
        try {
            const data = await isAuth()
            if (data?.success) {
                setPlatformUserInfo(data?.data)
                setIsLoggedIn(true)
            }
        } catch (err: any) {
            toast.add({
                type: 'error',
                description: err?.response?.data?.message
            })
            setIsLoggedIn(false)
        } finally {
            setIsAuthenticated(true)
        }
    }
    useEffect(()=>{
        isUserAuthenticated()
    }, [])
    return (
        <PlatformUserContext.Provider value={{
            isLoggedIn, setIsLoggedIn, isAuthenticated, setIsAuthenticated, platformUserInfo
        }}>
            {children}
        </PlatformUserContext.Provider>
    )
}