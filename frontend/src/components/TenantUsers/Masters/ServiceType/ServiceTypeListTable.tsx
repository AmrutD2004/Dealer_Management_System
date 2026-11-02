import { getVisiblePageIndices } from '@/lib/pagination'
import { getServiceCategoryList, getServiceTypeList } from '@/api/endpoints'
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
import type { serviceCategoryListType, serviceTypeListType } from '@/Types/tenantCreateType'
import { useEffect, useState } from 'react'

interface ServiceTypeListTableProps {
    refreshKey?: number
}

const TAKE = 10

const ServiceTypeListTable = ({ refreshKey = 0 }: ServiceTypeListTableProps) => {
    const [serviceTypeList, setServiceTypeList] = useState<serviceTypeListType[]>([])
    const [totalServiceTypes, setTotalServiceTypes] = useState(0)
    const [skip, setSkip] = useState(0)
    const [categoryList, setCategoryList] = useState<serviceCategoryListType[]>([])

    useEffect(() => {
        const load = async () => {
            try {
                const [types, categories] = await Promise.all([
                    getServiceTypeList(skip, TAKE),
                    getServiceCategoryList(),
                ])
                if (types?.success) {
                    setServiceTypeList(types?.data)
                    setTotalServiceTypes(types?.count ?? 0)
                }
                if (categories?.success) {
                    setCategoryList(categories?.data)
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
    }, [refreshKey, skip])

    const noOfPages = Math.ceil(totalServiceTypes / TAKE)
    const pageCount = Math.max(noOfPages, 1)

    const getCategoryName = (categoryId: number) => {
        const category = categoryList.find((c: serviceCategoryListType) => c.id === categoryId)
        return category?.name || '-'
    }

    const { sortedData, sortKey, sortDirection, toggleSort } = useTableSort(serviceTypeList, {
        category: (row) => row.serviceCategoryMaster?.name ?? getCategoryName(row.serviceCategoryMasterId),
    })

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of service types.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <SortableTableHead label="Type Code" sortKey="code" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Type Name" sortKey="name" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Category" sortKey="category" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Description" sortKey="description" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Status" sortKey="isActive" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-center" />
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {serviceTypeList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                No service types created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        sortedData.map((type: serviceTypeListType, idx: number) => (
                            <TableRow key={type.id}>
                                <TableCell className='text-left font-medium'>{skip + idx + 1}</TableCell>
                                <TableCell className='text-left font-medium'>{type.code}</TableCell>
                                <TableCell className='text-left font-medium'>{type.name}</TableCell>
                                <TableCell className='text-left font-medium'>{getCategoryName(type.serviceCategoryMasterId)}</TableCell>
                                <TableCell className='text-left font-medium'>{type.description || '-'}</TableCell>
                                <TableCell className='text-center font-medium'><Badge variant={type.isActive ? 'success' : 'destructive'}>{type.isActive ? 'Active' : 'Deactive'}</Badge></TableCell>
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
                                    disabled={skip + TAKE >= totalServiceTypes}
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

export default ServiceTypeListTable