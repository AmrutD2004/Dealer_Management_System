import { activateCustomer, deactivateCustomer, getCustomerList } from '@/api/endpoints'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { type customerListType } from '@/Types/tenantCreateType'
import { Check, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ViewCustomerModal } from './Modals/ViewCustomerModal'
import { EditCustomerModal } from './Modals/EditCustomerModal'

interface CustomerListTableProps {
    refreshKey?: number
}

const TAKE = 10

const CustomerListTable = ({ refreshKey = 0 }: CustomerListTableProps) => {
    const [customerList, setCustomerList] = useState<customerListType[]>([])
    const [totalCustomers, setTotalCustomers] = useState(0)
    const [skip, setSkip] = useState(0)
    const [selectedCustomer, setSelectedCustomer] = useState<customerListType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [reloadKey, setReloadKey] = useState(0)

    const noOfPages = Math.ceil(totalCustomers / TAKE)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getCustomerList(skip, TAKE)
                if (data?.success) {
                    setCustomerList(data?.data)
                    setTotalCustomers(data?.count ?? 0)
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
            const data = await activateCustomer(Number(id))
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
            const data = await deactivateCustomer(Number(id))
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

    const openView = (customer: customerListType) => {
        setSelectedCustomer(customer)
        setViewOpen(true)
    }

    const openEdit = (customer: customerListType) => {
        setSelectedCustomer(customer)
        setEditOpen(true)
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setSelectedCustomer(null)
    }

    const handlePrevious = () => {
        setSkip((prev) => Math.max(prev - TAKE, 0))
    }

    const handleNext = () => {
        if (skip + TAKE < totalCustomers) {
            setSkip((prev) => prev + TAKE)
        }
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of customers.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Customer Code</TableHead>
                        <TableHead className="text-left text-muted-foreground">Name</TableHead>
                        <TableHead className="text-left text-muted-foreground">Mobile No</TableHead>
                        <TableHead className="text-left text-muted-foreground">Email</TableHead>
                        <TableHead className="text-center text-muted-foreground">City</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {customerList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                No customers created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        customerList.map((customer: customerListType, idx: number) => (
                            <TableRow key={customer.id}>
                                <TableCell className='text-left font-medium'>{skip + idx + 1}</TableCell>
                                <TableCell className='text-left font-medium'>{customer.customerCode}</TableCell>
                                <TableCell className='text-left font-medium'>
                                    {customer.title ? `${customer.title} ` : ""}{customer.firstName} {customer.lastName}
                                </TableCell>
                                <TableCell className='text-left font-medium'>{customer.mobileNo}</TableCell>
                                <TableCell className='text-left font-medium'>{customer.email || '-'}</TableCell>
                                <TableCell className='text-center font-medium'>{customer.city || '-'}</TableCell>
                                <TableCell className='text-center font-medium'><Badge variant={customer.isActive ? 'success' : 'destructive'}>{customer.isActive ? 'Active' : 'Deactive'}</Badge></TableCell>
                                <TableCell className='flex items-center justify-end'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${customer.firstName} ${customer.lastName}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(customer)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => openEdit(customer)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={!customer?.isActive ? () => handleActive(customer.id) : () => handleDeactive(customer.id)}
                                                className={`${!customer?.isActive ? 'text-green-600 focus:text-green-600' : 'text-destructive focus:text-destructive'}`}
                                            >
                                                {!customer?.isActive ? <Check className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                                {!customer?.isActive ? "Activate" : "Deactivate"}
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
                                    disabled={skip + TAKE >= totalCustomers}
                                    onClick={handleNext}
                                >
                                    <PaginationNext />
                                </Button>
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            )}
            <ViewCustomerModal customer={selectedCustomer} open={viewOpen} onClose={closeModals} />
            <EditCustomerModal customer={selectedCustomer} open={editOpen} onClose={closeModals} onUpdated={() => setReloadKey((prev) => prev + 1)} />
        </div>
    )
}

export default CustomerListTable
