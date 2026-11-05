import { isAuthenticatedUser } from "@/api/endpoints";
import { toast } from "@/components/ui/toast";
import { getErrorMessage } from "@/lib/utils";
import type { userInfoType } from "@/Types/userInfoType";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Hashids from 'hashids'

interface AuthContextValue {
    isLoggedIn: boolean
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    isAuthenticated: boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    userInfo: userInfoType | null
    userType: string
    hashId: string
}

export const AuthContext = createContext<AuthContextValue>(
    undefined as unknown as AuthContextValue
)


export const AuthContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [userInfo, setUserInfo] = useState<userInfoType | null>(null)
    const [userType, setUserType] = useState<string>('')
    const [hashId, sethashId] = useState<string>('')


    useEffect(() => {
        let cancelled = false

        const isUserAuthenticated = async () => {
            try {
                const data = await isAuthenticatedUser()
                if (cancelled) return
                if (data?.success) {
                    setUserInfo(data?.data)
                    setUserType(data?.userType)
                    sethashId(new Hashids(import.meta.env.VITE_HASH_SECRET, 10).encode(data?.data?.tenantId))

                    setIsLoggedIn(true)
                }
            } catch (error: unknown) {
                if (cancelled) return
                // A 401 here simply means there is no active session. That is
                // expected on the login page and should not surface as a toast.
                const isUnauthorized =
                    axios.isAxiosError(error) && error.response?.status === 401
                if (!isUnauthorized) {
                    toast.add({
                        type: 'error',
                        description: getErrorMessage(error),
                    })
                }
                setIsLoggedIn(false)
            } finally {
                if (!cancelled) setIsAuthenticated(true)
            }
        }

        isUserAuthenticated()

        return () => {
            cancelled = true
        }
    }, [isLoggedIn])

    return (
        <AuthContext.Provider value={{
            isLoggedIn, setIsLoggedIn, isAuthenticated, setIsAuthenticated, userInfo, userType, hashId
        }}>
            {children}
        </AuthContext.Provider>
    )
}
