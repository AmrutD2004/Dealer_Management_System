import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import type { branchListType, designationListType } from "@/Types/tenantCreateType";
import { getDesignationById, getDesignationList, getTenantBranchById, getTenantBranchList } from "@/api/endpoints";
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
            fetchDesignationById, openViewDesignation, openEditDesignation, closeAllDesignationModals
        }}>
            {children}
        </TenantContext.Provider>
    )
}
