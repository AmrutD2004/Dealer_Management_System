import { isAuthenticatedUser } from "@/api/endpoints";
import { toast } from "@/components/ui/toast";
import type { userInfoType } from "@/Types/userInfoType";
import { createContext, useEffect, useState } from "react";
import Hashids from 'hashids'

export const AuthContext = createContext<any | null>(null)


export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [userInfo, setUserInfo] = useState<userInfoType | null>(null)
    const [userType, setUserType] = useState<string>('')
    const [hashId, sethashId] = useState<string>('')


    const hashTenantId = new Hashids(import.meta.env.VITE_HASH_SECRET, 10)
    const isUserAuthenticated = async () => {
        try {
            const data = await isAuthenticatedUser()
            if (data?.success) {
                setUserInfo(data?.data)
                setUserType(data?.userType)
                sethashId(hashTenantId.encode(data?.data?.tenantId))
                
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

    useEffect(() => {
        isUserAuthenticated()
    }, [isLoggedIn])
    return (
        <AuthContext.Provider value={{
            isLoggedIn, setIsLoggedIn, isAuthenticated, setIsAuthenticated, userInfo, userType, hashId
        }}>
            {children}
        </AuthContext.Provider>
    )
}