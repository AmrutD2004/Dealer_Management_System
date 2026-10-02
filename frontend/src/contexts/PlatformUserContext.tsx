import { getPlatformUsersList, getTenantList, isAuth } from "@/api/endpoint";
import { toast } from "@/components/ui/toast";
import type { platformUserInfo } from "@/Types/platformUserType";
import type { tenantType } from "@/Types/tenantTypes";
import React, { createContext, useCallback, useEffect, useState } from "react";

export const PlatformUserContext = createContext<any | null>(null)
export const PlatformUserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [platformUserInfo, setPlatformUserInfo] = useState<platformUserInfo | null>(null)
    const [tenantList, setTenantList] = useState<tenantType[]>([])
    const [totalTenantCount, setTotalTenantCount] = useState<number>(0)
    const [platfornUserList , setPlatformUserList] = useState<platformUserInfo[]>([])
    const [platformUserCount , setPlatformUserCount] = useState<number>(0)
    
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
    useEffect(() => {
        isUserAuthenticated()
    }, [])

    const [skip, setSkip] = useState<number>(0)
    const [take, setTake] = useState<number>(3)

    const [platformUserSkip, setPlatformUserSkip] = useState<number>(0)
    const [platformUserTake, setPlatformUserTake] = useState<number>(3)
    const fetchPlatformUsersList = async(platformUserSkip : number, platformUserTake : number) => {
        try {
            const data = await getPlatformUsersList(platformUserSkip, platformUserTake);
            if (data?.success) {
                setPlatformUserList(data?.data)
                setPlatformUserCount(data?.count)
            }
        } catch (error : any) {
            toast.add({
                type: 'error',
                description: error?.response?.data?.message
            })
        }
    }

    useEffect(() => {
        fetchPlatformUsersList(platformUserSkip, platformUserTake)
    },[isLoggedIn, platformUserSkip, platformUserTake])


    const fetchTenantList = useCallback(async (skip: number, take: number) => {
        try {
            const data = await getTenantList(skip, take)
            if (data?.success) {
                setTenantList(data?.data)
                setTotalTenantCount(data?.count)
            }
        } catch (error: any) {
            toast.add({
                type: 'error',
                description: error?.response?.data?.message
            })
        }
    }, [])
    useEffect(() => {
        fetchTenantList(skip, take)
    }, [isLoggedIn, fetchTenantList, skip, take])
    return (
        <PlatformUserContext.Provider value={{
            isLoggedIn, setIsLoggedIn, isAuthenticated, setIsAuthenticated, platformUserInfo, tenantList, totalTenantCount, fetchTenantList, setSkip, setTake, take, skip , fetchPlatformUsersList , platformUserCount , platfornUserList, platformUserSkip, platformUserTake, setPlatformUserSkip, setPlatformUserTake
        }}>
            {children}
        </PlatformUserContext.Provider>
    )
}