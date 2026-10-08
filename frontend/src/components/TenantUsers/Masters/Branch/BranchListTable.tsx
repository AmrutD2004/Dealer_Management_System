import { activateTenantBranch, getTenantBranchList, deactivateTenantBranch } from '@/api/endpoints'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/toast'
import { AuthContext } from '@/Contexts/AuthContext'
import { type branchListType } from '@/Types/tenantCreateType'
import { useContext, useEffect, useState } from 'react'
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
import { Check, EllipsisVertical, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { TenantContext } from '@/Contexts/Tenant/TenantContext'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ViewBranchModal } from '../Modals/ViewBranchModal'
import { EditBranchModal } from '../Modals/EditBranchModal'

const BranchListTable = () => {
    const { branchList, skip, take, setSkip, totalBranches, selectedBranch, viewBranchModalOpen, editBranchModalOpen, openViewBranch, openEditBranch, closeAllModals, fetchTenantBranchList } = useContext(TenantContext)
    const noOfPages = Math.ceil(totalBranches / take)
    const handleDeactive = async (id: number) => {
        try {
            const data = await deactivateTenantBranch(Number(id))
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchTenantBranchList(skip, take)
            }
        } catch (err: any) {
            toast.add({
                type: 'error',
                description: err?.response?.data?.message
            })
        }
    }
    const handleActive = async (id: number) => {
        try {
            const data = await activateTenantBranch(Number(id))
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchTenantBranchList(skip, take)
            }
        } catch (err: any) {
            toast.add({
                type: 'error',
                description: err?.response?.data?.message
            })
        }
    }
    const handlePrevious = () => {
        skip((prev: number) =>
            Math.max(prev - take, 0)
        )
    }

    const handleNext = () => {
        if (skip + take < totalBranches) {
            setSkip((prev: number) => prev + take)
        }
    }
    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of branches.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Branch Name</TableHead>
                        <TableHead className='text-left font-medium text-muted-foreground'>Branch Code</TableHead>
                        <TableHead className='text-center text-muted-foreground'>Contact</TableHead>
                        <TableHead className="text-center text-muted-foreground">City</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {branchList.length === 0 ? (
                        <TableRow>
                            No branches is created
                        </TableRow>
                    ) : (
                        branchList.map((branch: branchListType, idx: number) => (
                            <TableRow key={branch.id}>
                                <TableCell className='text-left font-medium'>{skip + idx + 1}</TableCell>
                                <TableCell className='text-left font-medium'>{branch.branchName}</TableCell>
                                <TableCell className='text-left font-medium'>{branch.branchCode}</TableCell>
                                <TableCell className='text-center font-medium'>{branch.phone}</TableCell>
                                <TableCell className='text-center font-medium'>{branch.city}</TableCell>
                                <TableCell className='text-center font-medium'><Badge variant={branch.isActive ? 'success' : 'destructive'}>{branch.isActive ? 'Active' : 'Deactive'}</Badge></TableCell>
                                <TableCell className='flex items-center justify-end'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${branch.email}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => openViewBranch(branch.id)}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={() => openEditBranch(branch.id)}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={!branch?.isActive ? () => handleActive(branch.id) : () => handleDeactive(branch.id)}
                                                className={`${!branch?.isActive ? 'text-green-600 focus:text-green-600' : 'text-destructive focus:text-destructive'}`}

                                            >
                                                {!branch?.isActive ? <Check className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                                {!branch?.isActive ? "Activate" : "Deactivate"}
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
                            disabled={skip === 0}
                            onClick={handlePrevious}
                        >
                            <PaginationPrevious />
                        </Button>
                        </PaginationItem>
                        {[...Array(noOfPages).keys()].map((i) => {
                            const pageNext = i * take
                            return (
                                <PaginationItem>
                                    <Button className={cn('rounded-lg')} onClick={() => setSkip(pageNext)} variant={skip === pageNext ? 'default' : 'outline'} >{i + 1}</Button>
                                </PaginationItem>
                            )
                        })}
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                variant="outline"
                                disabled={skip + take >= totalBranches}
                                onClick={handleNext}

                            >
                                <PaginationNext />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
            <ViewBranchModal branch={selectedBranch} open={viewBranchModalOpen} onClose={closeAllModals} />
            <EditBranchModal branch={selectedBranch} open={editBranchModalOpen} onClose={closeAllModals} />
        </div>
    )
}

export default BranchListTable
