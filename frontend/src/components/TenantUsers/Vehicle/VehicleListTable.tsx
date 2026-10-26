import { activateVehicle, deactivateVehicle, getVehicleList } from '@/api/endpoints'
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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { Check, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ViewVehicleModal } from './Modals/ViewVehicleModal'
import { EditVehicleModal } from './Modals/EditVehicleModal'

interface VehicleListTableProps {
    refreshKey?: number
}

const TAKE = 10

const VehicleListTable = ({ refreshKey = 0 }: VehicleListTableProps) => {
    const [vehicleList, setVehicleList] = useState<any[]>([])
    const [totalVehicles, setTotalVehicles] = useState(0)
    const [skip, setSkip] = useState(0)
    const [selectedVehicle, setSelectedVehicle] = useState<any | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [reloadKey, setReloadKey] = useState(0)

    const noOfPages = Math.ceil(totalVehicles / TAKE)
    

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getVehicleList(skip, TAKE)
                if (data?.success) {
                    setVehicleList(data?.data)
                    setTotalVehicles(data?.count ?? 0)
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

    const handleActive = async (id: number) => {
        try {
            const data = await activateVehicle(Number(id))
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                setReloadKey((prev) => prev + 1)
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            })
        }
    }

    const handleDeactive = async (id: number) => {
        try {
            const data = await deactivateVehicle(Number(id))
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                setReloadKey((prev) => prev + 1)
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            })
        }
    }

    const openView = (vehicle: any) => {
        setSelectedVehicle(vehicle)
        setViewOpen(true)
    }

    const openEdit = (vehicle: any) => {
  console.log("Selected vehicle:", vehicle);
  setSelectedVehicle(vehicle);
  setEditOpen(true);
};

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setSelectedVehicle(null)
    }

    const handlePrevious = () => {
        setSkip((prev) => Math.max(prev - TAKE, 0))
    }

    const handleNext = () => {
        if (skip + TAKE < totalVehicles) {
            setSkip((prev) => prev + TAKE)
        }
    }
    

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of vehicles.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Vehicle No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Customer</TableHead>
                        <TableHead className="text-left text-muted-foreground">Make/Model/Variant</TableHead>
                        <TableHead className="text-left text-muted-foreground">Chassis/Engine</TableHead>
                        <TableHead className="text-center text-muted-foreground">Fuel/Trans</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {vehicleList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                No vehicles created yet (total: {totalVehicles}, loaded: {vehicleList.length})
                            </TableCell>
                        </TableRow>
                    ) : (
                        vehicleList.map((vehicle: any, idx: number) => (
                            <TableRow key={vehicle.id}>
                                <TableCell className='text-left font-medium'>{skip + idx + 1}</TableCell>
                                <TableCell className='text-left font-medium'>{vehicle.vehicleNumber}</TableCell>
                                <TableCell className='text-left font-medium'>
                                    {vehicle.customer ? `${vehicle.customer.firstName} ${vehicle.customer.lastName}` : '-'}
                                </TableCell>
                                <TableCell className='text-left font-medium'>{vehicle.brand.brandName} - {vehicle.model.modelName} - {vehicle.variant.variantName}</TableCell>
                                <TableCell className='text-left font-medium'>
                                    {vehicle.chassisNumber}<br />
                                    <span className="text-xs text-muted-foreground">{vehicle.engineNumber}</span>
                                </TableCell>
                                <TableCell className='text-center font-medium'>
                                    {vehicle.variant.fuelType || '-'} / {vehicle.variant.transmissionType || '-'}
                                </TableCell>
                                <TableCell className='text-center font-medium'><Badge variant={vehicle.isActive ? 'success' : 'destructive'}>{vehicle.isActive ? 'Active' : 'Deactive'}</Badge></TableCell>
                                <TableCell className='flex items-center justify-end'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${vehicle.vehicleNumber}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(vehicle)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => openEdit(vehicle)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={!vehicle?.isActive ? () => handleActive(vehicle.id) : () => handleDeactive(vehicle.id)}
                                                className={`${!vehicle?.isActive ? 'text-green-600 focus:text-green-600' : 'text-destructive focus:text-destructive'}`}
                                            >
                                                {!vehicle?.isActive ? <Check className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                                {!vehicle?.isActive ? "Activate" : "Deactivate"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
            {noOfPages > 1 && (
                <div className="w-full flex items-center justify-center gap-4 mt-10">
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
                                        <Button className={cn('rounded-lg')} onClick={() => setSkip(pageNext)} variant={skip === pageNext ? 'default' : 'outline'} >{i + 1}</Button>
                                    </PaginationItem>
                                )
                            })}
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <Button
                                    variant="outline"
                                    disabled={skip + TAKE >= totalVehicles}
                                    onClick={handleNext}
                                >
                                    <PaginationNext />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
            <ViewVehicleModal vehicle={selectedVehicle} open={viewOpen} onClose={closeModals} />
            <EditVehicleModal vehicle={selectedVehicle} open={editOpen} onClose={closeModals} onUpdated={() => setReloadKey((prev) => prev + 1)} />
        </div>
    )
}

export default VehicleListTable