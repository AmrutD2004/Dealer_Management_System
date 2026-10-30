import { getVisiblePageIndices } from '@/lib/pagination'
import { getDealerBayList } from '@/api/endpoints'
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
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination'
import { toast } from '@/components/ui/toast'
import SortableTableHead from '@/components/ui/sortable-table-head'
import { useTableSort } from '@/hooks/useTableSort'
import type { DealerBayConfirmActionType, DealerBayMasterType } from '@/Types/dealerBayType'
import dayjs from 'dayjs'
import { Check, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ConfirmDealerBayActionModal } from '../Modals/ConfirmDealerBayActionModal'
import { EditDealerBayModal } from '../Modals/EditDealerBayModal'
import { ViewDealerBayModal } from '../Modals/ViewDealerBayModal'

interface DealerBayListTableProps {
    refreshKey?: number
}

const TAKE = 10

const DealerBayListTable = ({ refreshKey = 0 }: DealerBayListTableProps) => {
    const [bayList, setBayList] = useState<DealerBayMasterType[]>([])
    const [skip, setSkip] = useState(0)
    const [selectedBay, setSelectedBay] = useState<DealerBayMasterType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [confirmAction, setConfirmAction] = useState<DealerBayConfirmActionType | null>(null)
    const [localRefresh, setLocalRefresh] = useState(0)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getDealerBayList()
                if (data?.success) {
                    setBayList(data?.data ?? [])
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

    const totalBays = bayList.length
    const noOfPages = Math.ceil(totalBays / TAKE)
    const pageCount = Math.max(noOfPages, 1)
    const { sortedData, sortKey, sortDirection, toggleSort } = useTableSort(bayList, {
        branchName: (bay) => bay.branch ? `${bay.branch.branchName} (${bay.branch.branchCode})` : `#${bay.branchId}`,
    })
    const pagedBays = sortedData.slice(skip, skip + TAKE)

    const getBranchName = (bay: DealerBayMasterType) => {
        if (!bay.branch) return `#${bay.branchId}`
        return `${bay.branch.branchName} (${bay.branch.branchCode})`
    }

    const openView = (bay: DealerBayMasterType) => {
        setSelectedBay(bay)
        setViewOpen(true)
    }

    const openEdit = (bay: DealerBayMasterType) => {
        setSelectedBay(bay)
        setEditOpen(true)
    }

    const openConfirm = (bay: DealerBayMasterType) => {
        setConfirmAction({
            type: bay.isActive ? 'deactivate' : 'activate',
            bayId: bay.id,
            bayName: bay.bayName
        })
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setSelectedBay(null)
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of dealer bays.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <SortableTableHead label="Bay Code" sortKey="bayCode" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Bay Name" sortKey="bayName" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Branch" sortKey="branchName" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Description" sortKey="description" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Status" sortKey="isActive" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-center" />
                        <SortableTableHead label="Created At" sortKey="createdAt" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {bayList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                No dealer bays created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        pagedBays.map((bay: DealerBayMasterType, idx: number) => (
                            <TableRow key={bay.id}>
                                <TableCell className='text-left font-medium'>{skip + idx + 1}</TableCell>
                                <TableCell className='text-left font-medium font-mono whitespace-nowrap'>{bay.bayCode}</TableCell>
                                <TableCell className='text-left font-medium max-w-[180px] truncate' title={bay.bayName}>{bay.bayName}</TableCell>
                                <TableCell className='text-left font-medium max-w-[200px] truncate' title={getBranchName(bay)}>{getBranchName(bay)}</TableCell>
                                <TableCell className='text-left font-medium max-w-[220px] truncate' title={bay.description ?? undefined}>{bay.description ?? '—'}</TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={bay.isActive ? 'success' : 'destructive'}>
                                        {bay.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-left font-medium whitespace-nowrap'>{dayjs(bay.createdAt).format('DD MMM YYYY')}</TableCell>
                                <TableCell className='text-right'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for bay ${bay.bayName}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(bay)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => openEdit(bay)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() => openConfirm(bay)}
                                                className={bay.isActive ? 'text-destructive focus:text-destructive' : 'text-green-600 focus:text-green-600'}
                                            >
                                                {bay.isActive ? <Trash2 className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                                                {bay.isActive ? 'Deactivate' : 'Activate'}
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
                                    disabled={skip + TAKE >= totalBays}
                                    onClick={() => setSkip((prev) => prev + TAKE)}
                                >
                                    <PaginationNext />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            <ViewDealerBayModal bay={selectedBay} open={viewOpen} onClose={closeModals} />
            <EditDealerBayModal
                key={selectedBay?.id ?? 'none'}
                bay={selectedBay}
                open={editOpen}
                onClose={closeModals}
                onUpdated={() => setLocalRefresh(key => key + 1)}
            />
            <ConfirmDealerBayActionModal
                confirmAction={confirmAction}
                open={Boolean(confirmAction)}
                onClose={() => setConfirmAction(null)}
                onDone={() => setLocalRefresh(key => key + 1)}
            />
        </div>
    )
}

export default DealerBayListTable
