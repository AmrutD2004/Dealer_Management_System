import { getBrandListWithoutPagination } from '@/api/endpoints'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
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
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/toast'
import type { BrandConfirmActionType, BrandListType } from '@/Types/brandMasterType'
import { cn } from 'cn'
import dayjs from 'dayjs'
import { Check, Eye, MoreHorizontal, Pencil, Tag, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ConfirmBrandActionModal } from './Modals/ConfirmBrandActionModal'
import { EditBrandModal } from './Modals/EditBrandModal'
import { ViewBrandModal } from './Modals/ViewBrandModal'

interface BrandListTableProps {
    refreshKey?: number
}

const PAGE_SIZE = 10

const BrandListTable = ({ refreshKey = 0 }: BrandListTableProps) => {
    const [brandList, setBrandList] = useState<BrandListType[]>([])
    const [page, setPage] = useState(0)
    const [localRefresh, setLocalRefresh] = useState(0)
    const [selectedBrand, setSelectedBrand] = useState<BrandListType | null>(null)
    const [confirmAction, setConfirmAction] = useState<BrandConfirmActionType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getBrandListWithoutPagination()
                if (data?.success) {
                    setBrandList(data?.data ?? [])
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

    const totalBrands = brandList.length
    const noOfPages = Math.ceil(totalBrands / PAGE_SIZE)
    const paginatedBrands = brandList.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    const openView = (brand: BrandListType) => {
        setSelectedBrand(brand)
        setViewOpen(true)
    }

    const openEdit = (brand: BrandListType) => {
        setSelectedBrand(brand)
        setEditOpen(true)
    }

    const openConfirmAction = (type: 'deactivate' | 'activate', brand: BrandListType) => {
        setConfirmAction({
            type,
            brandId: brand.id,
            brandName: brand.brandName,
        })
        setConfirmOpen(true)
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setConfirmOpen(false)
        setSelectedBrand(null)
        setConfirmAction(null)
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of all vehicle brands registered on the platform.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Brand Name</TableHead>
                        <TableHead className="text-left text-muted-foreground">Brand Code</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                        <TableHead className="text-center text-muted-foreground">Created</TableHead>
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {paginatedBrands.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                No brands created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedBrands.map((brand: BrandListType, idx: number) => (
                            <TableRow key={brand.id}>
                                <TableCell className='text-left font-medium'>{page * PAGE_SIZE + idx + 1}</TableCell>
                                <TableCell className='text-left flex items-center gap-3'>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                        <Tag className="h-4 w-4" />
                                    </span>
                                    {brand.brandName}
                                </TableCell>
                                <TableCell className="font-medium font-mono text-sm">{brand.brandCode}</TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={brand.isActive ? 'success' : 'destructive'}>
                                        {brand.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">{dayjs(brand.createdAt).format('DD MMM YYYY')}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${brand.brandName}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(brand)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => openEdit(brand)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() => openConfirmAction(brand.isActive ? 'deactivate' : 'activate', brand)}
                                                className={brand.isActive ? 'text-destructive focus:text-destructive' : 'text-green-600 focus:text-green-600'}
                                            >
                                                {brand.isActive ? <Trash2 className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                                                {brand.isActive ? "Deactivate" : "Activate"}
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
                        <PaginationItem>
                            <Button
                                variant="outline"
                                disabled={page === 0}
                                onClick={() => setPage(prev => Math.max(prev - 1, 0))}
                            >
                                <PaginationPrevious />
                            </Button>
                        </PaginationItem>
                        {[...Array(noOfPages).keys()].map((i) => (
                            <PaginationItem key={i}>
                                <Button
                                    
                                    onClick={() => setPage(i)}
                                    variant={page === i ? 'default' : 'outline'}
                                >
                                    {i + 1}
                                </Button>
                            </PaginationItem>
                        ))}
                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                        <PaginationItem>
                            <Button
                                variant="outline"
                                disabled={page + 1 >= noOfPages}
                                onClick={() => setPage(prev => Math.min(prev + 1, Math.max(noOfPages - 1, 0)))}
                            >
                                <PaginationNext />
                            </Button>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>

            <ViewBrandModal brand={selectedBrand} open={viewOpen} onClose={closeModals} />
            <EditBrandModal
                key={selectedBrand?.id ?? 'none'}
                brand={selectedBrand}
                open={editOpen}
                onClose={closeModals}
                onUpdated={() => setLocalRefresh(key => key + 1)}
            />
            <ConfirmBrandActionModal
                confirmAction={confirmAction}
                open={confirmOpen}
                onClose={closeModals}
                onDone={() => setLocalRefresh(key => key + 1)}
            />
        </div>
    )
}

export default BrandListTable
