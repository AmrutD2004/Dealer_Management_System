import { getBranchPartMasterList } from '@/api/endpoints'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import SortableTableHead from '@/components/ui/sortable-table-head'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/toast'
import { useTableSort } from '@/hooks/useTableSort'
import { getVisiblePageIndices } from '@/lib/pagination'
import { formatPartCurrency } from '@/components/TenantUsers/Masters/PartMaster/partOptions'
import type { BranchPartMasterListType } from '@/Types/branchPartMasterType'
import { Eye, MoreHorizontal, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EditBranchPartMasterModal } from '../Modals/EditBranchPartMasterModal'
import ViewBranchPartMasterModal from '../Modals/ViewBranchPartMasterModal'

interface BranchPartMasterListTableProps {
    refreshKey?: number
}

const TAKE = 9

const BranchPartMasterListTable = ({ refreshKey = 0 }: BranchPartMasterListTableProps) => {
    const [records, setRecords] = useState<BranchPartMasterListType[]>([])
    const [skip, setSkip] = useState(0)
    const [selectedRecord, setSelectedRecord] = useState<BranchPartMasterListType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [localRefresh, setLocalRefresh] = useState(0)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getBranchPartMasterList()
                if (data?.success) {
                    setRecords(data?.data ?? [])
                }
            } catch (err: unknown) {
                const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                toast.add({ type: 'error', description: message })
            }
        }
        load()
    }, [refreshKey, localRefresh])

    const totalRecords = records.length
    const pageCount = Math.max(Math.ceil(totalRecords / TAKE), 1)
    const { sortedData, sortKey, sortDirection, toggleSort } = useTableSort(records, {
        partNo: (row) => row.part?.partNo ?? `#${row.partId}`,
        storeCode: (row) => row.store?.code ?? `#${row.storeId}`,
        binCode: (row) => row.bin?.binCode ?? `#${row.binId}`,
        stockInHand: (row) => Number(row.stockInHand),
        sellingPrice: (row) => Number(row.sellingPrice ?? 0)
    })
    const pagedRecords = sortedData.slice(skip, skip + TAKE)

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setSelectedRecord(null)
    }

    const openView = (record: BranchPartMasterListType) => {
        setSelectedRecord(record)
        setViewOpen(true)
    }

    const openEdit = (record: BranchPartMasterListType) => {
        setSelectedRecord(record)
        setEditOpen(true)
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of parts assigned to this branch.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <SortableTableHead label="Part" sortKey="partNo" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Store" sortKey="storeCode" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Bin" sortKey="binCode" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Stock in Hand" sortKey="stockInHand" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-right" />
                        <SortableTableHead label="Selling Price" sortKey="sellingPrice" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-right" />
                        <TableHead className="text-center text-muted-foreground">Default Bin</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {records.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                No parts assigned to this branch yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        pagedRecords.map((record: BranchPartMasterListType, idx: number) => (
                            <TableRow key={record.id}>
                                <TableCell className='text-left font-medium'>{skip + idx + 1}</TableCell>
                                <TableCell className='text-left font-medium whitespace-nowrap'>
                                    <div className="flex flex-col">
                                        <span className="font-mono">{record.part?.partNo ?? `#${record.partId}`}</span>
                                        <span className="text-xs text-muted-foreground font-normal max-w-[200px] truncate" title={record.part?.partDescription}>
                                            {record.part?.partDescription ?? '—'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className='text-left font-medium whitespace-nowrap'>
                                    {record.store ? `${record.store.code} - ${record.store.description}` : `#${record.storeId}`}
                                </TableCell>
                                <TableCell className='text-left font-medium font-mono whitespace-nowrap'>
                                    {record.bin?.binCode ?? `#${record.binId}`}
                                </TableCell>
                                <TableCell className='text-right font-medium whitespace-nowrap'>{record.stockInHand}</TableCell>
                                <TableCell className='text-right font-medium whitespace-nowrap'>
                                    {record.sellingPrice == null ? '—' : formatPartCurrency(record.sellingPrice)}
                                </TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={record.isDefaultBin ? 'success' : 'outline'}>
                                        {record.isDefaultBin ? 'Yes' : 'No'}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={record.isActive ? 'success' : 'destructive'}>
                                        {record.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-right'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for part ${record.part?.partNo ?? record.partId}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(record)}>
                                                <Eye className="mr-2 h-4 w-4" />View
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => openEdit(record)}>
                                                <Pencil className="mr-2 h-4 w-4" />Edit
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
                            {getVisiblePageIndices(skip, TAKE, pageCount).map((i) => (
                                <PaginationItem key={i}>
                                    <Button onClick={() => setSkip(i * TAKE)} variant={skip === i * TAKE ? 'default' : 'outline'}>{i + 1}</Button>
                                </PaginationItem>
                            ))}
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    variant="outline"
                                    disabled={skip + TAKE >= totalRecords}
                                    onClick={() => setSkip((prev) => prev + TAKE)}
                                >
                                    <PaginationNext />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            <ViewBranchPartMasterModal record={selectedRecord} open={viewOpen} onClose={closeModals} />
            <EditBranchPartMasterModal
                key={selectedRecord?.id ?? 'none'}
                record={selectedRecord}
                open={editOpen}
                onClose={closeModals}
                onUpdated={() => setLocalRefresh((key) => key + 1)}
            />
        </div>
    )
}

export default BranchPartMasterListTable
