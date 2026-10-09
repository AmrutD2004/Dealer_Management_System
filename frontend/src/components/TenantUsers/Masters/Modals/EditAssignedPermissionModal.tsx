import { getPermissionListWithoutpagination, getRoleListWithoutPagination, updateAssignedPermission } from "@/api/endpoints"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { TenantContext } from "@/Contexts/Tenant/TenantContext"
import type { PermissionListType } from "@/Types/permissionType"
import type { roleListType, rolePermissionMappingType } from "@/Types/tenantCreateType"
import { Loader2 } from "lucide-react"
import { useContext, useEffect, useState } from "react"

type props = {
    mapping: rolePermissionMappingType | null
    open: boolean
    onClose: () => void
}

const EditAssignedPermissionModal = ({ mapping, open, onClose }: props) => {
    const { fetchPermissionMappingList, permissionMappingSkip, permissionMappingTake, closeAllPermissionMappingModals } = useContext(TenantContext)
    const [roleList, setRoleList] = useState<roleListType[]>([])
    const [permissionsList, setPermissionsList] = useState<PermissionListType[]>([])
    const [loading, setLoading] = useState<boolean>(false)

    const [roleId, setRoleId] = useState<string>('')
    const [permissionId, setPermissionId] = useState<string>('')

    const fetchRolesList = async () => {
        try {
            const data = await getRoleListWithoutPagination()
            if (data?.success) {
                setRoleList(data?.data)
            }
        } catch (error: any) {
            toast.add({
                type: 'error',
                description: error?.response?.data?.message
            })
        }
    }
    const fetchPermissionsList = async () => {
        try {
            const data = await getPermissionListWithoutpagination()
            if (data?.success) {
                setPermissionsList(data?.data)
            }
        } catch (error: any) {
            toast.add({
                type: 'error',
                description: error?.response?.data?.message
            })
        }
    }

    useEffect(() => {
        fetchRolesList()
        fetchPermissionsList()
    }, [])

    useEffect(() => {
        if (mapping) {
            setRoleId(String(mapping.roleId))
            setPermissionId(String(mapping.permissionId))
        }
    }, [mapping])

    const roleItems = roleList.map((role: roleListType) => ({
        value: String(role.id),
        label: role.roleName
    }))
    const permissionItems = permissionsList.map((permission: PermissionListType) => ({
        value: String(permission.id),
        label: permission.permissionCode
    }))

    const handleCancel = () => {
        closeAllPermissionMappingModals()
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!mapping) return
        setLoading(true)
        try {
            const payload = {
                roleId: Number(roleId),
                permissionId: Number(permissionId)
            }
            const data = await updateAssignedPermission(payload, mapping.id)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchPermissionMappingList(permissionMappingSkip, permissionMappingTake)
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
        } catch (error: any) {
            toast.add({
                type: 'error',
                description: error?.response?.data?.message
            })
        } finally {
            setLoading(false)
        }
    }

    if (!mapping) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Edit Assigned Permission</DialogTitle>
                    <DialogDescription>Update the role and permission mapping.</DialogDescription>
                </DialogHeader>

                <form id="assigned-permission-edit-form" onSubmit={handleSubmit}>
                    <div className="space-y-4 py-4">
                        <Field>
                            <FieldLabel>Role <span className="text-red-500">*</span></FieldLabel>
                            <FieldContent>
                                <Select items={roleItems} value={roleId} onValueChange={(value) => setRoleId(value ?? "")}>
                                    <SelectTrigger className="w-full">
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
                            </FieldContent>
                        </Field>

                        <Field>
                            <FieldLabel>Permission <span className="text-red-500">*</span></FieldLabel>
                            <FieldContent>
                                <Select items={permissionItems} value={permissionId} onValueChange={(value) => setPermissionId(value ?? "")}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a permission" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {permissionsList.map((permission: PermissionListType) => (
                                            <SelectItem key={permission.id} value={String(permission.id)}>
                                                {permission.permissionCode}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FieldContent>
                        </Field>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={handleCancel} variant="outline">Cancel</Button>
                    <Button form="assigned-permission-edit-form" type="submit" disabled={loading}>
                        {loading ? <span className="flex items-center gap-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving....</span> : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default EditAssignedPermissionModal
