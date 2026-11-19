import { getVisiblePageIndices } from '@/lib/pagination'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import SortableTableHead from '@/components/ui/sortable-table-head'
import { useTableSort } from '@/hooks/useTableSort'
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
import { Eye, MoreHorizontal, Pencil } from 'lucide-react'
import { TenantContext } from '@/Contexts/Tenant/TenantContext'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ViewBinModal } from '../Modals/ViewBinModal'
import { EditBinModal } from '../Modals/EditBinModal'

const BinListTable = () => {
    const {
        binList, binSkip, setBinSkip, binTake, totalBins, fetchBinList,
        selectedBin, viewBinModalOpen, editBinModalOpen,
        openViewBin, openEditBin, closeAllBinModals,
    } = useContext(TenantContext)

    useEffect(() => {
        fetchBinList()
    }, [fetchBinList])

    const noOfPages = Math.ceil(totalBins / binTake)
    const { sortedData, sortKey, sortDirection, toggleSort } = useTableSort<binListType>(binList)
    const pagedBins = sortedData.slice(binSkip, binSkip + binTake)

    const handlePrevious = () => {
        setBinSkip((prev: number) => Math.max(prev - binTake, 0))
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
                        <SortableTableHead label="Description" sortKey="binDescription" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Storage" sortKey="storeId" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Status" sortKey="isActive" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-center" />
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {pagedBins.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className='text-center text-muted-foreground'>No bins created</TableCell>
                        </TableRow>
                    ) : (
                        pagedBins.map((bin: binListType, idx: number) => (
                            <TableRow key={bin.id}>
                                <TableCell className='text-left font-medium'>{binSkip + idx + 1}</TableCell>
                                <TableCell className='text-left font-medium'>{bin.binCode}</TableCell>
                                <TableCell className='text-left font-medium max-w-[280px] truncate' title={bin.binDescription || ''}>{bin.binDescription || '—'}</TableCell>
                                <TableCell className='text-left font-medium'>{bin.store?.code ?? `Storage #${bin.storeId}`}</TableCell>
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
                                                    aria-label={`Actions for ${bin.binCode}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openViewBin(bin.id)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => openEditBin(bin.id)}>
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
                                    <Button onClick={() => setBinSkip(pageNext)} variant={binSkip === pageNext ? 'default' : 'outline'} >{i + 1}</Button>
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
            <ViewBinModal bin={selectedBin} open={viewBinModalOpen} onClose={closeAllBinModals} />
            <EditBinModal bin={selectedBin} open={editBinModalOpen} onClose={closeAllBinModals} />
        </div>
    )
}

export default BinListTable
