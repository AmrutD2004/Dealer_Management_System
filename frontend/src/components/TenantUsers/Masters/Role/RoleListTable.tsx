import { activateRole, deactivateRole } from '@/api/endpoints'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/toast'
import { type roleListType } from '@/Types/tenantCreateType'
import { useContext, useEffect } from 'react'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from '@/components/ui/button'
import { cn } from 'cn'
import { Badge } from '@/components/ui/badge'
import { Check, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { TenantContext } from '@/Contexts/Tenant/TenantContext'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ViewRoleModal } from '../Modals/ViewRoleModal'
import { EditRoleModal } from '../Modals/EditRoleModal'

const RoleListTable = () => {
    const { roleList, roleSkip, setRoleSkip, roleTake, totalRoles, selectedRole, viewRoleModalOpen, editRoleModalOpen, openViewRole, openEditRole, closeAllRoleModals, fetchRoleList } = useContext(TenantContext)

    useEffect(() => {
        fetchRoleList(roleSkip, roleTake)
    }, [roleSkip, roleTake, fetchRoleList])

    const noOfPages = Math.ceil(totalRoles / roleTake)

    const handleDeactive = async (id: number) => {
        try {
            const data = await deactivateRole(Number(id))
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchRoleList(roleSkip, roleTake)
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: (err as any)?.response?.data?.message
            })
        }
    }

    const handleActive = async (id: number) => {
        try {
            const data = await activateRole(Number(id))
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchRoleList(roleSkip, roleTake)
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: (err as any)?.response?.data?.message
            })
        }
    }

    const handlePrevious = () => {
        setRoleSkip((prev: number) =>
            Math.max(prev - roleTake, 0)
        )
    }

    const handleNext = () => {
        if (roleSkip + roleTake < totalRoles) {
            setRoleSkip((prev: number) => prev + roleTake)
        }
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of roles.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className='text-left text-muted-foreground'>Role Code</TableHead>
                        <TableHead className='text-left text-muted-foreground'>Role Name</TableHead>
                        <TableHead className='text-left text-muted-foreground'>Description</TableHead>
                        <TableHead className="text-center text-muted-foreground">System Role</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {roleList.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className='text-center text-muted-foreground'>No roles is created</TableCell>
                        </TableRow>
                    ) : (
                        roleList.map((role: roleListType, idx: number) => (
                            <TableRow key={role.id}>
                                <TableCell className='text-left font-medium'>{roleSkip + idx + 1}</TableCell>
                                <TableCell className='text-left font-medium font-mono'>{role.roleCode}</TableCell>
                                <TableCell className='text-left font-medium'>{role.roleName}</TableCell>
                                <TableCell className='text-left font-medium max-w-[280px] truncate' title={role.roleDescription ?? ''}>{role.roleDescription || '—'}</TableCell>
                                <TableCell className='text-center font-medium'>
                                    <Badge variant={role.isSystemRole ? 'default' : 'outline'}>{role.isSystemRole ? 'Yes' : 'No'}</Badge>
                                </TableCell>
                                <TableCell className='text-center font-medium'><Badge variant={role.isActive ? 'success' : 'destructive'}>{role.isActive ? 'Active' : 'Deactive'}</Badge></TableCell>
                                <TableCell className='flex items-center justify-end'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${role.roleName}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => openViewRole(role.id)}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={() => openEditRole(role.id)}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={!role?.isActive ? () => handleActive(role.id) : () => handleDeactive(role.id)}
                                                className={`${!role?.isActive ? 'text-green-600 focus:text-green-600' : 'text-destructive focus:text-destructive'}`}
                                            >
                                                {!role?.isActive ? <Check className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                                {!role?.isActive ? "Activate" : "Deactivate"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            <div className="w-full flex items-center justify-center gap-4 mt-10">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem><Button
                            variant="outline"
                            disabled={roleSkip === 0}
                            onClick={handlePrevious}
                        >
                            <PaginationPrevious />
                        </Button>
                        </PaginationItem>
                        {[...Array(noOfPages).keys()].map((i) => {
                            const pageNext = i * roleTake
                            return (
                                <PaginationItem key={i}>
                                    <Button className={cn('rounded-lg')} onClick={() => setRoleSkip(pageNext)} variant={roleSkip === pageNext ? 'default' : 'outline'} >{i + 1}</Button>
                                </PaginationItem>
                            )
                        })}
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                variant="outline"
                                disabled={roleSkip + roleTake >= totalRoles}
                                onClick={handleNext}
                            >
                                <PaginationNext />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
            <ViewRoleModal role={selectedRole} open={viewRoleModalOpen} onClose={closeAllRoleModals} />
            <EditRoleModal role={selectedRole} open={editRoleModalOpen} onClose={closeAllRoleModals} />
        </div>
    )
}

export default RoleListTable
