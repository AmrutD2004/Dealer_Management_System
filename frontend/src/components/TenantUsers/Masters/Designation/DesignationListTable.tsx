import { activateDesignation, deactivateDesignation } from '@/api/endpoints'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/toast'
import { type designationListType } from '@/Types/tenantCreateType'
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
import { ViewDesignationModal } from '../Modals/ViewDesignationModal'
import { EditDesignationModal } from '../Modals/EditDesignationModal'

const DesignationListTable = () => {
    const { designationList, designationSkip, setDesignationSkip, designationTake, totalDesignations, selectedDesignation, viewDesignationModalOpen, editDesignationModalOpen, openViewDesignation, openEditDesignation, closeAllDesignationModals, fetchDesignationList } = useContext(TenantContext)

    useEffect(() => {
        fetchDesignationList(designationSkip, designationTake)
    }, [designationSkip, designationTake, fetchDesignationList])

    const noOfPages = Math.ceil(totalDesignations / designationTake)

    const handleDeactive = async (id: number) => {
        try {
            const data = await deactivateDesignation(Number(id))
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchDesignationList(designationSkip, designationTake)
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
            const data = await activateDesignation(Number(id))
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchDesignationList(designationSkip, designationTake)
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: (err as any)?.response?.data?.message
            })
        }
    }

    const handlePrevious = () => {
        setDesignationSkip((prev: number) =>
            Math.max(prev - designationTake, 0)
        )
    }

    const handleNext = () => {
        if (designationSkip + designationTake < totalDesignations) {
            setDesignationSkip((prev: number) => prev + designationTake)
        }
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of designations.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className='text-left text-muted-foreground'>Designation Code</TableHead>
                        <TableHead className='text-left text-muted-foreground'>Designation Name</TableHead>
                        <TableHead className='text-left text-muted-foreground'>Description</TableHead>
                        <TableHead className="text-center text-muted-foreground">Mechanic</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {designationList.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={7} className='text-center text-muted-foreground'>No designations is created</TableCell>
                        </TableRow>
                    ) : (
                        designationList.map((designation: designationListType, idx: number) => (
                            <TableRow key={designation.id}>
                                <TableCell className='text-left font-medium'>{designationSkip + idx + 1}</TableCell>
                                <TableCell className='text-left font-medium'>{designation.code}</TableCell>
                                <TableCell className='text-left font-medium'>{designation.name}</TableCell>
                                <TableCell className='text-left font-medium max-w-[280px] truncate' title={designation.description ?? ''}>{designation.description || '—'}</TableCell>
                                <TableCell className='text-center font-medium'>
                                    <Badge variant={designation.isMechanic ? 'default' : 'outline'}>{designation.isMechanic ? 'Yes' : 'No'}</Badge>
                                </TableCell>
                                <TableCell className='text-center font-medium'><Badge variant={designation.isActive ? 'success' : 'destructive'}>{designation.isActive ? 'Active' : 'Deactive'}</Badge></TableCell>
                                <TableCell className='flex items-center justify-end'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${designation.name}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem
                                                onClick={() => openViewDesignation(designation.id)}
                                            >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem
                                                onClick={() => openEditDesignation(designation.id)}
                                            >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={!designation?.isActive ? () => handleActive(designation.id) : () => handleDeactive(designation.id)}
                                                className={`${!designation?.isActive ? 'text-green-600 focus:text-green-600' : 'text-destructive focus:text-destructive'}`}
                                            >
                                                {!designation?.isActive ? <Check className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                                {!designation?.isActive ? "Activate" : "Deactivate"}
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
                            disabled={designationSkip === 0}
                            onClick={handlePrevious}
                        >
                            <PaginationPrevious />
                        </Button>
                        </PaginationItem>
                        {[...Array(noOfPages).keys()].map((i) => {
                            const pageNext = i * designationTake
                            return (
                                <PaginationItem key={i}>
                                    <Button className={cn('rounded-lg')} onClick={() => setDesignationSkip(pageNext)} variant={designationSkip === pageNext ? 'default' : 'outline'} >{i + 1}</Button>
                                </PaginationItem>
                            )
                        })}
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                variant="outline"
                                disabled={designationSkip + designationTake >= totalDesignations}
                                onClick={handleNext}
                            >
                                <PaginationNext />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
            <ViewDesignationModal designation={selectedDesignation} open={viewDesignationModalOpen} onClose={closeAllDesignationModals} />
            <EditDesignationModal designation={selectedDesignation} open={editDesignationModalOpen} onClose={closeAllDesignationModals} />
        </div>
    )
}

export default DesignationListTable
