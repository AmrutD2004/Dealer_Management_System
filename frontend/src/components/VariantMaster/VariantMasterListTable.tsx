import { getVisiblePageIndices } from '@/lib/pagination'
import { getBrandListWithoutPagination, getModelListWithoutPagination, getVariantListWithoutPagination } from '@/api/endpoints'
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
import SortableTableHead from '@/components/ui/sortable-table-head'
import { useTableSort } from '@/hooks/useTableSort'
import { toast } from '@/components/ui/toast'
import type { BrandListType } from '@/Types/brandMasterType'
import type { ModelListType } from '@/Types/modelMasterType'
import type { VariantConfirmActionType, VariantListType } from '@/Types/variantMasterType'
import { cn } from 'cn'
import dayjs from 'dayjs'
import { Check, Eye, Layers, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ConfirmVariantActionModal } from './Modals/ConfirmVariantActionModal'
import { EditVariantModal } from './Modals/EditVariantModal'
import { ViewVariantModal } from './Modals/ViewVariantModal'

interface VariantMasterListTableProps {
    refreshKey?: number
}

const PAGE_SIZE = 10

const VariantMasterListTable = ({ refreshKey = 0 }: VariantMasterListTableProps) => {
    const [variantList, setVariantList] = useState<VariantListType[]>([])
    const [models, setModels] = useState<ModelListType[]>([])
    const [brands, setBrands] = useState<BrandListType[]>([])
    const [page, setPage] = useState(0)
    const [localRefresh, setLocalRefresh] = useState(0)
    const [selectedVariant, setSelectedVariant] = useState<VariantListType | null>(null)
    const [confirmAction, setConfirmAction] = useState<VariantConfirmActionType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                const [variantData, modelData, brandData] = await Promise.all([
                    getVariantListWithoutPagination(),
                    getModelListWithoutPagination(),
                    getBrandListWithoutPagination(),
                ])
                if (variantData?.success) {
                    setVariantList(variantData?.data ?? [])
                }
                if (modelData?.success) {
                    setModels(modelData?.data ?? [])
                }
                if (brandData?.success) {
                    setBrands(brandData?.data ?? [])
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

    const totalVariants = variantList.length
    const noOfPages = Math.ceil(totalVariants / PAGE_SIZE)
    const { sortedData, sortKey, sortDirection, toggleSort } = useTableSort(variantList, {
        modelName: (variant) => {
            const model = models.find(item => item.id === variant.modelId)
            if (!model) return ''
            const brandName = brands.find(brand => brand.id === model.brandId)?.brandName ?? ''
            return `${brandName} ${model.modelName} - ${model.modelCode}`
        },
        production: (variant) => variant.productionFrom ?? '',
    })
    const paginatedVariants = sortedData.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    const getBrandName = (brandId: number) => {
        return brands.find(brand => brand.id === brandId)?.brandName ?? `#${brandId}`
    }

    const getModelLabel = (modelId: number) => {
        const model = models.find(item => item.id === modelId)
        if (!model) return `#${modelId}`
        return `${getBrandName(model.brandId)} ${model.modelName} - ${model.modelCode}`
    }

    const formatProduction = (variant: VariantListType) => {
        if (variant.productionFrom && variant.productionTo) {
            return `${dayjs(variant.productionFrom).format('MMM YYYY')} - ${dayjs(variant.productionTo).format('MMM YYYY')}`
        }
        if (variant.productionFrom) {
            return `${dayjs(variant.productionFrom).format('MMM YYYY')} - Present`
        }
        return '—'
    }

    const openView = (variant: VariantListType) => {
        setSelectedVariant(variant)
        setViewOpen(true)
    }

    const openEdit = (variant: VariantListType) => {
        setSelectedVariant(variant)
        setEditOpen(true)
    }

    const openConfirmAction = (type: 'deactivate' | 'activate', variant: VariantListType) => {
        setConfirmAction({
            type,
            variantId: variant.id,
            variantName: variant.variantName,
        })
        setConfirmOpen(true)
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setConfirmOpen(false)
        setSelectedVariant(null)
        setConfirmAction(null)
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of all vehicle variants registered on the platform.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <SortableTableHead label="Variant Name" sortKey="variantName" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Variant Code" sortKey="variantCode" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Model" sortKey="modelName" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Fuel Type" sortKey="fuelType" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Transmission" sortKey="transmissionType" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Production" sortKey="production" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} />
                        <SortableTableHead label="Status" sortKey="isActive" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-center" />
                        <SortableTableHead label="Created" sortKey="createdAt" activeKey={sortKey} direction={sortDirection} onSort={toggleSort} className="text-center" />
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {paginatedVariants.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                                No variants created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedVariants.map((variant: VariantListType, idx: number) => (
                            <TableRow key={variant.id}>
                                <TableCell className='text-left font-medium'>{page * PAGE_SIZE + idx + 1}</TableCell>
                                <TableCell className='text-left flex items-center gap-3'>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                        <Layers className="h-4 w-4" />
                                    </span>
                                    {variant.variantName}
                                </TableCell>
                                <TableCell className="font-medium font-mono text-sm">{variant.variantCode}</TableCell>
                                <TableCell className="font-medium">{getModelLabel(variant.modelId)}</TableCell>
                                <TableCell className="text-muted-foreground">{variant.fuelType}</TableCell>
                                <TableCell className="text-muted-foreground">{variant.transmissionType}</TableCell>
                                <TableCell className="text-muted-foreground whitespace-nowrap">{formatProduction(variant)}</TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={variant.isActive ? 'success' : 'destructive'}>
                                        {variant.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center whitespace-nowrap">{dayjs(variant.createdAt).format('DD MMM YYYY')}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${variant.variantName}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(variant)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => openEdit(variant)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() => openConfirmAction(variant.isActive ? 'deactivate' : 'activate', variant)}
                                                className={variant.isActive ? 'text-destructive focus:text-destructive' : 'text-green-600 focus:text-green-600'}
                                            >
                                                {variant.isActive ? <Trash2 className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                                                {variant.isActive ? "Deactivate" : "Activate"}
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
                        {getVisiblePageIndices(page * PAGE_SIZE, PAGE_SIZE, noOfPages).map((i) => (
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

            <ViewVariantModal
                variant={selectedVariant}
                modelName={selectedVariant ? getModelLabel(selectedVariant.modelId) : ''}
                open={viewOpen}
                onClose={closeModals}
            />
            <EditVariantModal
                key={selectedVariant?.id ?? 'none'}
                variant={selectedVariant}
                open={editOpen}
                onClose={closeModals}
                onUpdated={() => setLocalRefresh(key => key + 1)}
            />
            <ConfirmVariantActionModal
                confirmAction={confirmAction}
                open={confirmOpen}
                onClose={closeModals}
                onDone={() => setLocalRefresh(key => key + 1)}
            />
        </div>
    )
}

export default VariantMasterListTable
