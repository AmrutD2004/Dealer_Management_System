import { getVisiblePageIndices } from '@/lib/pagination'
import { getJobCardAllocationList } from '@/api/endpoints'
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
import type { JobCardAllocationType } from '@/Types/jobCardAllocationType'
import dayjs from 'dayjs'
import { Eye, MoreHorizontal, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EditJobCardAllocationModal } from './Modals/EditJobCardAllocationModal'
import { ViewJobCardAllocationModal } from './Modals/ViewJobCardAllocationModal'

interface JobCardAllocationListTableProps {
    refreshKey?: number
}

const TAKE = 10

const formatDateTime = (value: string | null | undefined) => {
    return value ? dayjs(value).format('DD MMM YYYY, hh:mm A') : '—'
}

const JobCardAllocationListTable = ({ refreshKey = 0 }: JobCardAllocationListTableProps) => {
    const [allocationList, setAllocationList] = useState<JobCardAllocationType[]>([])
    const [skip, setSkip] = useState(0)
    const [selectedAllocation, setSelectedAllocation] = useState<JobCardAllocationType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [localRefresh, setLocalRefresh] = useState(0)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getJobCardAllocationList()
                if (data?.success) {
                    setAllocationList(data?.data ?? [])
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

    const totalAllocations = allocationList.length
    const noOfPages = Math.ceil(totalAllocations / TAKE)
    const pageCount = Math.max(noOfPages, 1)
    const { sortedData, sortKey, sortDirection, toggleSort } = useTableSort(allocationList, {
        jobCardNo: (allocation) => allocation.jobCard?.jobCardNo ?? '',
        bayName: (allocation) => allocation.bay?.bayName ?? '',
        mechanicName: (allocation) => allocation.mechanic ? `${allocation.mechanic.firstName} ${allocation.mechanic.lastName ?? ''}`.trim() : '',
        jobCardStatus: (allocation) => allocation.jobCard?.status ?? '',
        allocationStatus: (allocation) => allocation.bayOutTime ? 'Released' : 'In Bay',
    })
    const pagedAllocations = sortedData.slice(skip, skip + TAKE)

    const getMechanicName = (allocation: JobCardAllocationType) => {
        if (!allocation.mechanic) return `#${allocation.mechanicId}`
        return `${allocation.mechanic.firstName} ${allocation.mechanic.lastName ?? ''}`.trim()
    }

    const openView = (allocation: JobCardAllocationType) => {
        setSelectedAllocation(allocation)
        setViewOpen(true)
    }

    const openEdit = (allocation: JobCardAllocationType) => {
        setSelectedAllocation(allocation)
        setEditOpen(true)
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setSelectedAllocation(null)
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of job card allocations.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <SortableTableHead label="Job Card No." sortKey="jobCardNo" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Bay" sortKey="bayName" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Mechanic" sortKey="mechanicName" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Bay In" sortKey="bayInDateTime" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Bay Out" sortKey="bayOutTime" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Job Card Status" sortKey="jobCardStatus" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-center" />
                        <SortableTableHead label="Allocation Status" sortKey="allocationStatus" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-center" />
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {allocationList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={9} className="text-center text-muted-foreground py-8">
                                No job card allocations created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        pagedAllocations.map((allocation: JobCardAllocationType, idx: number) => (
                            <TableRow key={allocation.id}>
                                <TableCell className='text-left font-medium'>{skip + idx + 1}</TableCell>
                                <TableCell className='text-left font-semibold font-mono whitespace-nowrap'>
                                    {allocation.jobCard?.jobCardNo ?? `#${allocation.jobCardId}`}
                                </TableCell>
                                <TableCell className='text-left font-medium max-w-[180px] truncate' title={allocation.bay?.bayName ?? undefined}>
                                    {allocation.bay?.bayName ?? '—'}
                                </TableCell>
                                <TableCell className='text-left font-medium max-w-[180px] truncate' title={getMechanicName(allocation)}>
                                    {getMechanicName(allocation)}
                                </TableCell>
                                <TableCell className='text-left font-medium whitespace-nowrap'>{formatDateTime(allocation.bayInDateTime)}</TableCell>
                                <TableCell className='text-left font-medium whitespace-nowrap'>{formatDateTime(allocation.bayOutTime)}</TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={allocation.jobCard?.status === 'OPEN' ? 'success' : 'outline'}>
                                        {allocation.jobCard?.status === 'OPEN' ? 'Open' : 'Closed'}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={allocation.bayOutTime ? 'outline' : 'success'}>
                                        {allocation.bayOutTime ? 'Released' : 'In Bay'}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-right'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for allocation ${allocation.id}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(allocation)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => openEdit(allocation)}>
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
                                    disabled={skip + TAKE >= totalAllocations}
                                    onClick={() => setSkip((prev) => prev + TAKE)}
                                >
                                    <PaginationNext />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            <ViewJobCardAllocationModal allocation={selectedAllocation} open={viewOpen} onClose={closeModals} />
            <EditJobCardAllocationModal
                key={selectedAllocation?.id ?? 'none'}
                allocation={selectedAllocation}
                open={editOpen}
                onClose={closeModals}
                onUpdated={() => setLocalRefresh(key => key + 1)}
            />
        </div>
    )
}

export default JobCardAllocationListTable
