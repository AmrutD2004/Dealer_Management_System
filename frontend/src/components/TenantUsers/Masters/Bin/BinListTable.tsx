import { getVisiblePageIndices } from '@/lib/pagination'
import { getErrorMessage } from "@/lib/utils"
import { activateBin, deactivateBin } from '@/api/endpoints'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import SortableTableHead from '@/components/ui/sortable-table-head'
import { useTableSort } from '@/hooks/useTableSort'
import { toast } from '@/components/ui/toast'
import { type binListType } from '@/Types/tenantCreateType'
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
import { Badge } from '@/components/ui/badge'
import { Check, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { TenantContext } from '@/Contexts/Tenant/TenantContext'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const BinListTable = () => {
    const { binList, binSkip, setBinSkip, binTake, totalBins, fetchBinList } = useContext(TenantContext)

    useEffect(() => {
        fetchBinList(binSkip, binTake)
    }, [binSkip, binTake, fetchBinList])

    const noOfPages = Math.ceil(totalBins / binTake)
    const { sortedData, sortKey, sortDirection, toggleSort } = useTableSort<binListType>(binList)

    const handleDeactive = async (id: number) => {
        try {
            const data = await deactivateBin(Number(id))
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchBinList(binSkip, binTake)
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: getErrorMessage(err)
            })
        }
    }

    const handleActive = async (id: number) => {
        try {
            const data = await activateBin(Number(id))
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchBinList(binSkip, binTake)
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: getErrorMessage(err)
            })
        }
    }

    const handlePrevious = () => {
        setBinSkip((prev: number) =>
            Math.max(prev - binTake, 0)
        )
    }

    const handleNext = () => {
        if (binSkip + binTake < totalBins) {
            setBinSkip((prev: number) => prev + binTake)
        }
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of bins.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <SortableTableHead label="Bin Code" sortKey="binCode" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Bin Name" sortKey="binName" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Description" sortKey="description" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Status" sortKey="isActive" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-center" />
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {binList.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className='text-center text-muted-foreground'>No bins created</TableCell>
                        </TableRow>
                    ) : (
                        sortedData.map((bin: binListType, idx: number) => (
                            <TableRow key={bin.id}>
                                <TableCell className='text-left font-medium'>{binSkip + idx + 1}</TableCell>
                                <TableCell className='text-left font-medium'>{bin.binCode}</TableCell>
                                <TableCell className='text-left font-medium'>{bin.binName}</TableCell>
                                <TableCell className='text-left font-medium max-w-[280px] truncate' title={bin.description || ''}>{bin.description || '—'}</TableCell>
                                <TableCell className='text-center font-medium'>
                                    <Badge variant={bin.isActive ? 'default' : 'outline'}>{bin.isActive ? 'Active' : 'Deactive'}</Badge>
                                </TableCell>
                                <TableCell className='flex items-center justify-end'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${bin.binName}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => alert('View')} >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => alert('Edit')} >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={!bin?.isActive ? () => handleActive(bin.id) : () => handleDeactive(bin.id)}
                                                className={`${!bin?.isActive ? 'text-green-600 focus:text-green-600' : 'text-destructive focus:text-destructive'}`}
                                            >
                                                {!bin?.isActive ? <Check className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                                {!bin?.isActive ? "Activate" : "Deactivate"}
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
                            disabled={binSkip === 0}
                            onClick={handlePrevious}
                        >
                            <PaginationPrevious />
                        </Button>
                        </PaginationItem>
                        {getVisiblePageIndices(binSkip, binTake, noOfPages).map((i) => {
                            const pageNext = i * binTake
                            return (
                                <PaginationItem key={i}>
                                    <Button  onClick={() => setBinSkip(pageNext)} variant={binSkip === pageNext ? 'default' : 'outline'} >{i + 1}</Button>
                                </PaginationItem>
                            )
                        })}
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                variant="outline"
                                disabled={binSkip + binTake >= totalBins}
                                onClick={handleNext}
                            >
                                <PaginationNext />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}

export default BinListTable