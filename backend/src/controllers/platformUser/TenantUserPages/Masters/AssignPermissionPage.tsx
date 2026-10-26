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
import { ArrowLeft, Key, Loader2 } from 'lucide-react'
import { Checkbox } from '@/components/ui/checkbox'
import { Field, FieldGroup } from '@/components/ui/field'
import DashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import { cn } from 'cn'
import { useNavigate, useParams } from 'react-router-dom'

const AssignPermissionPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { fetchPermissionMappingList, permissionMappingTake, setPermissionMappingSkip } = useContext(TenantContext)
    const [roleList, setRoleList] = useState<roleListType[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [permissionsList, setPermissionsList] = useState<PermissionListType[]>([])

    const [roleId, setRoleId] = useState<string>('')
    const [permissionIds, setPermissionIds] = useState<number[]>([])
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
                permissionIds: permissionIds
            }
            const data = await assignPermission(payload)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                setRoleId('')
                setPermissionIds([])
                setPermissionMappingSkip(0)
                fetchPermissionMappingList(0, permissionMappingTake)
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

        <DashboardLayout>
            <div className='lg:max-w-6xl mx-auto'>

                <div className='flex w-full items-center justify-between text-foreground'>
                    <div className='flex flex-col items-start'>
                        <div className='flex items-center gap-2'>
                            <Key /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Assign Permission To Role</h1>
                        </div>
                        <p className='text-sm tracking-tight text-muted-foreground leading-tight'>User can assign permission to a particular role</p>
                    </div>
                    <Button variant="outline" onClick={() => navigate(`/tenant/${id}/masters/permission`)} className={cn('flex items-center gap-2')}>
                        <ArrowLeft />Back
                    </Button>
                </div>
                < div className="space-y-4 mt-4 " >
                    {/* Role Select */}
                    < div className="space-y-2" >
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

                        {/* Permission Select */}
                        {/* <div className="space-y-2">
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
                    </div> */}

                        <div className="space-y-2">
                            <h2>Permissions</h2>
                            <FieldGroup>
                                <div className="flex items-center gap-2 border-b pb-3">
                                    <Checkbox
                                        id="select-all-permissions"
                                        checked={
                                            permissionsList.length > 0 &&
                                            permissionIds.length === permissionsList.length
                                        }
                                        onCheckedChange={(checked) => {
                                            setPermissionIds(
                                                checked
                                                    ? permissionsList.map(
                                                        (permission: PermissionListType) => permission.id
                                                    )
                                                    : []
                                            );
                                        }}
                                    />

                                    <Label
                                        htmlFor="select-all-permissions"
                                        className="font-semibold cursor-pointer"
                                    >
                                        Select All Permissions
                                    </Label>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-3">
                                    {permissionsList.map((permission: PermissionListType) => (
                                        <div
                                            key={permission.id}
                                            className="flex items-start gap-2 min-w-0"
                                        >
                                            <Checkbox id={`permission-${permission.id}`} checked={permissionIds.includes(permission.id)} onCheckedChange={(checked) => {
                                                setPermissionIds((prev) =>
                                                    checked
                                                        ? [...prev, permission.id]
                                                        : prev.filter((id) => id !== permission.id)
                                                )
                                            }} />

                                            <Label
                                                htmlFor={`permission-${permission.id}`}
                                                className="break-words leading-5 cursor-pointer"
                                            >
                                                {permission.permissionCode}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </FieldGroup>
                        </div>

                    </div >
                    <div className='flex items-center justify-end w-full gap-2'>
                        <Button disabled={loading} onClick={handleSubmit}>
                            {loading ? <span className='flex items-center gap-2'><Loader2 className='animate-spin' />Assigning...</span> : 'Assign'}
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

export default AssignPermissionPage