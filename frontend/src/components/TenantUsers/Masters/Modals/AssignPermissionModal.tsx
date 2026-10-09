import React, { useContext, useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { TenantContext } from '@/Contexts/Tenant/TenantContext'
import { Button } from '@/components/ui/button'
import type { PermissionListType } from '@/Types/permissionType'
import { toast } from '@/components/ui/toast'
import { assignPermission, getPermissionListWithoutpagination, getRoleListWithoutPagination } from '@/api/endpoints'
import type { roleListType } from '@/Types/tenantCreateType'
import { Loader2 } from 'lucide-react'

type props = {
    open: boolean
    onClose: (open: boolean) => void
}
const AssignPermissionModal = ({ onClose, open }: props) => {
    const { fetchPermissionMappingList, permissionMappingTake, setPermissionMappingSkip } = useContext(TenantContext)
    const [roleList, setRoleList] = useState<roleListType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [permissionsList, setPermissionsList] = useState<PermissionListType[]>([])

    const [roleId, setRoleId] = useState<string>('')
    const [permissionId, setPermissionId] = useState<string>('')
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
    useEffect(() => {
        fetchRolesList()
    }, [])
    useEffect(() => {
        fetchPermissionsList()
    }, [])

    const roleItems = roleList.map((role: roleListType) => ({
        value: String(role.id),
        label: role.roleName
    }))
    const permissionItems = permissionsList.map((permission: PermissionListType) => ({
        value: String(permission.id),
        label: permission.permissionCode
    }))

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true)
        e.preventDefault();
        try {
            const payload = {
                roleId: Number(roleId),
                permissionId: Number(permissionId)
            }
            const data = await assignPermission(payload)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                setRoleId('')
                setPermissionId('')
                setPermissionMappingSkip(0)
                fetchPermissionMappingList(0, permissionMappingTake)
                setTimeout(() => {
                    onClose(false);
                }, 2000)
            }
        } catch (error: any) {
            toast.add({
                type: 'error',
                description: error?.response?.data?.message
            })
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign Permission</DialogTitle>
                </DialogHeader>

                {/* Body */}
                <div className="space-y-4">
                    {/* Role Select */}
                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Select items={roleItems} value={roleId} onValueChange={(value) => setRoleId(value ?? "")}>
                            <SelectTrigger id="role" className="w-full">
                                <SelectValue placeholder="Select a role" />
                            </SelectTrigger>

                            <SelectContent>
                                {roleList.map((role: roleListType) => (
                                    <SelectItem
                                        key={role.id}
                                        value={String(role.id)}
                                    >
                                        {role.roleName}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Permission Select */}
                    <div className="space-y-2">
                        <Label htmlFor="permission">Permission</Label>
                        <Select items={permissionItems} value={permissionId} onValueChange={(value) => setPermissionId(value ?? "")}>
                            <SelectTrigger id="permission" className="w-full">
                                <SelectValue placeholder="Select a permission" />
                            </SelectTrigger>

                            <SelectContent>
                                {permissionsList.map((permission: PermissionListType) => (
                                    <SelectItem
                                        key={permission.id}
                                        value={String(permission.id)}
                                    >
                                        {permission.permissionCode}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onClose(false)}>
                        Cancel
                    </Button>
                    <Button disabled={loading} onClick={handleSubmit}>
                        {loading ? <span className='flex items-center gap-2'><Loader2 className='animate-spin' />Assigning...</span> : 'Assign'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AssignPermissionModal