import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getErrorMessage, getErrorResponse } from "@/lib/utils"
import { AuthContext } from "../AuthContext";
import type { branchListType, designationListType, employeeListType, roleListType, rolePermissionMappingType } from "@/Types/tenantCreateType";
import { getAssignedPermissionById, getAssignedPermissionList, getDesignationById, getDesignationList, getEmployeeById, getEmployeeList, getRoleById, getRoleList, getTenantBranchById, getTenantBranchList } from "@/api/endpoints";
import { toast } from "@/components/ui/toast";

interface TenantContextValue {
    branchList: branchListType[]
    skip: number
    take: number
    setSkip: React.Dispatch<React.SetStateAction<number>>
    totalBranches: number
    fetchTenantBranchList: (skip: number, take: number) => Promise<void>
    selectedBranch: branchListType | null
    setSelectedBranch: React.Dispatch<React.SetStateAction<branchListType | null>>
    viewBranchModalOpen: boolean
    setViewBranchModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    editBranchModalOpen: boolean
    setEditBranchModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    fetchTenantBranchById: (branchId: number) => Promise<void>
    openViewBranch: (branchId: number) => Promise<void>
    openEditBranch: (branchId: number) => Promise<void>
    closeAllModals: () => void

    designationList: designationListType[]
    designationSkip: number
    setDesignationSkip: React.Dispatch<React.SetStateAction<number>>
    designationTake: number
    setDesignationTake: React.Dispatch<React.SetStateAction<number>>
    totalDesignations: number
    fetchDesignationList: (skip: number, take: number) => Promise<void>
    selectedDesignation: designationListType | null
    setSelectedDesignation: React.Dispatch<React.SetStateAction<designationListType | null>>
    viewDesignationModalOpen: boolean
    setViewDesignationModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    editDesignationModalOpen: boolean
    setEditDesignationModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    fetchDesignationById: (designationId: number) => Promise<void>
    openViewDesignation: (designationId: number) => Promise<void>
    openEditDesignation: (designationId: number) => Promise<void>
    closeAllDesignationModals: () => void

    roleList: roleListType[]
    roleSkip: number
    setRoleSkip: React.Dispatch<React.SetStateAction<number>>
    roleTake: number
    setRoleTake: React.Dispatch<React.SetStateAction<number>>
    totalRoles: number
    fetchRoleList: (skip: number, take: number) => Promise<void>
    selectedRole: roleListType | null
    setSelectedRole: React.Dispatch<React.SetStateAction<roleListType | null>>
    viewRoleModalOpen: boolean
    setViewRoleModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    editRoleModalOpen: boolean
    setEditRoleModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    fetchRoleById: (roleId: number) => Promise<void>
    openViewRole: (roleId: number) => Promise<void>
    openEditRole: (roleId: number) => Promise<void>
    closeAllRoleModals: () => void

    permissionMappingList: rolePermissionMappingType[]
    permissionMappingSkip: number
    setPermissionMappingSkip: React.Dispatch<React.SetStateAction<number>>
    permissionMappingTake: number
    setPermissionMappingTake: React.Dispatch<React.SetStateAction<number>>
    totalPermissionMappings: number
    fetchPermissionMappingList: (skip: number, take: number) => Promise<void>
    selectedPermissionMapping: rolePermissionMappingType | null
    setSelectedPermissionMapping: React.Dispatch<React.SetStateAction<rolePermissionMappingType | null>>
    viewPermissionMappingModalOpen: boolean
    setViewPermissionMappingModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    editPermissionMappingModalOpen: boolean
    setEditPermissionMappingModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    fetchPermissionMappingById: (rolePermissionId: number) => Promise<void>
    openViewPermissionMapping: (rolePermissionId: number) => Promise<void>
    openEditPermissionMapping: (rolePermissionId: number) => Promise<void>
    closeAllPermissionMappingModals: () => void

    employeeList: employeeListType[]
    employeeSkip: number
    setEmployeeSkip: React.Dispatch<React.SetStateAction<number>>
    employeeTake: number
    setEmployeeTake: React.Dispatch<React.SetStateAction<number>>
    totalEmployees: number
    fetchEmployeeList: (skip: number, take: number) => Promise<void>
    selectedEmployee: employeeListType | null
    setSelectedEmployee: React.Dispatch<React.SetStateAction<employeeListType | null>>
    viewEmployeeModalOpen: boolean
    setViewEmployeeModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    editEmployeeModalOpen: boolean
    setEditEmployeeModalOpen: React.Dispatch<React.SetStateAction<boolean>>
    fetchEmployeeById: (employeeId: number) => Promise<void>
    openViewEmployee: (employeeId: number) => Promise<void>
    openEditEmployee: (employeeId: number) => Promise<void>
    closeAllEmployeeModals: () => void
}

export const TenantContext = createContext<TenantContextValue>(
    undefined as unknown as TenantContextValue
)


export const TenantContextProvider = ({children} : {children : React.ReactNode})=>{
    const { isLoggedIn } = useContext(AuthContext)
    const [branchList, setBranchList] = useState<branchListType[]>([])
    const [skip, setSkip] = useState<number>(0)
    const [take] = useState<number>(9)
    const [totalBranches, setTotalBranches] = useState<number>(0)

    const [selectedBranch, setSelectedBranch] = useState<branchListType | null>(null)
    const [viewBranchModalOpen, setViewBranchModalOpen] = useState<boolean>(false)
    const [editBranchModalOpen, setEditBranchModalOpen] = useState<boolean>(false)

    const [designationList, setDesignationList] = useState<designationListType[]>([])
    const [designationSkip, setDesignationSkip] = useState<number>(0)
    const [designationTake, setDesignationTake] = useState<number>(9)
    const [totalDesignations, setTotalDesignations] = useState<number>(0)

    const [selectedDesignation, setSelectedDesignation] = useState<designationListType | null>(null)
    const [viewDesignationModalOpen, setViewDesignationModalOpen] = useState<boolean>(false)
    const [editDesignationModalOpen, setEditDesignationModalOpen] = useState<boolean>(false)

    const [roleList, setRoleList] = useState<roleListType[]>([])
    const [roleSkip, setRoleSkip] = useState<number>(0)
    const [roleTake, setRoleTake] = useState<number>(9)
    const [totalRoles, setTotalRoles] = useState<number>(0)

    const [selectedRole, setSelectedRole] = useState<roleListType | null>(null)
    const [viewRoleModalOpen, setViewRoleModalOpen] = useState<boolean>(false)
    const [editRoleModalOpen, setEditRoleModalOpen] = useState<boolean>(false)

    const [permissionMappingList, setPermissionMappingList] = useState<rolePermissionMappingType[]>([])
    const [permissionMappingSkip, setPermissionMappingSkip] = useState<number>(0)
    const [permissionMappingTake, setPermissionMappingTake] = useState<number>(9)
    const [totalPermissionMappings, setTotalPermissionMappings] = useState<number>(0)

    const [selectedPermissionMapping, setSelectedPermissionMapping] = useState<rolePermissionMappingType | null>(null)
    const [viewPermissionMappingModalOpen, setViewPermissionMappingModalOpen] = useState<boolean>(false)
    const [editPermissionMappingModalOpen, setEditPermissionMappingModalOpen] = useState<boolean>(false)

    const [employeeList, setEmployeeList] = useState<employeeListType[]>([])
    const [employeeSkip, setEmployeeSkip] = useState<number>(0)
    const [employeeTake, setEmployeeTake] = useState<number>(9)
    const [totalEmployees, setTotalEmployees] = useState<number>(0)

    const [selectedEmployee, setSelectedEmployee] = useState<employeeListType | null>(null)
    const [viewEmployeeModalOpen, setViewEmployeeModalOpen] = useState<boolean>(false)
    const [editEmployeeModalOpen, setEditEmployeeModalOpen] = useState<boolean>(false)

        const fetchTenantBranchList = async (skip: number, take: number) => {
        try {
            const data = await getTenantBranchList(skip, take)
            if (data?.success) {
                setBranchList(data?.data)
                setTotalBranches(data?.count)
            }
        } catch (err) {
            toast.add({
                type: 'error',
                description: getErrorMessage(err)
            })
        }
    }

    const fetchTenantBranchById = async (branchId: number) => {
        try {
            const data = await getTenantBranchById(branchId)
            if (data?.success) {
                setSelectedBranch(data?.data)
            }
        } catch (err) {
            toast.add({
                type: 'error',
                description: getErrorMessage(err)
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

    const fetchDesignationList = useCallback(async (skip: number, take: number) => {
        try {
            const data = await getDesignationList(skip, take)
            if (data?.success) {
                setDesignationList(data?.data)
                setTotalDesignations(data?.count)
            }
        } catch (err) {
            toast.add({
                type: 'error',
                description: getErrorMessage(err)
            })
        }
    }, [])

    const fetchDesignationById = async (designationId: number) => {
        try {
            const data = await getDesignationById(designationId)
            if (data?.success) {
                setSelectedDesignation(data?.data)
            }
        } catch (err) {
            //designation details endpoint responds with 302, payload still carries the record
            const payload = getErrorResponse(err)
            if (payload?.success && payload?.data) {
                setSelectedDesignation(payload.data as designationListType)
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

    const fetchRoleList = useCallback(async (skip: number, take: number) => {
        try {
            const data = await getRoleList(skip, take)
            if (data?.success) {
                setRoleList(data?.data)
                setTotalRoles(data?.count)
            }
        } catch (err) {
            toast.add({
                type: 'error',
                description: getErrorMessage(err)
            })
        }
    }, [])

    const fetchRoleById = async (roleId: number) => {
        try {
            const data = await getRoleById(roleId)
            if (data?.success) {
                setSelectedRole(data?.data)
            }
        } catch (err) {
            //role details endpoint responds with 302, payload still carries the record
            const payload = getErrorResponse(err)
            if (payload?.success && payload?.data) {
                setSelectedRole(payload.data as roleListType)
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

    const fetchPermissionMappingList = useCallback(async (skip: number, take: number) => {
        try {
            const data = await getAssignedPermissionList(skip, take)
            if (data?.success) {
                setPermissionMappingList(data?.data)
                setTotalPermissionMappings(data?.count)
            }
        } catch (err) {
            toast.add({
                type: 'error',
                description: getErrorMessage(err)
            })
        }
    }, [])

    const fetchPermissionMappingById = async (rolePermissionId: number) => {
        try {
            const data = await getAssignedPermissionById(rolePermissionId)
            if (data?.success) {
                setSelectedPermissionMapping(data?.data)
            }
        } catch (err) {
            toast.add({
                type: 'error',
                description: getErrorMessage(err)
            })
        }
    }

    const openViewPermissionMapping = async (rolePermissionId: number) => {
        await fetchPermissionMappingById(rolePermissionId)
        setViewPermissionMappingModalOpen(true)
    }

    const openEditPermissionMapping = async (rolePermissionId: number) => {
        await fetchPermissionMappingById(rolePermissionId)
        setEditPermissionMappingModalOpen(true)
    }

    const closeAllPermissionMappingModals = () => {
        setViewPermissionMappingModalOpen(false)
        setEditPermissionMappingModalOpen(false)
        setSelectedPermissionMapping(null)
    }

    const fetchEmployeeList = useCallback(async (skip: number, take: number) => {
        try {
            const data = await getEmployeeList(skip, take)
            if (data?.success) {
                setEmployeeList(data?.data)
                setTotalEmployees(data?.count)
            }
        } catch (err) {
            toast.add({
                type: 'error',
                description: getErrorMessage(err)
            })
        }
    }, [])

    const fetchEmployeeById = async (employeeId: number) => {
        try {
            const data = await getEmployeeById(employeeId)
            if (data?.success) {
                setSelectedEmployee(data?.data)
            }
        } catch (err) {
            toast.add({
                type: 'error',
                description: getErrorMessage(err)
            })
        }
    }

    const openViewEmployee = async (employeeId: number) => {
        await fetchEmployeeById(employeeId)
        setViewEmployeeModalOpen(true)
    }

    const openEditEmployee = async (employeeId: number) => {
        await fetchEmployeeById(employeeId)
        setEditEmployeeModalOpen(true)
    }

    const closeAllEmployeeModals = () => {
        setViewEmployeeModalOpen(false)
        setEditEmployeeModalOpen(false)
        setSelectedEmployee(null)
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
            fetchRoleById, openViewRole, openEditRole, closeAllRoleModals,
            permissionMappingList, permissionMappingSkip, setPermissionMappingSkip, permissionMappingTake, setPermissionMappingTake, totalPermissionMappings, fetchPermissionMappingList,
            selectedPermissionMapping, setSelectedPermissionMapping,
            viewPermissionMappingModalOpen, setViewPermissionMappingModalOpen,
            editPermissionMappingModalOpen, setEditPermissionMappingModalOpen,
            fetchPermissionMappingById, openViewPermissionMapping, openEditPermissionMapping, closeAllPermissionMappingModals,
            employeeList, employeeSkip, setEmployeeSkip, employeeTake, setEmployeeTake, totalEmployees, fetchEmployeeList,
            selectedEmployee, setSelectedEmployee,
            viewEmployeeModalOpen, setViewEmployeeModalOpen,
            editEmployeeModalOpen, setEditEmployeeModalOpen,
            fetchEmployeeById, openViewEmployee, openEditEmployee, closeAllEmployeeModals
        }}>
            {children}
        </TenantContext.Provider>
    )
}
