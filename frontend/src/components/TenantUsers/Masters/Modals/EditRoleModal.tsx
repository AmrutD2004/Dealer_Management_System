import { editRole } from "@/api/endpoints"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { TenantContext } from "@/Contexts/Tenant/TenantContext"
import type { roleCreateType, roleListType } from "@/Types/tenantCreateType"
import { Loader2 } from "lucide-react"
import { useContext, useEffect, useState } from "react"

interface EditRoleModalProps {
    role: roleListType | null,
    open: boolean,
    onClose: () => void
}

const initialFormData: roleCreateType = {
    roleCode: "",
    roleName: "",
    roleDescription: "",
}

export function EditRoleModal({ role, open, onClose }: EditRoleModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const { fetchRoleList, roleSkip, roleTake, closeAllRoleModals } = useContext(TenantContext)
    const [formData, setFormData] = useState<roleCreateType>(initialFormData)

    useEffect(() => {
        if (role) {
            setFormData({
                roleCode: role.roleCode ?? "",
                roleName: role.roleName ?? "",
                roleDescription: role.roleDescription ?? "",
            })
        }
    }, [role])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    const getRoleNameFormCode = (role: string) => {
        switch (role) {
            case 'ADMIN':
                setFormData(prev => ({
                    ...prev,
                    roleName: 'Admin',
                    roleDescription : 'Full access to dealership operations, users, masters and settings'
                }))
                break;
            case 'SUPERVISOR':
                setFormData(prev => ({
                    ...prev,
                    roleName: 'Supervisor',
                    roleDescription : 'Monitor job cards, allocate work and supervise technicians'
                }))
                break;
            case 'STORE_KEEPER':
                setFormData(prev => ({
                    ...prev,
                    roleName: 'Store Keeper',
                    roleDescription : 'Manage inventory, spare parts, stock and parts issuance'
                }))
                break;
            case 'SERVICE_ADVISOR':
                setFormData(prev => ({
                    ...prev,
                    roleName: 'Service Advisor',
                    roleDescription : 'Manage customers, vehicles, appointments and job cards'
                }))
                break;
            case 'TECHNICIAN':
                setFormData(prev => ({
                    ...prev,
                    roleName: 'Technician',
                    roleDescription : 'View assigned job cards, update repair progress and record work'
                }))
                break;
            case 'MANAGER':
                setFormData(prev => ({
                    ...prev,
                    roleName: 'Manager',
                    roleDescription : 'Manage service operations, employees, job cards and reports'
                }))
                break;
            case 'MECHANIC':
                setFormData(prev => ({
                    ...prev,
                    roleName: 'Mechanic',
                    roleDescription : 'Perform vehicle servicing and repairs, follow assigned job cards, record repair activities, update job progress, and report completed work to the supervisor.'
                }))
                break;
        }
    }

    const handleCancel = () => {
        closeAllRoleModals()
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        if (!role) return
        try {
            const payload = {
                roleCode: formData.roleCode,
                roleName: formData.roleName,
                roleDescription: formData.roleDescription
            }
            const data = await editRole(payload, role.id)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchRoleList(roleSkip, roleTake)
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

    if (!role) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Edit Role</DialogTitle>
                    <DialogDescription>Update the role details.</DialogDescription>
                </DialogHeader>

                <form id="role-edit-form" onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Role Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Role Code <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            value={formData.roleCode}
                                            onValueChange={(value) => {
                                                setFormData((prev: roleCreateType) => ({ ...prev, roleCode: value ?? "" }))
                                                getRoleNameFormCode(value ?? "")
                                            }
                                            }
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>

                                                <SelectItem value="ADMIN">
                                                    ADMIN
                                                </SelectItem>
                                                <SelectItem value="MANAGER">
                                                    MANAGER
                                                </SelectItem>
                                                <SelectItem value="SUPERVISOR">
                                                    SUPERVISOR
                                                </SelectItem>
                                                <SelectItem value="STORE_KEEPER">
                                                    STORE_KEEPER
                                                </SelectItem>
                                                <SelectItem value="SERVICE_ADVISOR">
                                                    SERVICE_ADVISOR
                                                </SelectItem>
                                                <SelectItem value="MECHANIC">
                                                    MECHANIC
                                                </SelectItem>
                                                <SelectItem value="TECHNICIAN">
                                                    TECHNICIAN
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Role Name <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='roleName' placeholder="e.g. Service Admin" required onChange={handleChange} value={formData.roleName} disabled={!!formData.roleName} readOnly className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                                    <FieldLabel className="text-xs font-medium">Description <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Textarea name='roleDescription' placeholder="Role responsibilities and scope" required onChange={handleChange} value={formData.roleDescription} disabled={!!formData.roleDescription} readOnly className="min-h-[48px] rounded-none px-2 py-1 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button size="sm" type="button" onClick={handleCancel} variant="outline" className="h-7 px-3 text-xs">Cancel</Button>
                    <Button size="sm" form="role-edit-form" type="submit" disabled={loading} className="h-7 px-3 text-xs">
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Saving....</span>}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
