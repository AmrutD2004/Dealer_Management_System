import { editEmployee, getDesignationListWithoutPagination, getRoleListWithoutPagination, getTenantBranchList } from "@/api/endpoints"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { TenantContext } from "@/Contexts/Tenant/TenantContext"
import type { branchListType, designationListType, employeeCreateType, employeeListType, roleListType } from "@/Types/tenantCreateType"
import { Loader2 } from "lucide-react"
import { useContext, useEffect, useState } from "react"

interface EditEmployeeModalProps {
    employee: employeeListType | null
    open: boolean
    onClose: () => void
}

const initialFormData: employeeCreateType = {
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    passwordHash: "",
    branchId: "",
    roleId: "",
    designationId: "",
}

export function EditEmployeeModal({ employee, open, onClose }: EditEmployeeModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const { fetchEmployeeList, employeeSkip, employeeTake, closeAllEmployeeModals } = useContext(TenantContext)
    const [formData, setFormData] = useState<employeeCreateType>(initialFormData)
    const [branchList, setBranchList] = useState<branchListType[]>([])
    const [roleList, setRoleList] = useState<roleListType[]>([])
    const [designationList, setDesignationList] = useState<designationListType[]>([])

    const fetchDropdowns = async () => {
        try {
            const [branches, roles, designations] = await Promise.all([
                getTenantBranchList(0, 100),
                getRoleListWithoutPagination(),
                getDesignationListWithoutPagination(),
            ])
            if (branches?.success) setBranchList(branches?.data)
            if (roles?.success) setRoleList(roles?.data)
            if (designations?.success) setDesignationList(designations?.data)
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: (err as any)?.response?.data?.message
            })
        }
    }

    useEffect(() => {
        if (open) fetchDropdowns()
    }, [open])

    useEffect(() => {
        if (employee) {
            setFormData({
                firstName: employee.firstName ?? "",
                middleName: employee.middleName ?? "",
                lastName: employee.lastName ?? "",
                email: employee.email ?? "",
                mobileNo: employee.mobileNo ?? "",
                passwordHash: "",
                branchId: employee.branchId ? String(employee.branchId) : "",
                roleId: employee.roleId ? String(employee.roleId) : "",
                designationId: employee.designationId ? String(employee.designationId) : "",
            })
        }
    }, [employee])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCancel = () => {
        closeAllEmployeeModals()
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        if (!employee) return
        try {
            const payload = {
                firstName: formData.firstName,
                middleName: formData.middleName,
                lastName: formData.lastName,
                email: formData.email,
                mobileNo: formData.mobileNo,
                passwordHash: formData.passwordHash,
                branchId: Number(formData.branchId),
                roleId: Number(formData.roleId),
                designationId: Number(formData.designationId),
            }
            const data = await editEmployee(payload, employee.id)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchEmployeeList(employeeSkip, employeeTake)
                setTimeout(() => {
                    handleCancel()
                }, 2000)
            }
            if (!data?.success) {
                toast.add({
                    type: 'error',
                    description: data?.message
                })
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: (err as any)?.response?.data?.message
            })
        } finally {
            setLoading(false)
        }
    }

    if (!employee) return null

    const branchItems = branchList.map((branch: branchListType) => ({
        value: String(branch.id),
        label: branch.branchName
    }))
    const roleItems = roleList.map((role: roleListType) => ({
        value: String(role.id),
        label: role.roleName
    }))
    const designationItems = designationList.map((designation: designationListType) => ({
        value: String(designation.id),
        label: designation.name
    }))

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-2xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Edit Employee</DialogTitle>
                    <DialogDescription>Update the employee details.</DialogDescription>
                </DialogHeader>

                <form id="employee-edit-form" onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Personal Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">First Name <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='firstName' placeholder="e.g. John" required onChange={handleChange} value={formData.firstName}  className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Middle Name <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='middleName' placeholder="e.g. Kumar" required onChange={handleChange} value={formData.middleName}  className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Last Name <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='lastName' placeholder="e.g. Doe" required onChange={handleChange} value={formData.lastName}  className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Email <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='email' type='email' placeholder="e.g. john@example.com" required onChange={handleChange} value={formData.email}  className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Mobile No <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='mobileNo' placeholder="e.g. 9876543210" required onChange={handleChange} value={formData.mobileNo}  className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Password</FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='passwordHash' type='password' placeholder="Leave blank to keep current" onChange={handleChange} value={formData.passwordHash}  className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Work Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Branch <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={branchItems}
                                            value={formData.branchId}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, branchId: value ?? "" }))}
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select a branch" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {branchList.map((branch: branchListType) => (
                                                    <SelectItem key={branch.id} value={String(branch.id)}>
                                                        {branch.branchName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Role <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={roleItems}
                                            value={formData.roleId}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, roleId: value ?? "" }))}
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {roleList.map((role: roleListType) => (
                                                    <SelectItem key={role.id} value={String(role.id)}>
                                                        {role.roleName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Designation <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={designationItems}
                                            value={formData.designationId}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, designationId: value ?? "" }))}
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select a designation" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {designationList.map((designation: designationListType) => (
                                                    <SelectItem key={designation.id} value={String(designation.id)}>
                                                        {designation.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button size="sm" type="button" onClick={handleCancel} variant="outline" className="h-7 px-3 text-xs">Cancel</Button>
                    <Button size="sm" form="employee-edit-form" type="submit" disabled={loading} className="h-7 px-3 text-xs">
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Saving....</span>}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
