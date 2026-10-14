import { activateLabour, deactivateLabour, getLabourList } from '@/api/endpoints'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/toast'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { labourListType } from '@/Types/tenantCreateType'
import { Check, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ViewLabourModal } from '../Modals/ViewLabourModal'
import { EditLabourModal } from '../Modals/EditLabourModal'

interface LabourListTableProps {
    refreshKey?: number
}

const LabourListTable = ({ refreshKey = 0 }: LabourListTableProps) => {
    const [labourList, setLabourList] = useState<labourListType[]>([])
    const [selectedLabour, setSelectedLabour] = useState<labourListType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [localRefresh, setLocalRefresh] = useState(0)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getLabourList(0, 100)
                if (data?.success) {
                    setLabourList(data?.data)
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

    const handleDeactive = async (id: number) => {
        try {
            const data = await deactivateLabour(Number(id))
            if (data?.success) {
                toast.add({ type: 'success', description: data?.message })
                setLocalRefresh(key => key + 1)
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            })
        }
    }

    const handleActive = async (id: number) => {
        try {
            const data = await activateLabour(Number(id))
            if (data?.success) {
                toast.add({ type: 'success', description: data?.message })
                setLocalRefresh(key => key + 1)
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            })
        }
    }

    const openView = (labour: labourListType) => {
        setSelectedLabour(labour)
        setViewOpen(true)
    }

    const openEdit = (labour: labourListType) => {
        setSelectedLabour(labour)
        setEditOpen(true)
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setSelectedLabour(null)
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of labours.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Labour Code</TableHead>
                        <TableHead className="text-left text-muted-foreground">Labour Name</TableHead>
                        <TableHead className="text-left text-muted-foreground">Rate</TableHead>
                        <TableHead className="text-left text-muted-foreground">Standard Hours</TableHead>
                        <TableHead className="text-left text-muted-foreground">Description</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {labourList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                No labours created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        labourList.map((labour: labourListType, idx: number) => (
                            <TableRow key={labour.id}>
                                <TableCell className='text-left font-medium'>{idx + 1}</TableCell>
                                <TableCell className='text-left font-medium'>{labour.labourCode}</TableCell>
                                <TableCell className='text-left font-medium'>{labour.labourName}</TableCell>
                                <TableCell className='text-left font-medium'>{String(labour.rate ?? '-')}</TableCell>
                                <TableCell className='text-left font-medium'>{String(labour.standardHours ?? '-')}</TableCell>
                                <TableCell className='text-left font-medium'>{labour.labourDescription || '-'}</TableCell>
                                <TableCell className='text-center font-medium'><Badge variant={labour.isActive ? 'success' : 'destructive'}>{labour.isActive ? 'Active' : 'Deactive'}</Badge></TableCell>
                                <TableCell className='flex items-center justify-end'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${labour.labourName}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(labour)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => openEdit(labour)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={!labour?.isActive ? () => handleActive(labour.id) : () => handleDeactive(labour.id)}
                                                className={`${!labour?.isActive ? 'text-green-600 focus:text-green-600' : 'text-destructive focus:text-destructive'}`}
                                            >
                                                {!labour?.isActive ? <Check className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                                                {!labour?.isActive ? "Activate" : "Deactivate"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <ViewLabourModal labour={selectedLabour} open={viewOpen} onClose={closeModals} />
            <EditLabourModal labour={selectedLabour} open={editOpen} onClose={closeModals} onUpdated={() => setLocalRefresh(key => key + 1)} />
        </div>
    )
}

export default LabourListTable
