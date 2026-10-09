import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import type { branchListType, designationListType, roleListType } from "@/Types/tenantCreateType";
import { getDesignationById, getDesignationList, getRoleById, getRoleList, getTenantBranchById, getTenantBranchList } from "@/api/endpoints";
import { toast } from "@/components/ui/toast";

export const TenantContext = createContext<any | null>(null)


export const TenantContextProvider = ({children} : {children : React.ReactNode})=>{
    const { isLoggedIn } = useContext(AuthContext)
    const [branchList, setBranchList] = useState<branchListType[]>([])
    const [skip, setSkip] = useState<number>(0)
    const [take, setTake] = useState<number>(3)
    const [totalBranches, setTotalBranches] = useState<number>(0)

    const [selectedBranch, setSelectedBranch] = useState<branchListType | null>(null)
    const [viewBranchModalOpen, setViewBranchModalOpen] = useState<boolean>(false)
    const [editBranchModalOpen, setEditBranchModalOpen] = useState<boolean>(false)

    const [designationList, setDesignationList] = useState<designationListType[]>([])
    const [designationSkip, setDesignationSkip] = useState<number>(0)
    const [designationTake, setDesignationTake] = useState<number>(3)
    const [totalDesignations, setTotalDesignations] = useState<number>(0)

    const [selectedDesignation, setSelectedDesignation] = useState<designationListType | null>(null)
    const [viewDesignationModalOpen, setViewDesignationModalOpen] = useState<boolean>(false)
    const [editDesignationModalOpen, setEditDesignationModalOpen] = useState<boolean>(false)

    const [roleList, setRoleList] = useState<roleListType[]>([])
    const [roleSkip, setRoleSkip] = useState<number>(0)
    const [roleTake, setRoleTake] = useState<number>(3)
    const [totalRoles, setTotalRoles] = useState<number>(0)

    const [selectedRole, setSelectedRole] = useState<roleListType | null>(null)
    const [viewRoleModalOpen, setViewRoleModalOpen] = useState<boolean>(false)
    const [editRoleModalOpen, setEditRoleModalOpen] = useState<boolean>(false)

        const fetchTenantBranchList = async (skip: number, take: number) => {
        try {
            const data = await getTenantBranchList(skip, take)
            if (data?.success) {
                setBranchList(data?.data)
                setTotalBranches(data?.count)
            }
        } catch (err: any) {
            toast.add({
                type: 'error',
                description: err?.response?.data?.message
            })
        }
    }

    const fetchTenantBranchById = async (branchId: number) => {
        try {
            const data = await getTenantBranchById(branchId)
            if (data?.success) {
                setSelectedBranch(data?.data)
            }
        } catch (err: any) {
            toast.add({
                type: 'error',
                description: err?.response?.data?.message
            })
        }
    }

    const openViewBranch = async (branchId: number) => {
        await fetchTenantBranchById(branchId)
        setViewBranchModalOpen(true)
    }

    const openEditBranch = async (branchId: number) => {
        await fetchTenantBranchById(branchId)
        setEditBranchModalOpen(true)
    }

    const closeAllModals = () => {
        setViewBranchModalOpen(false)
        setEditBranchModalOpen(false)
        setSelectedBranch(null)
    }

    const fetchDesignationList = async (skip: number, take: number) => {
        try {
            const data = await getDesignationList(skip, take)
            if (data?.success) {
                setDesignationList(data?.data)
                setTotalDesignations(data?.count)
            }
        } catch (err: any) {
            toast.add({
                type: 'error',
                description: err?.response?.data?.message
            })
        }
    }

    const fetchDesignationById = async (designationId: number) => {
        try {
            const data = await getDesignationById(designationId)
            if (data?.success) {
                setSelectedDesignation(data?.data)
            }
        } catch (err: any) {
            //designation details endpoint responds with 302, payload still carries the record
            const payload = err?.response?.data
            if (payload?.success && payload?.data) {
                setSelectedDesignation(payload?.data)
            } else {
                toast.add({
                    type: 'error',
                    description: payload?.message
                })
            }
        }
    }

    const openViewDesignation = async (designationId: number) => {
        await fetchDesignationById(designationId)
        setViewDesignationModalOpen(true)
    }

    const openEditDesignation = async (designationId: number) => {
        await fetchDesignationById(designationId)
        setEditDesignationModalOpen(true)
    }

    const closeAllDesignationModals = () => {
        setViewDesignationModalOpen(false)
        setEditDesignationModalOpen(false)
        setSelectedDesignation(null)
    }

    const fetchRoleList = async (skip: number, take: number) => {
        try {
            const data = await getRoleList(skip, take)
            if (data?.success) {
                setRoleList(data?.data)
                setTotalRoles(data?.count)
            }
        } catch (err: any) {
            toast.add({
                type: 'error',
                description: err?.response?.data?.message
            })
        }
    }

    const fetchRoleById = async (roleId: number) => {
        try {
            const data = await getRoleById(roleId)
            if (data?.success) {
                setSelectedRole(data?.data)
            }
        } catch (err: any) {
            //role details endpoint responds with 302, payload still carries the record
            const payload = err?.response?.data
            if (payload?.success && payload?.data) {
                setSelectedRole(payload?.data)
            } else {
                toast.add({
                    type: 'error',
                    description: payload?.message
                })
            }
        }
    }

    const openViewRole = async (roleId: number) => {
        await fetchRoleById(roleId)
        setViewRoleModalOpen(true)
    }

    const openEditRole = async (roleId: number) => {
        await fetchRoleById(roleId)
        setEditRoleModalOpen(true)
    }

    const closeAllRoleModals = () => {
        setViewRoleModalOpen(false)
        setEditRoleModalOpen(false)
        setSelectedRole(null)
    }

    useEffect(() => {
        fetchTenantBranchList(skip, take)
    }, [isLoggedIn, skip, take])
    return (
        <TenantContext.Provider value={{
            branchList, skip, take, setSkip, totalBranches, fetchTenantBranchList,
            selectedBranch, setSelectedBranch,
            viewBranchModalOpen, setViewBranchModalOpen,
            editBranchModalOpen, setEditBranchModalOpen,
            fetchTenantBranchById, openViewBranch, openEditBranch, closeAllModals,
            designationList, designationSkip, setDesignationSkip, designationTake, setDesignationTake, totalDesignations, fetchDesignationList,
            selectedDesignation, setSelectedDesignation,
            viewDesignationModalOpen, setViewDesignationModalOpen,
            editDesignationModalOpen, setEditDesignationModalOpen,
            fetchDesignationById, openViewDesignation, openEditDesignation, closeAllDesignationModals,
            roleList, roleSkip, setRoleSkip, roleTake, setRoleTake, totalRoles, fetchRoleList,
            selectedRole, setSelectedRole,
            viewRoleModalOpen, setViewRoleModalOpen,
            editRoleModalOpen, setEditRoleModalOpen,
            fetchRoleById, openViewRole, openEditRole, closeAllRoleModals
        }}>
            {children}
        </TenantContext.Provider>
    )
}
