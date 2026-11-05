import { createContext, useContext, useEffect, useState } from "react";
import { getErrorMessage } from "@/lib/utils"
import { AuthContext } from "../AuthContext";
import type { PlatformUsersListType } from "@/Types/platformUserType";
import { toast } from "@/components/ui/toast";
import { getPermissionById, getPermissionList, getPlatformUserList, getTenantById, getTenantList } from "@/api/endpoints";
import { type tenantType, type tenantDetailType } from "@/Types/tenantCreateType";
import type { PermissionConfirmActionType, PermissionListType } from "@/Types/permissionType";

interface ConfirmActionState {
    type: 'suspend' | 'deactivate' | 'activate'
    tenantId: number
    tenantName: string
}

interface PlatformUserContextValue {
    platformUserCount: number
    platformUserSkip: number
    platformUserTake: number
    setPlatformUserSkip: React.Dispatch<React.SetStateAction<number>>
    setPlatformUserTake: React.Dispatch<React.SetStateAction<number>>
    platformUsersList: PlatformUsersListType[]
    activePlatformUserCount: number
    fetchPlatformUsersList: (skip: number, take: number) => Promise<void>

    tenantSkip: number
    tenantTake: number
    tenantList: tenantType[]
    totalTenantCount: number
    setTenantSkip: React.Dispatch<React.SetStateAction<number>>
    setTenantTake: React.Dispatch<React.SetStateAction<number>>
    fetchTenantsList: (skip: number, take: number) => Promise<void>
    selectedTenant: tenantDetailType | null
    setSelectedTenant: React.Dispatch<React.SetStateAction<tenantDetailType | null>>
    viewTenantModalOpen: boolean
    setViewTenantModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    editTenantModalOpen: boolean
    setEditTenantModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    confirmActionModalOpen: boolean
    setConfirmActionModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    confirmAction: ConfirmActionState | null
    setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmActionState | null>>
    openViewTenant: (tenantId: number) => Promise<void>
    openEditTenant: (tenantId: number) => Promise<void>
    openConfirmAction: (type: ConfirmActionState['type'], tenantId: number, tenantName: string) => void
    closeAllModals: () => void

    permissionSkip: number
    permissionTake: number
    permissionsList: PermissionListType[]
    totalPermissionCount: number
    setPermissionSkip: React.Dispatch<React.SetStateAction<number>>
    setPermissionTake: React.Dispatch<React.SetStateAction<number>>
    fetchPermissionsList: (skip: number, take: number) => Promise<void>
    selectedPermission: PermissionListType | null
    setSelectedPermission: React.Dispatch<React.SetStateAction<PermissionListType | null>>
    viewPermissionModalOpen: boolean
    setViewPermissionModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    editPermissionModalOpen: boolean
    setEditPermissionModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    permissionConfirmActionModalOpen: boolean
    setPermissionConfirmActionModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    permissionConfirmAction: PermissionConfirmActionType | null
    setPermissionConfirmAction: React.Dispatch<React.SetStateAction<PermissionConfirmActionType | null>>
    openViewPermission: (permissionId: number) => Promise<void>
    openEditPermission: (permissionId: number) => Promise<void>
    openPermissionConfirmAction: (type: string, permissionId: number, permissionName: string) => void
    closeAllPermissionModals: () => void
}

export const PlatformUserContext = createContext<PlatformUserContextValue>(
    undefined as unknown as PlatformUserContextValue
)


export const PlatformUserContextProvider = ({ children }: { children: React.ReactNode }) => {
    const { isLoggedIn } = useContext(AuthContext)
    const [platformUsersList, setPlatformUsersList] = useState<PlatformUsersListType[]>([])
    const [platformUserSkip, setPlatformUserSkip] = useState<number>(0)
    const [platformUserTake, setPlatformUserTake] = useState<number>(9)
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
        } catch (err) {
            console.error(err)
            toast.add({
                type: 'error',
                description: getErrorMessage(err)
            })
        }
    }

    useEffect(() => {
        fetchPlatformUsersList(platformUserSkip, platformUserTake)
    }, [isLoggedIn, platformUserSkip, platformUserTake])


    const [tenantList, setTenantList] = useState<tenantType[]>([])
    const [tenantSkip, setTenantSkip] = useState<number>(0)
    const [tenantTake, setTenantTake] = useState<number>(9)
    const [totalTenantCount, setTotalTenantCount] = useState(0)

    const [selectedTenant, setSelectedTenant] = useState<tenantDetailType | null>(null)
    const [viewTenantModalOpen, setViewTenantModalOpen] = useState(false)
    const [editTenantModalOpen, setEditTenantModalOpen] = useState(false)
    const [confirmActionModalOpen, setConfirmActionModalOpen] = useState(false)
    const [confirmAction, setConfirmAction] = useState<ConfirmActionState | null>(null)

    const fetchTenantsList = async (skip: number, take: number) => {
        try {
            const data = await getTenantList(skip, take)
            if (data?.success) {
                setTenantList(data?.data)
                setTotalTenantCount(data?.count)
            }
        } catch (error) {
            toast.add({
                type: 'error',
                description: getErrorMessage(error)
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
        } catch (error) {
            toast.add({
                type: 'error',
                description: getErrorMessage(error)
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

    const openConfirmAction = (type: ConfirmActionState['type'], tenantId: number, tenantName: string) => {
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


    const [permissionsList, setPermissionsList] = useState<PermissionListType[]>([])
    const [permissionSkip, setPermissionSkip] = useState<number>(0)
    const [permissionTake, setPermissionTake] = useState<number>(9)
    const [totalPermissionCount, setTotalPermissionCount] = useState(0)

    const [selectedPermission, setSelectedPermission] = useState<PermissionListType | null>(null)
    const [viewPermissionModalOpen, setViewPermissionModalOpen] = useState(false)
    const [editPermissionModalOpen, setEditPermissionModalOpen] = useState(false)
    const [permissionConfirmActionModalOpen, setPermissionConfirmActionModalOpen] = useState(false)
    const [permissionConfirmAction, setPermissionConfirmAction] = useState<PermissionConfirmActionType | null>(null)

    const fetchPermissionsList = async (skip: number, take: number) => {
        try {
            const data = await getPermissionList(skip, take)
            if (data?.success) {
                setPermissionsList(data?.data)
                setTotalPermissionCount(data?.totalCount)
            }
        } catch (error) {
            toast.add({
                type: 'error',
                description: getErrorMessage(error)
            })
        }
    }
    useEffect(() => {
        fetchPermissionsList(permissionSkip, permissionTake)
    }, [isLoggedIn, permissionSkip, permissionTake])

    const fetchPermissionById = async (permissionId: number) => {
        try {
            const data = await getPermissionById(permissionId)
            if (data?.success) {
                setSelectedPermission(data?.data)
            }
        } catch (error) {
            toast.add({
                type: 'error',
                description: getErrorMessage(error)
            })
        }
    }

    const openViewPermission = async (permissionId: number) => {
        await fetchPermissionById(permissionId)
        setViewPermissionModalOpen(true)
    }

    const openEditPermission = async (permissionId: number) => {
        await fetchPermissionById(permissionId)
        setEditPermissionModalOpen(true)
    }

    const openPermissionConfirmAction = (type: string, permissionId: number, permissionName: string) => {
        setPermissionConfirmAction({ type, permissionId, permissionName } as PermissionConfirmActionType)
        setPermissionConfirmActionModalOpen(true)
    }

    const closeAllPermissionModals = () => {
        setViewPermissionModalOpen(false)
        setEditPermissionModalOpen(false)
        setPermissionConfirmActionModalOpen(false)
        setPermissionConfirmAction(null)
        setSelectedPermission(null)
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
            openViewTenant, openEditTenant, openConfirmAction, closeAllModals,

            permissionSkip, permissionTake, permissionsList, totalPermissionCount, setPermissionSkip, setPermissionTake, fetchPermissionsList,
            selectedPermission, setSelectedPermission,
            viewPermissionModalOpen, setViewPermissionModalOpen,
            editPermissionModalOpen, setEditPermissionModalOpen,
            permissionConfirmActionModalOpen, setPermissionConfirmActionModalOpen,
            permissionConfirmAction, setPermissionConfirmAction,
            openViewPermission, openEditPermission, openPermissionConfirmAction, closeAllPermissionModals
        }}>
            {children}
        </PlatformUserContext.Provider>
    )
}