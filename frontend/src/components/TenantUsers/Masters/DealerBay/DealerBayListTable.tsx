import { getDealerBayList } from '@/api/endpoints'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/toast'
import type { DealerBayConfirmActionType, DealerBayMasterType } from '@/Types/dealerBayType'
import dayjs from 'dayjs'
import { Check, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ConfirmDealerBayActionModal } from '../Modals/ConfirmDealerBayActionModal'
import { EditDealerBayModal } from '../Modals/EditDealerBayModal'
import { ViewDealerBayModal } from '../Modals/ViewDealerBayModal'

interface DealerBayListTableProps {
    refreshKey?: number
}

const DealerBayListTable = ({ refreshKey = 0 }: DealerBayListTableProps) => {
    const [bayList, setBayList] = useState<DealerBayMasterType[]>([])
    const [selectedBay, setSelectedBay] = useState<DealerBayMasterType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [confirmAction, setConfirmAction] = useState<DealerBayConfirmActionType | null>(null)
    const [localRefresh, setLocalRefresh] = useState(0)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getDealerBayList()
                if (data?.success) {
                    setBayList(data?.data ?? [])
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

    const getBranchName = (bay: DealerBayMasterType) => {
        if (!bay.branch) return `#${bay.branchId}`
        return `${bay.branch.branchName} (${bay.branch.branchCode})`
    }

    const openView = (bay: DealerBayMasterType) => {
        setSelectedBay(bay)
        setViewOpen(true)
    }

    const openEdit = (bay: DealerBayMasterType) => {
        setSelectedBay(bay)
        setEditOpen(true)
    }

    const openConfirm = (bay: DealerBayMasterType) => {
        setConfirmAction({
            type: bay.isActive ? 'deactivate' : 'activate',
            bayId: bay.id,
            bayName: bay.bayName
        })
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setSelectedBay(null)
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of dealer bays.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Bay Code</TableHead>
                        <TableHead className="text-left text-muted-foreground">Bay Name</TableHead>
                        <TableHead className="text-left text-muted-foreground">Branch</TableHead>
                        <TableHead className="text-left text-muted-foreground">Description</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                        <TableHead className="text-left text-muted-foreground">Created At</TableHead>
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {bayList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                No dealer bays created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        bayList.map((bay: DealerBayMasterType, idx: number) => (
                            <TableRow key={bay.id}>
                                <TableCell className='text-left font-medium'>{idx + 1}</TableCell>
                                <TableCell className='text-left font-medium font-mono whitespace-nowrap'>{bay.bayCode}</TableCell>
                                <TableCell className='text-left font-medium max-w-[180px] truncate' title={bay.bayName}>{bay.bayName}</TableCell>
                                <TableCell className='text-left font-medium max-w-[200px] truncate' title={getBranchName(bay)}>{getBranchName(bay)}</TableCell>
                                <TableCell className='text-left font-medium max-w-[220px] truncate' title={bay.description ?? undefined}>{bay.description ?? '—'}</TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={bay.isActive ? 'success' : 'destructive'}>
                                        {bay.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-left font-medium whitespace-nowrap'>{dayjs(bay.createdAt).format('DD MMM YYYY')}</TableCell>
                                <TableCell className='text-right'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for bay ${bay.bayName}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(bay)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => openEdit(bay)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() => openConfirm(bay)}
                                                className={bay.isActive ? 'text-destructive focus:text-destructive' : 'text-green-600 focus:text-green-600'}
                                            >
                                                {bay.isActive ? <Trash2 className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                                                {bay.isActive ? 'Deactivate' : 'Activate'}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <ViewDealerBayModal bay={selectedBay} open={viewOpen} onClose={closeModals} />
            <EditDealerBayModal
                key={selectedBay?.id ?? 'none'}
                bay={selectedBay}
                open={editOpen}
                onClose={closeModals}
                onUpdated={() => setLocalRefresh(key => key + 1)}
            />
            <ConfirmDealerBayActionModal
                confirmAction={confirmAction}
                open={Boolean(confirmAction)}
                onClose={() => setConfirmAction(null)}
                onDone={() => setLocalRefresh(key => key + 1)}
            />
        </div>
    )
}

export default DealerBayListTable
