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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Building2, Check, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { tenantType } from '@/Types/tenantCreateType'
import { ViewTenantModal } from '@/components/PlatformUsers/Modals/ViewTenantModal'
import EditTenantModal from '@/components/PlatformUsers/Modals/EditTenantModal'
import { ConfirmActionModal } from '@/components/PlatformUsers/Modals/ConfirmActionModal'

const TenantListTable = () => {
    const {
        tenantSkip,
        tenantTake,
        tenantList,
        totalTenantCount,
        setTenantSkip,
        selectedTenant,
        viewTenantModalOpen,
        editTenantModalOpen,
        confirmActionModalOpen,
        confirmAction,
        openViewTenant,
        openEditTenant,
        openConfirmAction,
        closeAllModals,
    } = useContext(PlatformUserContext)

    const noOfPages = Math.ceil(totalTenantCount / tenantTake)

    const handlePrevious = () => {
        setTenantSkip((prev: number) =>
            Math.max(prev - tenantTake, 0)
        )
    }

    const handleNext = () => {
        if (tenantSkip + tenantTake < totalTenantCount) {
            setTenantSkip((prev: number) => prev + tenantTake)
        }
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return 'success'
            case "SUSPENDED":
                return 'destructive'
            case "TRIAL":
                return 'default'
            case "EXPIRED":
            case "CANCELLED":
                return 'destructive'
            default:
                return 'outline'
        }
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of your platform tenants.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left">Tenants</TableHead>
                        <TableHead className='text-left font-medium'>Code</TableHead>
                        <TableHead className='text-center'>Contact</TableHead>
                        <TableHead className='text-center'>Plan</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Created</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {tenantList.map((tenant: tenantType) => (
                        <TableRow key={tenant.id}>
                            <TableCell className='text-left flex items-center gap-3'><Avatar className="h-9 w-9">
                                <AvatarFallback className="bg-muted text-xs font-semibold text-muted-foreground">
                                    <Building2 />
                                </AvatarFallback>
                            </Avatar>{tenant?.tenantName}</TableCell>
                            <TableCell className="font-medium">{tenant?.tenantCode}</TableCell>
                            <TableCell className="font-medium text-center">{tenant?.phone}</TableCell>
                            <TableCell className='text-center'><Badge variant={'outline'}>{tenant?.subscriptionPlan}</Badge></TableCell>
                            <TableCell className='text-center'><Badge variant={getStatusBadgeVariant(tenant?.subscriptionStatus)}>{tenant?.subscriptionStatus}</Badge></TableCell>
                            <TableCell className="text-center">{dayjs(tenant?.createdAt).format('DD MMM YYYY')}</TableCell>
                            <TableCell className="text-right">
                                <DropdownMenu>
                                    <DropdownMenuTrigger
                                        render={
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label={`Actions for ${tenant.tenantName}`}
                                            />
                                        }
                                    >
                                        <MoreHorizontal className="h-4 w-4" />
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                            onClick={() => openViewTenant(tenant.id)}
                                        >
                                            <Eye className="mr-2 h-4 w-4" />
                                            View
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => openEditTenant(tenant.id)}
                                        >
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => openConfirmAction('suspend', tenant.id, tenant.tenantName)}
                                            className="text-orange-600 focus:text-orange-600"
                                        >
                                            <Check className="mr-2 h-4 w-4" />
                                            Suspend
                                        </DropdownMenuItem>

                                        <DropdownMenuItem
                                            onClick={() => openConfirmAction(tenant.isActive ? 'deactivate' : 'activate', tenant.id, tenant.tenantName)}
                                            className={tenant.isActive ? 'text-destructive focus:text-destructive' : 'text-green-600 focus:text-green-600'}
                                        >
                                            {tenant.isActive ? <Trash2 className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                                            {tenant.isActive ? "Deactivate" : "Activate"}
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
                            disabled={tenantSkip === 0}
                            onClick={handlePrevious}
                        >
                            <PaginationPrevious />
                        </Button>
                        </PaginationItem>
                        {[...Array(noOfPages).keys()].map((i) => {
                            const pageNext = i * tenantTake
                            return (
                                <PaginationItem>
                                    <Button className={cn('rounded-lg')} onClick={() => setTenantSkip(pageNext)} variant={tenantSkip === pageNext ? 'default' : 'outline'} >{i + 1}</Button>
                                </PaginationItem>
                            )
                        })}
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                variant="outline"
                                disabled={tenantSkip + tenantTake >= totalTenantCount}
                                onClick={handleNext}

                            >
                                <PaginationNext />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <ViewTenantModal
                tenant={selectedTenant}
                open={viewTenantModalOpen}
                onClose={closeAllModals}
            />
            <EditTenantModal
                tenant={selectedTenant}
                open={editTenantModalOpen}
                onClose={closeAllModals}
            />
            <ConfirmActionModal
                confirmAction={confirmAction}
                open={confirmActionModalOpen}
                onClose={closeAllModals}
            />
        </div>
    )
}

export default TenantListTable