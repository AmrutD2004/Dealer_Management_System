import { getVisiblePageIndices } from '@/lib/pagination'
import { getPartFitmentList } from '@/api/endpoints'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import SortableTableHead from '@/components/ui/sortable-table-head'
import { useTableSort } from '@/hooks/useTableSort'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import { toast } from '@/components/ui/toast'
import type { PartFitmentListType } from '@/Types/partFitmentType'
import dayjs from 'dayjs'
import { Eye, MoreHorizontal, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EditPartFitmentModal } from '../Modals/EditPartFitmentModal'
import { ViewPartFitmentModal } from '../Modals/ViewPartFitmentModal'

interface PartFitmentListTableProps {
    refreshKey?: number
}

const TAKE = 10

const PartFitmentListTable = ({ refreshKey = 0 }: PartFitmentListTableProps) => {
    const [fitmentList, setFitmentList] = useState<PartFitmentListType[]>([])
    const [skip, setSkip] = useState(0)
    const [selectedFitment, setSelectedFitment] = useState<PartFitmentListType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [localRefresh, setLocalRefresh] = useState(0)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getPartFitmentList()
                if (data?.success) {
                    setFitmentList(data?.data ?? [])
                }
            } catch (err: unknown) {
                const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                toast.add({
                    type: 'error',
                    description: message
                })
            }
        }
        load()
    }, [refreshKey, localRefresh])

    const totalFitments = fitmentList.length
    const noOfPages = Math.ceil(totalFitments / TAKE)
    const pageCount = Math.max(noOfPages, 1)
    const { sortedData, sortKey, sortDirection, toggleSort } = useTableSort(fitmentList, {
        partNo: (fitment) => fitment.part?.partNo ?? '',
        brandName: (fitment) => fitment.brand?.brandName ?? '',
        modelName: (fitment) => fitment.model?.modelName ?? '',
        variantName: (fitment) => fitment.variant?.variantName ?? '',
    })
    const pagedFitments = sortedData.slice(skip, skip + TAKE)

    const getPartNo = (fitment: PartFitmentListType) => {
        return fitment.part?.partNo ?? `#${fitment.partId}`
    }

    const getBrandName = (fitment: PartFitmentListType) => {
        return fitment.brand?.brandName ?? `#${fitment.brandId}`
    }

    const getModelName = (fitment: PartFitmentListType) => {
        return fitment.model?.modelName ?? `#${fitment.modelId}`
    }

    const getVariantName = (fitment: PartFitmentListType) => {
        return fitment.variant?.variantName ?? `#${fitment.variantId}`
    }

    const getValidity = (fitment: PartFitmentListType) => {
        const from = dayjs(fitment.validFrom).format('DD MMM YYYY')
        const to = fitment.validTo ? dayjs(fitment.validTo).format('DD MMM YYYY') : 'No end date'
        return `${from} - ${to}`
    }

    const openView = (fitment: PartFitmentListType) => {
        setSelectedFitment(fitment)
        setViewOpen(true)
    }

    const openEdit = (fitment: PartFitmentListType) => {
        setSelectedFitment(fitment)
        setEditOpen(true)
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setSelectedFitment(null)
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of part fitments.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <SortableTableHead label="Part No." sortKey="partNo" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Brand" sortKey="brandName" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Model" sortKey="modelName" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Variant" sortKey="variantName" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Position" sortKey="position" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Qty" sortKey="quantity" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-center" />
                        <SortableTableHead label="OEM" sortKey="isOem" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-center" />
                        <SortableTableHead label="Validity" sortKey="validFrom" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {fitmentList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                                No part fitments created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        pagedFitments.map((fitment: PartFitmentListType, idx: number) => (
                            <TableRow key={fitment.id}>
                                <TableCell className='text-left font-medium'>{skip + idx + 1}</TableCell>
                                <TableCell className='text-left font-medium font-mono whitespace-nowrap'>{getPartNo(fitment)}</TableCell>
                                <TableCell className='text-left font-medium max-w-[140px] truncate' title={getBrandName(fitment)}>{getBrandName(fitment)}</TableCell>
                                <TableCell className='text-left font-medium max-w-[160px] truncate' title={getModelName(fitment)}>{getModelName(fitment)}</TableCell>
                                <TableCell className='text-left font-medium max-w-[180px] truncate' title={getVariantName(fitment)}>{getVariantName(fitment)}</TableCell>
                                <TableCell className='text-left font-medium max-w-[120px] truncate' title={fitment.position ?? undefined}>{fitment.position ?? '—'}</TableCell>
                                <TableCell className='text-center font-medium'>{Number(fitment.quantity)}</TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={fitment.isOem ? 'success' : 'outline'}>
                                        {fitment.isOem ? 'Yes' : 'No'}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-left font-medium whitespace-nowrap'>{getValidity(fitment)}</TableCell>
                                <TableCell className='text-right'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for fitment ${fitment.id}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(fitment)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => openEdit(fitment)}>
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
            {pageCount > 0 && (
                <div className="w-full flex items-center justify-center gap-4 mt-10">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    variant="outline"
                                    disabled={skip === 0}
                                    onClick={() => setSkip((prev) => Math.max(prev - TAKE, 0))}
                                >
                                    <PaginationPrevious />
                                </Button>
                            </PaginationItem>
                            {getVisiblePageIndices(skip, TAKE, pageCount).map((i) => {
                                const pageNext = i * TAKE
                                return (
                                    <PaginationItem key={i}>
                                        <Button onClick={() => setSkip(pageNext)} variant={skip === pageNext ? 'default' : 'outline'}>{i + 1}</Button>
                                    </PaginationItem>
                                )
                            })}
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    variant="outline"
                                    disabled={skip + TAKE >= totalFitments}
                                    onClick={() => setSkip((prev) => prev + TAKE)}
                                >
                                    <PaginationNext />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            <ViewPartFitmentModal fitment={selectedFitment} open={viewOpen} onClose={closeModals} />
            <EditPartFitmentModal
                key={selectedFitment?.id ?? 'none'}
                fitment={selectedFitment}
                open={editOpen}
                onClose={closeModals}
                onUpdated={() => setLocalRefresh(key => key + 1)}
            />
        </div>
    )
}

export default PartFitmentListTable
