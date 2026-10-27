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

const formatDateTime = (value: string | null | undefined) => {
    return value ? dayjs(value).format('DD MMM YYYY, hh:mm A') : '—'
}

const JobCardAllocationListTable = ({ refreshKey = 0 }: JobCardAllocationListTableProps) => {
    const [allocationList, setAllocationList] = useState<JobCardAllocationType[]>([])
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
                        <TableHead className="text-left text-muted-foreground">Job Card No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Bay</TableHead>
                        <TableHead className="text-left text-muted-foreground">Mechanic</TableHead>
                        <TableHead className="text-left text-muted-foreground">Bay In</TableHead>
                        <TableHead className="text-left text-muted-foreground">Bay Out</TableHead>
                        <TableHead className="text-center text-muted-foreground">Job Card Status</TableHead>
                        <TableHead className="text-center text-muted-foreground">Allocation Status</TableHead>
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
                        allocationList.map((allocation: JobCardAllocationType, idx: number) => (
                            <TableRow key={allocation.id}>
                                <TableCell className='text-left font-medium'>{idx + 1}</TableCell>
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
