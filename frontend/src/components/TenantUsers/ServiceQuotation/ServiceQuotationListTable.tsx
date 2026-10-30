import { getServiceQuotationList } from '@/api/endpoints'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
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
import { getVisiblePageIndices } from '@/lib/pagination'
import type { serviceQuotationListType, serviceQuotationStatus } from '@/Types/serviceQuotationType'
import { Eye, MoreHorizontal, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EditServiceQuotationModal } from './Modals/EditServiceQuotationModal'
import { ViewServiceQuotationModal } from './Modals/ViewServiceQuotationModal'

const TAKE = 10

const statusLabels: Record<serviceQuotationStatus, string> = {
    DRAFT: 'Draft',
    INPROGRESS: 'In Progress',
    APPROVED: 'Approved',
    COMPLETED: 'Completed',
    GENERATED: 'Generated',
    REJECTED: 'Rejected',
}

const statusVariants: Record<
    serviceQuotationStatus,
    'success' | 'destructive' | 'secondary' | 'outline' | 'default'
> = {
    DRAFT: 'outline',
    INPROGRESS: 'secondary',
    APPROVED: 'success',
    COMPLETED: 'success',
    GENERATED: 'default',
    REJECTED: 'destructive',
}

const formatCurrency = (value: string | number) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    }).format(Number(value || 0))

interface ServiceQuotationListTableProps {
    refreshKey?: number
}

const ServiceQuotationListTable = ({ refreshKey = 0 }: ServiceQuotationListTableProps) => {
    const [quotations, setQuotations] = useState<serviceQuotationListType[]>([])
    const [totalQuotations, setTotalQuotations] = useState(0)
    const [skip, setSkip] = useState(0)
    const [loading, setLoading] = useState(false)
    const [selectedQuotation, setSelectedQuotation] = useState<serviceQuotationListType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [reloadKey, setReloadKey] = useState(0)

    const noOfPages = Math.ceil(totalQuotations / TAKE)
    const pageCount = Math.max(noOfPages, 1)
    const pagedQuotations = quotations.slice(skip, skip + TAKE)

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            setLoading(true)
            try {
                const data = await getServiceQuotationList()
                if (cancelled) return
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : []
                setQuotations(list)
                setTotalQuotations(
                    typeof data?.count === 'number'
                        ? data.count
                        : typeof data?.total === 'number'
                            ? data.total
                            : list.length
                )
                setSkip((prev) => (prev < list.length ? prev : 0))
            } catch (err: unknown) {
                if (cancelled) return
                const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                toast.add({
                    type: 'error',
                    description: message ?? 'Failed to load service quotations',
                })
            } finally {
                if (!cancelled) setLoading(false)
            }
        }
        load()
        return () => {
            cancelled = true
        }
    }, [refreshKey, reloadKey])

    const openView = (quotation: serviceQuotationListType) => {
        setSelectedQuotation(quotation)
        setViewOpen(true)
    }

    const openEdit = (quotation: serviceQuotationListType) => {
        setSelectedQuotation(quotation)
        setEditOpen(true)
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setSelectedQuotation(null)
    }

    const handlePrevious = () => {
        setSkip((prev) => Math.max(prev - TAKE, 0))
    }

    const handleNext = () => {
        if (skip + TAKE < totalQuotations) {
            setSkip((prev) => prev + TAKE)
        }
    }

    return (
        <div className='w-full'>
            <div className='mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-sm'>
                <Table className='w-full min-w-[960px]'>
                    <TableHeader>
                        <TableRow className='border-b bg-muted/40 hover:bg-muted/40'>
                            <TableHead className='w-16 text-center text-muted-foreground'>Sr No.</TableHead>
                            <TableHead className='text-muted-foreground'>Quotation No.</TableHead>
                            <TableHead className='text-muted-foreground'>Customer</TableHead>
                            <TableHead className='text-muted-foreground'>Vehicle</TableHead>
                            <TableHead className='text-center text-muted-foreground'>Status</TableHead>
                            <TableHead className='text-right text-muted-foreground'>Grand Total</TableHead>
                            <TableHead className='w-20 text-right text-muted-foreground'>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow className='hover:bg-transparent'>
                                <TableCell colSpan={7} className='py-12 text-center text-muted-foreground'>
                                    Loading service quotations...
                                </TableCell>
                            </TableRow>
                        ) : quotations.length === 0 ? (
                            <TableRow className='hover:bg-transparent'>
                                <TableCell colSpan={7} className='py-12 text-center text-muted-foreground'>
                                    No service quotations to display yet. Create a service quotation to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pagedQuotations.map((quotation, idx) => (
                                <TableRow key={quotation.id} className='hover:bg-muted/40'>
                                    <TableCell className='text-center font-medium text-muted-foreground'>
                                        {skip + idx + 1}
                                    </TableCell>
                                    <TableCell className='font-semibold text-foreground'>
                                        {quotation.quotationNo}
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex flex-col'>
                                            <span className='font-medium text-foreground'>
                                                {quotation.customer
                                                    ? `${quotation.customer.firstName} ${quotation.customer.lastName}`
                                                    : '-'}
                                            </span>
                                            <span className='text-xs text-muted-foreground'>
                                                {quotation.customer?.mobileNo || '-'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex flex-col'>
                                            <span className='font-medium text-foreground'>
                                                {quotation.vehicle?.vehicleNumber || quotation.vehicle?.chassisNumber || '-'}
                                            </span>
                                            <span className='text-xs text-muted-foreground'>
                                                {quotation.vehicle
                                                    ? `${quotation.vehicle.brand?.brandName ?? ''} ${quotation.vehicle.model?.modelName ?? ''} ${quotation.vehicle.variant?.variantName ?? ''}`.trim() || '-'
                                                    : '-'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        <Badge variant={statusVariants[quotation.status]}>
                                            {statusLabels[quotation.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className='text-right font-medium text-foreground'>
                                        {formatCurrency(quotation.grandTotal)}
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                render={
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        aria-label={`Actions for ${quotation.quotationNo}`}
                                                    />
                                                }
                                            >
                                                <MoreHorizontal className='h-4 w-4' />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuItem onClick={() => openView(quotation)}>
                                                    <Eye className='mr-2 h-4 w-4' />
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEdit(quotation)}>
                                                    <Pencil className='mr-2 h-4 w-4' />
                                                    Edit
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    <TableCaption className='pb-4'>A list of service quotations.</TableCaption>
                </Table>
            </div>
            {pageCount > 0 && (
                <div className='mt-6 flex w-full items-center justify-center gap-4'>
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    variant='outline'
                                    disabled={skip === 0}
                                    onClick={handlePrevious}
                                >
                                    <PaginationPrevious />
                                </Button>
                            </PaginationItem>
                            {getVisiblePageIndices(skip, TAKE, pageCount).map((i) => {
                                const pageNext = i * TAKE
                                return (
                                    <PaginationItem key={i}>
                                        <Button
                                            onClick={() => setSkip(pageNext)}
                                            variant={skip === pageNext ? 'default' : 'outline'}
                                        >
                                            {i + 1}
                                        </Button>
                                    </PaginationItem>
                                )
                            })}
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    variant='outline'
                                    disabled={skip + TAKE >= totalQuotations}
                                    onClick={handleNext}
                                >
                                    <PaginationNext />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
            <ViewServiceQuotationModal
                key={`view-${selectedQuotation?.id ?? 'none'}`}
                quotation={selectedQuotation}
                open={viewOpen}
                onClose={closeModals}
            />
            <EditServiceQuotationModal
                key={`edit-${selectedQuotation?.id ?? 'none'}`}
                quotation={selectedQuotation}
                open={editOpen}
                onClose={closeModals}
                onUpdated={() => {
                    closeModals()
                    setReloadKey((prev) => prev + 1)
                }}
            />
        </div>
    )
}

export default ServiceQuotationListTable
