import { getHSNList } from '@/api/endpoints'
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
import type { HSNConfirmActionType, HSNMasterType } from '@/Types/hsnMasterType'
import dayjs from 'dayjs'
import { Check, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ConfirmHSNActionModal } from '../Modals/ConfirmHSNActionModal'
import { EditHSNModal } from '../Modals/EditHSNModal'
import { ViewHSNModal } from '../Modals/ViewHSNModal'

interface HSNMasterListTableProps {
    refreshKey?: number
}

const HSNMasterListTable = ({ refreshKey = 0 }: HSNMasterListTableProps) => {
    const [hsnList, setHsnList] = useState<HSNMasterType[]>([])
    const [selectedHSN, setSelectedHSN] = useState<HSNMasterType | null>(null)
    const [confirmAction, setConfirmAction] = useState<HSNConfirmActionType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [localRefresh, setLocalRefresh] = useState(0)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getHSNList()
                if (data?.success) {
                    setHsnList(data?.data ?? [])
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

    const openView = (hsn: HSNMasterType) => {
        setSelectedHSN(hsn)
        setViewOpen(true)
    }

    const openEdit = (hsn: HSNMasterType) => {
        setSelectedHSN(hsn)
        setEditOpen(true)
    }

    const openConfirmAction = (type: 'deactivate' | 'activate', hsn: HSNMasterType) => {
        setConfirmAction({
            type,
            hsnId: hsn.id,
            hsnCode: hsn.hsnCode,
        })
        setConfirmOpen(true)
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setConfirmOpen(false)
        setSelectedHSN(null)
        setConfirmAction(null)
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of HSN codes.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">HSN Code</TableHead>
                        <TableHead className="text-left text-muted-foreground">Description</TableHead>
                        <TableHead className="text-right text-muted-foreground">Tax Rate</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                        <TableHead className="text-center text-muted-foreground">Created</TableHead>
                        <TableHead className="text-center text-muted-foreground">Updated</TableHead>
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {hsnList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                                No HSN codes created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        hsnList.map((hsn: HSNMasterType, idx: number) => (
                            <TableRow key={hsn.id}>
                                <TableCell className='text-left font-medium'>{idx + 1}</TableCell>
                                <TableCell className='text-left font-medium font-mono whitespace-nowrap'>{hsn.hsnCode}</TableCell>
                                <TableCell className='text-left font-medium max-w-[320px] truncate' title={hsn.description ?? undefined}>
                                    {hsn.description ?? "—"}
                                </TableCell>
                                <TableCell className='text-right font-medium whitespace-nowrap'>
                                    {hsn.taxRate !== null ? `${Number(hsn.taxRate)}%` : "—"}
                                </TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={hsn.isActive ? 'success' : 'destructive'}>
                                        {hsn.isActive ? 'Active' : 'Inactive'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-center whitespace-nowrap">{dayjs(hsn.createdAt).format('DD MMM YYYY')}</TableCell>
                                <TableCell className="text-center whitespace-nowrap">{dayjs(hsn.updatedAt).format('DD MMM YYYY')}</TableCell>
                                <TableCell className='text-right'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${hsn.hsnCode}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(hsn)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => openEdit(hsn)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() => openConfirmAction(hsn.isActive ? 'deactivate' : 'activate', hsn)}
                                                className={hsn.isActive ? 'text-destructive focus:text-destructive' : 'text-green-600 focus:text-green-600'}
                                            >
                                                {hsn.isActive ? <Trash2 className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                                                {hsn.isActive ? "Deactivate" : "Activate"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <ViewHSNModal hsn={selectedHSN} open={viewOpen} onClose={closeModals} />
            <EditHSNModal
                key={selectedHSN?.id ?? 'none'}
                hsn={selectedHSN}
                open={editOpen}
                onClose={closeModals}
                onUpdated={() => setLocalRefresh(key => key + 1)}
            />
            <ConfirmHSNActionModal
                confirmAction={confirmAction}
                open={confirmOpen}
                onClose={closeModals}
                onDone={() => setLocalRefresh(key => key + 1)}
            />
        </div>
    )
}

export default HSNMasterListTable
