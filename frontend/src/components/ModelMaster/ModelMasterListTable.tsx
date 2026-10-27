import { getBrandListWithoutPagination, getModelListWithoutPagination } from '@/api/endpoints'
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
import type { BrandListType } from '@/Types/brandMasterType'
import type { ModelConfirmActionType, ModelListType } from '@/Types/modelMasterType'
import { cn } from 'cn'
import dayjs from 'dayjs'
import { Car, Check, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getBodyTypeLabel } from './bodyTypeOptions'
import { ConfirmModelActionModal } from './Modals/ConfirmModelActionModal'
import { EditModelModal } from './Modals/EditModelModal'
import { ViewModelModal } from './Modals/ViewModelModal'

interface ModelMasterListTableProps {
    refreshKey?: number
}

const PAGE_SIZE = 10

const ModelMasterListTable = ({ refreshKey = 0 }: ModelMasterListTableProps) => {
    const [modelList, setModelList] = useState<ModelListType[]>([])
    const [brands, setBrands] = useState<BrandListType[]>([])
    const [page, setPage] = useState(0)
    const [localRefresh, setLocalRefresh] = useState(0)
    const [selectedModel, setSelectedModel] = useState<ModelListType | null>(null)
    const [confirmAction, setConfirmAction] = useState<ModelConfirmActionType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)

    useEffect(() => {
        const load = async () => {
            try {
                const [modelData, brandData] = await Promise.all([
                    getModelListWithoutPagination(),
                    getBrandListWithoutPagination(),
                ])
                if (modelData?.success) {
                    setModelList(modelData?.data ?? [])
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

    const totalModels = modelList.length
    const noOfPages = Math.ceil(totalModels / PAGE_SIZE)
    const paginatedModels = modelList.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

    const getBrandName = (brandId: number) => {
        return brands.find(brand => brand.id === brandId)?.brandName ?? `#${brandId}`
    }

    const openView = (model: ModelListType) => {
        setSelectedModel(model)
        setViewOpen(true)
    }

    const openEdit = (model: ModelListType) => {
        setSelectedModel(model)
        setEditOpen(true)
    }

    const openConfirmAction = (type: 'deactivate' | 'activate', model: ModelListType) => {
        setConfirmAction({
            type,
            modelId: model.id,
            modelName: model.modelName,
        })
        setConfirmOpen(true)
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setConfirmOpen(false)
        setSelectedModel(null)
        setConfirmAction(null)
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of all vehicle models registered on the platform.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Model Name</TableHead>
                        <TableHead className="text-left text-muted-foreground">Model Code</TableHead>
                        <TableHead className="text-left text-muted-foreground">Brand</TableHead>
                        <TableHead className="text-left text-muted-foreground">Body Type</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                        <TableHead className="text-center text-muted-foreground">Created</TableHead>
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {paginatedModels.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                No models created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        paginatedModels.map((model: ModelListType, idx: number) => (
                            <TableRow key={model.id}>
                                <TableCell className='text-left font-medium'>{page * PAGE_SIZE + idx + 1}</TableCell>
                                <TableCell className='text-left flex items-center gap-3'>
                                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                                        <Car className="h-4 w-4" />
                                    </span>
                                    {model.modelName}
                                </TableCell>
                                <TableCell className="font-medium font-mono text-sm">{model.modelCode}</TableCell>
                                <TableCell className="font-medium">{getBrandName(model.brandId)}</TableCell>
                                <TableCell className="text-muted-foreground">{getBodyTypeLabel(model.bodyType)}</TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={model.isActive ? 'success' : 'destructive'}>
                                        {model.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center">{dayjs(model.createdAt).format('DD MMM YYYY')}</TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${model.modelName}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(model)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => openEdit(model)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() => openConfirmAction(model.isActive ? 'deactivate' : 'activate', model)}
                                                className={model.isActive ? 'text-destructive focus:text-destructive' : 'text-green-600 focus:text-green-600'}
                                            >
                                                {model.isActive ? <Trash2 className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                                                {model.isActive ? "Deactivate" : "Activate"}
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
                                    className={cn('rounded-lg')}
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

            <ViewModelModal
                model={selectedModel}
                brandName={selectedModel ? getBrandName(selectedModel.brandId) : ''}
                open={viewOpen}
                onClose={closeModals}
            />
            <EditModelModal
                key={selectedModel?.id ?? 'none'}
                model={selectedModel}
                open={editOpen}
                onClose={closeModals}
                onUpdated={() => setLocalRefresh(key => key + 1)}
            />
            <ConfirmModelActionModal
                confirmAction={confirmAction}
                open={confirmOpen}
                onClose={closeModals}
                onDone={() => setLocalRefresh(key => key + 1)}
            />
        </div>
    )
}

export default ModelMasterListTable
