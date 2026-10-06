import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import type { PlatformUsersListType } from "@/Types/platformUserType";
import { toast } from "@/components/ui/toast";
import { getPlatformUserList, getTenantById, getTenantList } from "@/api/endpoints";
import { type tenantType, type tenantDetailType } from "@/Types/tenantCreateType";

export const PlatformUserContext = createContext<any | null>(null)


export const PlatformUserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { isLoggedIn } = useContext(AuthContext)
    const [platformUsersList, setPlatformUsersList] = useState<PlatformUsersListType[]>([])
    const [platformUserSkip, setPlatformUserSkip] = useState<number>(0)
    const [platformUserTake, setPlatformUserTake] = useState<number>(3)
    const [platformUserCount, setPlatformUserCount] = useState<number>(0)
    const [activePlatformUserCount, setActivePlatformUserCount] = useState<number>(0)

    const fetchPlatformUsersList = async (skip: number, take: number) => {
        try {
            const data = await getPlatformUserList(skip, take)
            if (data?.success) {
                setPlatformUsersList(data?.data)
                setPlatformUserCount(data?.totalCount)
                setActivePlatformUserCount(data?.totalActiveCount)
            }
        } catch (err: any) {
            console.error(err)
            toast.add({
                type: 'error',
                description: err?.response?.data?.message
            })
        }
    }

    useEffect(() => {
        fetchPlatformUsersList(platformUserSkip, platformUserTake)
    }, [isLoggedIn, platformUserSkip, platformUserTake])


    const [tenantList, setTenantList] = useState<tenantType[]>([])
    const [tenantSkip, setTenantSkip] = useState<number>(0)
    const [tenantTake, setTenantTake] = useState<number>(3)
    const [totalTenantCount, setTotalTenantCount] = useState(0)

    const [selectedTenant, setSelectedTenant] = useState<tenantDetailType | null>(null)
    const [viewTenantModalOpen, setViewTenantModalOpen] = useState(false)
    const [editTenantModalOpen, setEditTenantModalOpen] = useState(false)
    const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false)
    const [confirmAction, setConfirmAction] = useState<{ type: string; tenantId: number; tenantName: string } | null>(null)

    const fetchTenantsList = async (skip: number, take: number) => {
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
    }
    useEffect(() => {
        fetchTenantsList(tenantSkip, tenantTake)
    }, [isLoggedIn, tenantSkip, tenantTake])

    const fetchTenantById = async (tenantId: number) => {
        try {

            const data = await getTenantById(tenantId)
            if (data?.success) {
                setSelectedTenant(data?.data)
            }
        } catch (error: any) {
            toast.add({
                type: 'error',
                description: error?.response?.data?.message
            })
        }
    }

    const openViewTenant = async (tenantId: number) => {
        await fetchTenantById(tenantId)
        setViewTenantModalOpen(true)
    }

    const openEditTenant = async (tenantId: number) => {
        await fetchTenantById(tenantId)
        setEditTenantModalOpen(true)
    }

    const openConfirmAction = (type: string, tenantId: number, tenantName: string) => {
        setConfirmAction({ type, tenantId, tenantName })
        setConfirmActionModalOpen(true)
    }

    const closeAllModals = () => {
        setViewTenantModalOpen(false)
        setEditTenantModalOpen(false)
        setConfirmActionModalOpen(false)
        setConfirmAction(null)
        setSelectedTenant(null)
    }

    return (
        <PlatformUserContext.Provider value={{
            platformUserCount, platformUserSkip, platformUserTake, setPlatformUserSkip, platformUsersList, setPlatformUserTake, fetchPlatformUsersList, activePlatformUserCount,

            tenantSkip, tenantTake, tenantList, totalTenantCount, setTenantSkip, setTenantTake, fetchTenantsList,
            selectedTenant, setSelectedTenant,
            viewTenantModalOpen, setViewTenantModalOpen,
            editTenantModalOpen, setEditTenantModalOpen,
            confirmActionModalOpen, setConfirmActionModalOpen,
            confirmAction, setConfirmAction,
            openViewTenant, openEditTenant, openConfirmAction, closeAllModals
        }}>
            {children}
        </PlatformUserContext.Provider>
    )
}