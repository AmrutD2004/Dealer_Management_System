import { getVisiblePageIndices } from '@/lib/pagination'
import { getPartMasterList } from '@/api/endpoints'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
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
import type { PartMasterConfirmActionType, PartMasterListType } from '@/Types/partMasterType'
import { Check, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ConfirmPartMasterActionModal } from '../Modals/ConfirmPartMasterActionModal'
import { EditPartMasterModal } from '../Modals/EditPartMasterModal'
import { ViewPartMasterModal } from '../Modals/ViewPartMasterModal'
import { formatPartCurrency, getPartStatusLabel, getPartStatusVariant, getPartUnitLabel } from './partOptions'

interface PartMasterListTableProps {
    refreshKey?: number
}

const TAKE = 10

const PartMasterListTable = ({ refreshKey = 0 }: PartMasterListTableProps) => {
    const [partList, setPartList] = useState<PartMasterListType[]>([])
    const [skip, setSkip] = useState(0)
    const [selectedPart, setSelectedPart] = useState<PartMasterListType | null>(null)
    const [confirmAction, setConfirmAction] = useState<PartMasterConfirmActionType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [localRefresh, setLocalRefresh] = useState(0)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getPartMasterList()
                if (data?.success) {
                    setPartList(data?.data ?? [])
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

    const totalParts = partList.length
    const noOfPages = Math.ceil(totalParts / TAKE)
    const pageCount = Math.max(noOfPages, 1)
    const { sortedData, sortKey, sortDirection, toggleSort } = useTableSort(partList, {
        categoryName: (part) => part.category ? `${part.category.code} - ${part.category.name}` : part.partCategoryId ? `#${part.partCategoryId}` : '',
        hsnCode: (part) => part.hsn?.hsnCode ?? (part.hsnId ? `#${part.hsnId}` : ''),
    })
    const pagedParts = sortedData.slice(skip, skip + TAKE)

    const getCategoryName = (part: PartMasterListType) => {
        if (part.category) {
            return `${part.category.code} - ${part.category.name}`
        }
        return part.partCategoryId ? `#${part.partCategoryId}` : '—'
    }

    const getHSNCode = (part: PartMasterListType) => {
        return part.hsn?.hsnCode ?? (part.hsnId ? `#${part.hsnId}` : '—')
    }

    const isPartActive = (part: PartMasterListType) => part.status === 'ACTIVE'

    const openView = (part: PartMasterListType) => {
        setSelectedPart(part)
        setViewOpen(true)
    }

    const openEdit = (part: PartMasterListType) => {
        setSelectedPart(part)
        setEditOpen(true)
    }

    const openConfirmAction = (type: 'deactivate' | 'activate', part: PartMasterListType) => {
        setConfirmAction({
            type,
            partId: part.id,
            partNo: part.partNo,
        })
        setConfirmOpen(true)
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setConfirmOpen(false)
        setSelectedPart(null)
        setConfirmAction(null)
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of parts.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <SortableTableHead label="Part No." sortKey="partNo" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Category" sortKey="categoryName" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="HSN" sortKey="hsnCode" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Selling Price" sortKey="sellingPrice" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-right" />
                        <SortableTableHead label="Tax" sortKey="taxRate" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-right" />
                        <SortableTableHead label="Unit" sortKey="unitOfMeasure" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Fast Moving" sortKey="isFastMoving" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-center" />
                        <SortableTableHead label="Status" sortKey="status" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-center" />
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {partList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                                No parts created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        pagedParts.map((part: PartMasterListType, idx: number) => (
                            <TableRow key={part.id}>
                                <TableCell className='text-left font-medium'>{skip + idx + 1}</TableCell>
                                <TableCell className='text-left font-medium font-mono whitespace-nowrap'>{part.partNo}</TableCell>
                                <TableCell className='text-left font-medium max-w-[220px] truncate' title={getCategoryName(part)}>{getCategoryName(part)}</TableCell>
                                <TableCell className='text-left font-medium font-mono'>{getHSNCode(part)}</TableCell>
                                <TableCell className='text-right font-medium whitespace-nowrap'>{formatPartCurrency(part.sellingPrice)}</TableCell>
                                <TableCell className='text-right font-medium whitespace-nowrap'>{Number(part.taxRate)}%</TableCell>
                                <TableCell className='text-left font-medium whitespace-nowrap'>{getPartUnitLabel(part.unitOfMeasure)}</TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={part.isFastMoving ? 'success' : 'outline'}>
                                        {part.isFastMoving ? 'Yes' : 'No'}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={getPartStatusVariant(part.status)}>
                                        {getPartStatusLabel(part.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-right'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${part.partNo}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(part)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => openEdit(part)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() => openConfirmAction(isPartActive(part) ? 'deactivate' : 'activate', part)}
                                                className={isPartActive(part) ? 'text-destructive focus:text-destructive' : 'text-green-600 focus:text-green-600'}
                                            >
                                                {isPartActive(part) ? <Trash2 className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                                                {isPartActive(part) ? "Deactivate" : "Activate"}
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
                                    disabled={skip + TAKE >= totalParts}
                                    onClick={() => setSkip((prev) => prev + TAKE)}
                                >
                                    <PaginationNext />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            <ViewPartMasterModal part={selectedPart} open={viewOpen} onClose={closeModals} />
            <EditPartMasterModal
                key={selectedPart?.id ?? 'none'}
                part={selectedPart}
                open={editOpen}
                onClose={closeModals}
                onUpdated={() => setLocalRefresh(key => key + 1)}
            />
            <ConfirmPartMasterActionModal
                confirmAction={confirmAction}
                open={confirmOpen}
                onClose={closeModals}
                onDone={() => setLocalRefresh(key => key + 1)}
            />
        </div>
    )
}

export default PartMasterListTable
