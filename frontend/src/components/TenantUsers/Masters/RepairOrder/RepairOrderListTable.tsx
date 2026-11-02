import { getVisiblePageIndices } from '@/lib/pagination'
import { getRepairOrderList } from '@/api/endpoints'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { type repairOrderListType } from '@/Types/tenantCreateType'
import { useEffect, useState } from 'react'

interface RepairOrderListTableProps {
    refreshKey?: number
}

const TAKE = 10

const RepairOrderListTable = ({ refreshKey = 0 }: RepairOrderListTableProps) => {
    const [repairOrderList, setRepairOrderList] = useState<repairOrderListType[]>([])
    const [skip, setSkip] = useState(0)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getRepairOrderList()
                if (data?.success) {
                    setRepairOrderList(data?.data)
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
    }, [refreshKey])

    const totalRepairOrders = repairOrderList.length
    const noOfPages = Math.ceil(totalRepairOrders / TAKE)
    const pageCount = Math.max(noOfPages, 1)
    const { sortedData, sortKey, sortDirection, toggleSort } = useTableSort(repairOrderList)
    const pagedRepairOrders = sortedData.slice(skip, skip + TAKE)

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of repair orders.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <SortableTableHead label="Repair Order Code" sortKey="code" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Repair Order Name" sortKey="name" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Description" sortKey="description" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Status" sortKey="isActive" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-center" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {repairOrderList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                No repair orders created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        pagedRepairOrders.map((repairOrder: repairOrderListType, idx: number) => (
                            <TableRow key={repairOrder.id}>
                                <TableCell className='text-left font-medium'>{skip + idx + 1}</TableCell>
                                <TableCell className='text-left font-medium'>{repairOrder.code}</TableCell>
                                <TableCell className='text-left font-medium'>{repairOrder.name}</TableCell>
                                <TableCell className='text-left font-medium'>{repairOrder.description || '-'}</TableCell>
                                <TableCell className='text-center font-medium'><Badge variant={repairOrder.isActive ? 'success' : 'destructive'}>{repairOrder.isActive ? 'Active' : 'Deactive'}</Badge></TableCell>
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
                                    disabled={skip + TAKE >= totalRepairOrders}
                                    onClick={() => setSkip((prev) => prev + TAKE)}
                                >
                                    <PaginationNext />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
        </div>
    )
}

export default RepairOrderListTable