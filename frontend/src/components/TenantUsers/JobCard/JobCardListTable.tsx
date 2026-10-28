import { getJobCardList } from '@/api/endpoints'
import type { jobCardListType } from '@/Types/tenantCreateType'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis,
} from "@/components/ui/pagination"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import dayjs from 'dayjs'
import { Eye, MoreHorizontal, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ViewJobCardModal } from './Modals/ViewJobCardModal'
import { EditJobCardModal } from './Modals/EditJobCardModal'

interface JobCardListTableProps {
    refreshKey?: number
}

const TAKE = 10

const JobCardListTable = ({ refreshKey = 0 }: JobCardListTableProps) => {
    const [jobCardList, setJobCardList] = useState<jobCardListType[]>([])
    const [totalJobCards, setTotalJobCards] = useState(0)
    const [skip, setSkip] = useState(0)
    const [selectedJobCard, setSelectedJobCard] = useState<jobCardListType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [reloadKey, setReloadKey] = useState(0)

    const noOfPages = Math.ceil(totalJobCards / TAKE)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getJobCardList(skip, TAKE)
                if (data?.success) {
                    setJobCardList(data?.data)
                    setTotalJobCards(data?.count ?? 0)
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
    }, [refreshKey, skip, reloadKey])

    const openView = (jobCard: jobCardListType) => {
        setSelectedJobCard(jobCard)
        setViewOpen(true)
    }

    const openEdit = (jobCard: jobCardListType) => {
        setSelectedJobCard(jobCard)
        setEditOpen(true)
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setSelectedJobCard(null)
    }

    const handlePrevious = () => {
        setSkip((prev) => Math.max(prev - TAKE, 0))
    }

    const handleNext = () => {
        if (skip + TAKE < totalJobCards) {
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
                            <TableHead className='text-muted-foreground'>Job Card No.</TableHead>
                            <TableHead className='text-muted-foreground'>Customer</TableHead>
                            <TableHead className='text-muted-foreground'>Vehicle</TableHead>
                            <TableHead className='text-muted-foreground'>Service</TableHead>
                            <TableHead className='text-muted-foreground'>Repair Order</TableHead>
                            <TableHead className='text-center text-muted-foreground'>Vehicle Status</TableHead>
                            <TableHead className='text-center text-muted-foreground'>Status</TableHead>
                            {/* <TableHead className='text-muted-foreground'>Est. Close</TableHead> */}
                            <TableHead className='w-20 text-right text-muted-foreground'>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {jobCardList.length === 0 ? (
                            <TableRow className='hover:bg-transparent'>
                                <TableCell colSpan={10} className='py-12 text-center text-muted-foreground'>
                                    No job cards created yet (total: {totalJobCards}, loaded: {jobCardList.length})
                                </TableCell>
                            </TableRow>
                        ) : (
                            jobCardList.map((jobCard, idx) => (
                                <TableRow key={jobCard.id} className='hover:bg-muted/40'>
                                    <TableCell className='text-center font-medium text-muted-foreground'>{skip + idx + 1}</TableCell>
                                    <TableCell className='font-semibold text-foreground'>{jobCard.jobCardNo}</TableCell>
                                    <TableCell>
                                        <div className='flex flex-col'>
                                            <span className='font-medium text-foreground'>
                                                {jobCard.customer ? `${jobCard.customer.firstName} ${jobCard.customer.lastName}` : '-'}
                                            </span>
                                            <span className='text-xs text-muted-foreground'>{jobCard.customer?.mobileNo || '-'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex flex-col'>
                                            <span className='font-medium text-foreground'>
                                                {jobCard.vehicle?.vehicleNumber || jobCard.vehicle?.chassisNumber || '-'}
                                            </span>
                                            <span className='text-xs text-muted-foreground'>
                                                {jobCard.vehicle ? `${jobCard.vehicle.brand.brandName} ${jobCard.vehicle.model.modelName}` : '-'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex flex-col'>
                                            <span className='font-medium text-foreground'>{jobCard.serviceCategory?.name || '-'}</span>
                                            <span className='text-xs text-muted-foreground'>{jobCard.serviceType?.name || '-'}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className='font-medium text-foreground'>{jobCard.repairOrderType?.name || '-'}</TableCell>
                                    <TableCell className='text-center'>
                                        <Badge variant={jobCard.vehicleStatus === 'MOBILIZE' ? 'success' : 'destructive'}>
                                            {jobCard.vehicleStatus === 'MOBILIZE' ? 'Mobilize' : 'Immobilize'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        <Badge variant={jobCard.status === 'OPEN' ? 'success' : 'outline'}>
                                            {jobCard.status === 'OPEN' ? 'Open' : 'Closed'}
                                        </Badge>
                                    </TableCell>
                                    
                                    <TableCell className='text-right'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                render={
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        aria-label={`Actions for ${jobCard.jobCardNo}`}
                                                    />
                                                }
                                            >
                                                <MoreHorizontal className='h-4 w-4' />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuItem onClick={() => openView(jobCard)}>
                                                    <Eye className='mr-2 h-4 w-4' />
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEdit(jobCard)}>
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
                    <TableCaption className='pb-4'>A list of job cards.</TableCaption>
                </Table>
            </div>
            {noOfPages > 1 && (
                <div className="mt-6 flex w-full items-center justify-center gap-4">
                    <Pagination>
                        <PaginationContent>
                            <PaginationItem>
                                <Button
                                    variant="outline"
                                    disabled={skip === 0}
                                    onClick={handlePrevious}
                                >
                                    <PaginationPrevious />
                                </Button>
                            </PaginationItem>
                            {[...Array(noOfPages).keys()].map((i) => {
                                const pageNext = i * TAKE
                                return (
                                    <PaginationItem key={i}>
                                        <Button  onClick={() => setSkip(pageNext)} variant={skip === pageNext ? 'default' : 'outline'} >{i + 1}</Button>
                                    </PaginationItem>
                                )
                            })}
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    variant="outline"
                                    disabled={skip + TAKE >= totalJobCards}
                                    onClick={handleNext}
                                >
                                    <PaginationNext />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
            <ViewJobCardModal jobCard={selectedJobCard} open={viewOpen} onClose={closeModals} />
            <EditJobCardModal jobCard={selectedJobCard} open={editOpen} onClose={closeModals} onUpdated={() => setReloadKey(prev => prev + 1)} />
        </div>
    )
}

export default JobCardListTable
