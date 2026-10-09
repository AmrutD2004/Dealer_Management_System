import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import dayjs from 'dayjs'
import { useContext } from 'react'
import { PlatformUserContext } from '@/Contexts/PlatformUserContext.tsx/PlatformUserContext'
import { Button } from '@/components/ui/button'
import { cn } from 'cn'
import { Badge } from '@/components/ui/badge'
import { Check, Eye, KeyRound, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { PermissionListType } from '@/Types/permissionType'
import { ViewPermissionModal } from '@/components/Permissions/Modals/ViewPermissionModal'
import EditPermissionModal from '@/components/Permissions/Modals/EditPermissionModal'
import { ConfirmPermissionActionModal } from '@/components/Permissions/Modals/ConfirmPermissionActionModal'

const PermissionListTable = () => {
    const {
        permissionSkip,
        permissionTake,
        permissionsList,
        totalPermissionCount,
        setPermissionSkip,
        selectedPermission,
        viewPermissionModalOpen,
        editPermissionModalOpen,
        permissionConfirmActionModalOpen,
        permissionConfirmAction,
        openViewPermission,
        openEditPermission,
        openPermissionConfirmAction,
        closeAllPermissionModals,
    } = useContext(PlatformUserContext)

    const noOfPages = Math.ceil(totalPermissionCount / permissionTake)

    const handlePrevious = () => {
        setPermissionSkip((prev: number) =>
            Math.max(prev - permissionTake, 0)
        )
    }

    const handleNext = () => {
        if (permissionSkip + permissionTake < totalPermissionCount) {
            setPermissionSkip((prev: number) => prev + permissionTake)
        }
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of all permissions registered on the platform.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left">Permission</TableHead>
                        <TableHead className='text-left font-medium'>Code</TableHead>
                        <TableHead className='text-left'>Description</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Created</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {permissionsList.map((permission: PermissionListType) => (
                        <TableRow key={permission.id}>
                            <TableCell className='text-left flex items-center gap-3'>
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                    <KeyRound className="h-4 w-4" />
                                </span>
                                {permission?.permissionName}
                            </TableCell>
                            <TableCell className="font-medium font-mono text-sm">{permission?.permissionCode}</TableCell>
                            <TableCell className="max-w-xs truncate text-muted-foreground">{permission?.description || "—"}</TableCell>
                            <TableCell className='text-center'>
                                <Badge variant={permission?.isActive ? 'success' : 'destructive'}>
                                    {permission?.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-center">{dayjs(permission?.createdAt).format('DD MMM YYYY')}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        render={
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label={`Actions for ${permission.permissionName}`}
                                            />
                                        }
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => openViewPermission(permission.id)}
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => openEditPermission(permission.id)}
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => openPermissionConfirmAction(permission.isActive ? 'deactivate' : 'activate', permission.id, permission.permissionName)}
                                            className={permission.isActive ? 'text-destructive focus:text-destructive' : 'text-green-600 focus:text-green-600'}
                                        >
                                            {permission.isActive ? <Trash2 className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                                            {permission.isActive ? "Deactivate" : "Activate"}
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <div className="w-full flex items-center justify-center gap-4 mt-10">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem><Button
                            variant="outline"
                            disabled={permissionSkip === 0}
                            onClick={handlePrevious}
                        >
                            <PaginationPrevious />
                        </Button>
                        </PaginationItem>
                        {[...Array(noOfPages).keys()].map((i) => {
                            const pageNext = i * permissionTake
                            return (
                                <PaginationItem key={i}>
                                    <Button className={cn('rounded-lg')} onClick={() => setPermissionSkip(pageNext)} variant={permissionSkip === pageNext ? 'default' : 'outline'} >{i + 1}</Button>
                                </PaginationItem>
                            )
                        })}
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                variant="outline"
                                disabled={permissionSkip + permissionTake >= totalPermissionCount}
                                onClick={handleNext}
                            >
                                <PaginationNext />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <ViewPermissionModal
                permission={selectedPermission}
                open={viewPermissionModalOpen}
                onClose={closeAllPermissionModals}
            />
            <EditPermissionModal
                permission={selectedPermission}
                open={editPermissionModalOpen}
                onClose={closeAllPermissionModals}
            />
            <ConfirmPermissionActionModal
                confirmAction={permissionConfirmAction}
                open={permissionConfirmActionModalOpen}
                onClose={closeAllPermissionModals}
            />
        </div>
    )
}

export default PermissionListTable
