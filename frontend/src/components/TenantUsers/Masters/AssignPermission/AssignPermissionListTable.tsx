import { useContext, useEffect } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
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
import dayjs from 'dayjs'
import { Eye, MoreHorizontal, Pencil } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { TenantContext } from '@/Contexts/Tenant/TenantContext'
import type { rolePermissionMappingType } from '@/Types/tenantCreateType'
import ViewAssignedPermissionModal from '../Modals/ViewAssignedPermissionModal'
import EditAssignedPermissionModal from '../Modals/EditAssignedPermissionModal'

const AssignPermissionListTable = () => {
    const {
        permissionMappingList,
        permissionMappingSkip,
        setPermissionMappingSkip,
        permissionMappingTake,
        totalPermissionMappings,
        fetchPermissionMappingList,
        selectedPermissionMapping,
        viewPermissionMappingModalOpen,
        editPermissionMappingModalOpen,
        openViewPermissionMapping,
        openEditPermissionMapping,
        closeAllPermissionMappingModals
    } = useContext(TenantContext)

    useEffect(() => {
        fetchPermissionMappingList(permissionMappingSkip, permissionMappingTake)
    }, [permissionMappingSkip, permissionMappingTake, fetchPermissionMappingList])

    const noOfPages = Math.ceil(totalPermissionMappings / permissionMappingTake)

    const handlePrevious = () => {
        setPermissionMappingSkip((prev: number) =>
            Math.max(prev - permissionMappingTake, 0)
        )
    }

    const handleNext = () => {
        if (permissionMappingSkip + permissionMappingTake < totalPermissionMappings) {
            setPermissionMappingSkip((prev: number) => prev + permissionMappingTake)
        }
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of assigned permissions.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className='text-left text-muted-foreground'>Role Code</TableHead>
                        <TableHead className='text-left text-muted-foreground'>Role Name</TableHead>
                        <TableHead className='text-left text-muted-foreground'>Permission Code</TableHead>
                        <TableHead className='text-left text-muted-foreground'>Permission Name</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                        <TableHead className="text-center text-muted-foreground">Assigned On</TableHead>
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {permissionMappingList.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={8} className='text-center text-muted-foreground'>No permission is assigned</TableCell>
                        </TableRow>
                    ) : (
                        permissionMappingList.map((mapping: rolePermissionMappingType, idx: number) => (
                            <TableRow key={mapping.id}>
                                <TableCell className='text-left font-medium'>{permissionMappingSkip + idx + 1}</TableCell>
                                <TableCell className='text-left font-medium font-mono'>{mapping?.role?.roleCode}</TableCell>
                                <TableCell className='text-left font-medium'>{mapping?.role?.roleName}</TableCell>
                                <TableCell className='text-left font-medium font-mono'>{mapping?.permission?.permissionCode}</TableCell>
                                <TableCell className='text-left font-medium'>{mapping?.permission?.permissionName}</TableCell>
                                <TableCell className='text-center font-medium'>
                                    <Badge variant={mapping?.permission?.isActive ? 'success' : 'destructive'}>
                                        {mapping?.permission?.isActive ? 'Active' : 'Deactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-center font-medium'>{dayjs(mapping?.createdAt).format('DD MMM YYYY')}</TableCell>
                                <TableCell className='flex items-center justify-end'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${mapping?.role?.roleName} - ${mapping?.permission?.permissionName}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => openViewPermissionMapping(mapping.id)}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={() => openEditPermissionMapping(mapping.id)}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
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
                            disabled={permissionMappingSkip === 0}
                            onClick={handlePrevious}
                        >
                            <PaginationPrevious />
                        </Button>
                        </PaginationItem>
                        {[...Array(noOfPages).keys()].map((i) => {
                            const pageNext = i * permissionMappingTake
                            return (
                                <PaginationItem key={i}>
                                    <Button className={cn('rounded-lg')} onClick={() => setPermissionMappingSkip(pageNext)} variant={permissionMappingSkip === pageNext ? 'default' : 'outline'} >{i + 1}</Button>
                                </PaginationItem>
                            )
                        })}
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                variant="outline"
                                disabled={permissionMappingSkip + permissionMappingTake >= totalPermissionMappings}
                                onClick={handleNext}
                            >
                                <PaginationNext />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
            <ViewAssignedPermissionModal
                mapping={selectedPermissionMapping}
                open={viewPermissionMappingModalOpen}
                onClose={closeAllPermissionMappingModals}
            />
            <EditAssignedPermissionModal
                mapping={selectedPermissionMapping}
                open={editPermissionMappingModalOpen}
                onClose={closeAllPermissionMappingModals}
            />
        </div>
    )
}

export default AssignPermissionListTable
