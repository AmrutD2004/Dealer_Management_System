import { getVisiblePageIndices } from '@/lib/pagination'
import { getErrorMessage } from "@/lib/utils"
import { activateStorage, deactivateStorage } from '@/api/endpoints'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import SortableTableHead from '@/components/ui/sortable-table-head'
import { useTableSort } from '@/hooks/useTableSort'
import { toast } from '@/components/ui/toast'
import { type storageListType } from '@/Types/tenantCreateType'
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
import { Check, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { TenantContext } from '@/Contexts/Tenant/TenantContext'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

const StorageListTable = () => {
    const { storageList, storageSkip, setStorageSkip, storageTake, totalStorages, fetchStorageList } = useContext(TenantContext)

    useEffect(() => {
        fetchStorageList(storageSkip, storageTake)
    }, [storageSkip, storageTake, fetchStorageList])

    const noOfPages = Math.ceil(totalStorages / storageTake)
    const { sortedData, sortKey, sortDirection, toggleSort } = useTableSort<storageListType>(storageList)

    const handleDeactive = async (id: number) => {
        try {
            const data = await deactivateStorage(Number(id))
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchStorageList(storageSkip, storageTake)
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: getErrorMessage(err)
            })
        }
    }

    const handleActive = async (id: number) => {
        try {
            const data = await activateStorage(Number(id))
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchStorageList(storageSkip, storageTake)
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: getErrorMessage(err)
            })
        }
    }

    const handlePrevious = () => {
        setStorageSkip((prev: number) =>
            Math.max(prev - storageTake, 0)
        )
    }

    const handleNext = () => {
        if (storageSkip + storageTake < totalStorages) {
            setStorageSkip((prev: number) => prev + storageTake)
        }
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of storages.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <SortableTableHead label="Storage Code" sortKey="storageCode" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Storage Name" sortKey="storageName" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Description" sortKey="description" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Status" sortKey="isActive" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-center" />
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {storageList.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className='text-center text-muted-foreground'>No storages created</TableCell>
                        </TableRow>
                    ) : (
                        sortedData.map((storage: storageListType, idx: number) => (
                            <TableRow key={storage.id}>
                                <TableCell className='text-left font-medium'>{storageSkip + idx + 1}</TableCell>
                                <TableCell className='text-left font-medium'>{storage.storageCode}</TableCell>
                                <TableCell className='text-left font-medium'>{storage.storageName}</TableCell>
                                <TableCell className='text-left font-medium max-w-[280px] truncate' title={storage.description || ''}>{storage.description || '—'}</TableCell>
                                <TableCell className='text-center font-medium'>
                                    <Badge variant={storage.isActive ? 'default' : 'outline'}>{storage.isActive ? 'Active' : 'Deactive'}</Badge>
                                </TableCell>
                                <TableCell className='flex items-center justify-end'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${storage.storageName}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => alert('View')} >
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => alert('Edit')} >
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={!storage?.isActive ? () => handleActive(storage.id) : () => handleDeactive(storage.id)}
                                                className={`${!storage?.isActive ? 'text-green-600 focus:text-green-600' : 'text-destructive focus:text-destructive'}`}
                                            >
                                                {!storage?.isActive ? <Check className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                                {!storage?.isActive ? "Activate" : "Deactivate"}
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
                            disabled={storageSkip === 0}
                            onClick={handlePrevious}
                        >
                            <PaginationPrevious />
                        </Button>
                        </PaginationItem>
                        {getVisiblePageIndices(storageSkip, storageTake, noOfPages).map((i) => {
                            const pageNext = i * storageTake
                            return (
                                <PaginationItem key={i}>
                                    <Button  onClick={() => setStorageSkip(pageNext)} variant={storageSkip === pageNext ? 'default' : 'outline'} >{i + 1}</Button>
                                </PaginationItem>
                            )
                        })}
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                variant="outline"
                                disabled={storageSkip + storageTake >= totalStorages}
                                onClick={handleNext}
                            >
                                <PaginationNext />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
        </div>
    )
}

export default StorageListTable