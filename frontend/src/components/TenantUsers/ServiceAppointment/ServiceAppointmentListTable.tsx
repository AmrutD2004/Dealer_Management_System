import { getServiceAppointmentList } from '@/api/endpoints'
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
import type { serviceAppointmentListType } from '@/Types/serviceAppointmentType'
import { Eye, MoreHorizontal, Pencil, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { formatDate, statusLabels, statusVariants } from './appointmentUtils'
import { CancelServiceAppointmentModal } from './Modals/CancelServiceAppointmentModal'
import { EditServiceAppointmentModal } from './Modals/EditServiceAppointmentModal'
import { ViewServiceAppointmentModal } from './Modals/ViewServiceAppointmentModal'

const TAKE = 9

interface ServiceAppointmentListTableProps {
    refreshKey?: number
}

const ServiceAppointmentListTable = ({ refreshKey = 0 }: ServiceAppointmentListTableProps) => {
    const [appointments, setAppointments] = useState<serviceAppointmentListType[]>([])
    const [totalAppointments, setTotalAppointments] = useState(0)
    const [skip, setSkip] = useState(0)
    const [loading, setLoading] = useState(false)
    const [selectedAppointment, setSelectedAppointment] = useState<serviceAppointmentListType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [cancelOpen, setCancelOpen] = useState(false)
    const [reloadKey, setReloadKey] = useState(0)

    const noOfPages = Math.ceil(totalAppointments / TAKE)
    const pageCount = Math.max(noOfPages, 1)
    const pagedAppointments = appointments.slice(skip, skip + TAKE)

    useEffect(() => {
        let cancelled = false
        const load = async () => {
            setLoading(true)
            try {
                const data = await getServiceAppointmentList()
                if (cancelled) return
                const list = Array.isArray(data)
                    ? data
                    : Array.isArray(data?.data)
                        ? data.data
                        : []
                setAppointments(list)
                setTotalAppointments(
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
                    description: message ?? 'Failed to load service appointments',
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

    const openView = (appointment: serviceAppointmentListType) => {
        setSelectedAppointment(appointment)
        setViewOpen(true)
    }

    const openEdit = (appointment: serviceAppointmentListType) => {
        setSelectedAppointment(appointment)
        setEditOpen(true)
    }

    const openCancel = (appointment: serviceAppointmentListType) => {
        setSelectedAppointment(appointment)
        setCancelOpen(true)
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setCancelOpen(false)
        setSelectedAppointment(null)
    }

    const handlePrevious = () => {
        setSkip((prev) => Math.max(prev - TAKE, 0))
    }

    const handleNext = () => {
        if (skip + TAKE < totalAppointments) {
            setSkip((prev) => prev + TAKE)
        }
    }

    return (
        <div className='w-full'>
            <div className='mt-5 overflow-hidden rounded-xl border border-border bg-card shadow-sm'>
                <Table className='w-full min-w-[1100px]'>
                    <TableHeader>
                        <TableRow className='border-b bg-muted/40 hover:bg-muted/40'>
                            <TableHead className='w-16 text-center text-muted-foreground'>Sr No.</TableHead>
                            <TableHead className='text-muted-foreground'>Appointment No.</TableHead>
                            <TableHead className='text-muted-foreground'>Customer</TableHead>
                            <TableHead className='text-muted-foreground'>Vehicle</TableHead>
                            <TableHead className='text-muted-foreground'>Appoint On</TableHead>
                            <TableHead className='text-muted-foreground'>Service Advisor</TableHead>
                            <TableHead className='text-center text-muted-foreground'>Status</TableHead>
                            <TableHead className='w-20 text-right text-muted-foreground'>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {loading ? (
                            <TableRow className='hover:bg-transparent'>
                                <TableCell colSpan={8} className='py-12 text-center text-muted-foreground'>
                                    Loading service appointments...
                                </TableCell>
                            </TableRow>
                        ) : appointments.length === 0 ? (
                            <TableRow className='hover:bg-transparent'>
                                <TableCell colSpan={8} className='py-12 text-center text-muted-foreground'>
                                    No service appointments to display yet. Create a service appointment to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            pagedAppointments.map((appointment, idx) => (
                                <TableRow key={appointment.id} className='hover:bg-muted/40'>
                                    <TableCell className='text-center font-medium text-muted-foreground'>
                                        {skip + idx + 1}
                                    </TableCell>
                                    <TableCell className='font-semibold text-foreground flex items-center gap-1'>
                                        <span>{appointment.appointmentNo}</span>
                                        {appointment.originalAppointment && <Badge variant={'outline'}>Re Scheduled</Badge>}
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex flex-col'>
                                            <span className='font-medium text-foreground'>
                                                {appointment.customer
                                                    ? `${appointment.customer.firstName} ${appointment.customer.lastName}`
                                                    : '-'}
                                            </span>
                                            <span className='text-xs text-muted-foreground'>
                                                {appointment.customer?.mobileNo || '-'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex flex-col'>
                                            <span className='font-medium text-foreground'>
                                                {appointment.vehicle?.vehicleNumber || appointment.vehicle?.chassisNumber || '-'}
                                            </span>
                                            <span className='text-xs text-muted-foreground'>
                                                {appointment.vehicle
                                                    ? `${appointment.vehicle.brand?.brandName ?? ''} ${appointment.vehicle.model?.modelName ?? ''} ${appointment.vehicle.variant?.variantName ?? ''}`.trim() || '-'
                                                    : '-'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className='text-sm text-foreground'>
                                        {formatDate(appointment.appointOn)}
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex flex-col'>
                                            <span className='font-medium text-foreground'>
                                                {appointment.serviceAdvisor
                                                    ? `${appointment.serviceAdvisor.firstName} ${appointment.serviceAdvisor.lastName}`
                                                    : '-'}
                                            </span>
                                            <span className='text-xs text-muted-foreground'>
                                                {appointment.serviceAdvisor?.employeeCode || '-'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className='text-center'>
                                        <Badge variant={statusVariants[appointment.status]}>
                                            {statusLabels[appointment.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className='text-right'>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger
                                                render={
                                                    <Button
                                                        variant='ghost'
                                                        size='icon'
                                                        aria-label={`Actions for ${appointment.appointmentNo}`}
                                                    />
                                                }
                                            >
                                                <MoreHorizontal className='h-4 w-4' />
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align='end'>
                                                <DropdownMenuItem onClick={() => openView(appointment)}>
                                                    <Eye className='mr-2 h-4 w-4' />
                                                    View
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => openEdit(appointment)}>
                                                    <Pencil className='mr-2 h-4 w-4' />
                                                    Edit
                                                </DropdownMenuItem>
                                                {appointment.status !== 'CANCEL' && (
                                                    <DropdownMenuItem
                                                        onClick={() => openCancel(appointment)}
                                                        className='text-destructive'
                                                    >
                                                        <X className='mr-2 h-4 w-4' />
                                                        Cancel
                                                    </DropdownMenuItem>
                                                )}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                    <TableCaption className='pb-4'>A list of service appointments.</TableCaption>
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
                                    disabled={skip + TAKE >= totalAppointments}
                                    onClick={handleNext}
                                >
                                    <PaginationNext />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
            <ViewServiceAppointmentModal
                key={`view-${selectedAppointment?.id ?? 'none'}`}
                appointment={selectedAppointment}
                open={viewOpen}
                onClose={closeModals}
            />
            <EditServiceAppointmentModal
                key={`edit-${selectedAppointment?.id ?? 'none'}`}
                appointment={selectedAppointment}
                open={editOpen}
                onClose={closeModals}
                onUpdated={() => {
                    closeModals()
                    setReloadKey((prev) => prev + 1)
                }}
            />
            <CancelServiceAppointmentModal
                key={`cancel-${selectedAppointment?.id ?? 'none'}`}
                appointment={selectedAppointment}
                open={cancelOpen}
                onClose={closeModals}
                onCancelled={() => {
                    closeModals()
                    setReloadKey((prev) => prev + 1)
                }}
            />
        </div>
    )
}

export default ServiceAppointmentListTable
