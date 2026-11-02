import { getVisiblePageIndices } from '@/lib/pagination'
import { activateLabour, deactivateLabour, getLabourList } from '@/api/endpoints'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import SortableTableHead from '@/components/ui/sortable-table-head'
import { useTableSort } from '@/hooks/useTableSort'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { labourListType } from '@/Types/tenantCreateType'
import { Check, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ViewLabourModal } from '../Modals/ViewLabourModal'
import { EditLabourModal } from '../Modals/EditLabourModal'

interface LabourListTableProps {
    refreshKey?: number
}

const TAKE = 10

const LabourListTable = ({ refreshKey = 0 }: LabourListTableProps) => {
    const [labourList, setLabourList] = useState<labourListType[]>([])
    const [totalLabours, setTotalLabours] = useState(0)
    const [skip, setSkip] = useState(0)
    const [selectedLabour, setSelectedLabour] = useState<labourListType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [localRefresh, setLocalRefresh] = useState(0)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getLabourList(skip, TAKE)
                if (data?.success) {
                    setLabourList(data?.data)
                    setTotalLabours(data?.count ?? 0)
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
    }, [refreshKey, localRefresh, skip])

    const noOfPages = Math.ceil(totalLabours / TAKE)
    const pageCount = Math.max(noOfPages, 1)
    const { sortedData, sortKey, sortDirection, toggleSort } = useTableSort(labourList)

    const handleDeactive = async (id: number) => {
        try {
            const data = await deactivateLabour(Number(id))
            if (data?.success) {
                toast.add({ type: 'success', description: data?.message })
                setLocalRefresh(key => key + 1)
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            })
        }
    }

    const handleActive = async (id: number) => {
        try {
            const data = await activateLabour(Number(id))
            if (data?.success) {
                toast.add({ type: 'success', description: data?.message })
                setLocalRefresh(key => key + 1)
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            })
        }
    }

    const openView = (labour: labourListType) => {
        setSelectedLabour(labour)
        setViewOpen(true)
    }

    const openEdit = (labour: labourListType) => {
        setSelectedLabour(labour)
        setEditOpen(true)
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setSelectedLabour(null)
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of labours.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <SortableTableHead label="Labour Code" sortKey="labourCode" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Labour Name" sortKey="labourName" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Rate" sortKey="rate" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Standard Hours" sortKey="standardHours" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Description" sortKey="labourDescription" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Status" sortKey="isActive" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-center" />
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {labourList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                No labours created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedData.map((labour: labourListType, idx: number) => (
                            <TableRow key={labour.id}>
                                <TableCell className='text-left font-medium'>{skip + idx + 1}</TableCell>
                                <TableCell className='text-left font-medium'>{labour.labourCode}</TableCell>
                                <TableCell className='text-left font-medium'>{labour.labourName}</TableCell>
                                <TableCell className='text-left font-medium'>{String(labour.rate ?? '-')}</TableCell>
                                <TableCell className='text-left font-medium'>{String(labour.standardHours ?? '-')}</TableCell>
                                <TableCell className='text-left font-medium'>{labour.labourDescription || '-'}</TableCell>
                                <TableCell className='text-center font-medium'><Badge variant={labour.isActive ? 'success' : 'destructive'}>{labour.isActive ? 'Active' : 'Deactive'}</Badge></TableCell>
                                <TableCell className='flex items-center justify-end'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${labour.labourName}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(labour)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => openEdit(labour)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={!labour?.isActive ? () => handleActive(labour.id) : () => handleDeactive(labour.id)}
                                                className={`${!labour?.isActive ? 'text-green-600 focus:text-green-600' : 'text-destructive focus:text-destructive'}`}
                                            >
                                                {!labour?.isActive ? <Check className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                                {!labour?.isActive ? "Activate" : "Deactivate"}
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
                                    disabled={skip + TAKE >= totalLabours}
                                    onClick={() => setSkip((prev) => prev + TAKE)}
                                >
                                    <PaginationNext />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}

            <ViewLabourModal labour={selectedLabour} open={viewOpen} onClose={closeModals} />
            <EditLabourModal labour={selectedLabour} open={editOpen} onClose={closeModals} onUpdated={() => setLocalRefresh(key => key + 1)} />
        </div>
    )
}

export default LabourListTable
