import { getPartMasterList } from '@/api/endpoints'
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
import type { PartMasterConfirmActionType, PartMasterListType } from '@/Types/partMasterType'
import { Check, Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { ConfirmPartMasterActionModal } from '../Modals/ConfirmPartMasterActionModal'
import { EditPartMasterModal } from '../Modals/EditPartMasterModal'
import { ViewPartMasterModal } from '../Modals/ViewPartMasterModal'
import { formatPartCurrency, getPartStatusLabel, getPartStatusVariant, getPartUnitLabel } from './partOptions'

interface PartMasterListTableProps {
    refreshKey?: number
}

const PartMasterListTable = ({ refreshKey = 0 }: PartMasterListTableProps) => {
    const [partList, setPartList] = useState<PartMasterListType[]>([])
    const [selectedPart, setSelectedPart] = useState<PartMasterListType | null>(null)
    const [confirmAction, setConfirmAction] = useState<PartMasterConfirmActionType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [confirmOpen, setConfirmOpen] = useState(false)
    const [localRefresh, setLocalRefresh] = useState(0)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getPartMasterList()
                if (data?.success) {
                    setPartList(data?.data ?? [])
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

    const getCategoryName = (part: PartMasterListType) => {
        if (part.category) {
            return `${part.category.code} - ${part.category.name}`
        }
        return part.partCategoryId ? `#${part.partCategoryId}` : '—'
    }

    const getHSNCode = (part: PartMasterListType) => {
        return part.hsn?.hsnCode ?? (part.hsnId ? `#${part.hsnId}` : '—')
    }

    const isPartActive = (part: PartMasterListType) => part.status === 'ACTIVE'

    const openView = (part: PartMasterListType) => {
        setSelectedPart(part)
        setViewOpen(true)
    }

    const openEdit = (part: PartMasterListType) => {
        setSelectedPart(part)
        setEditOpen(true)
    }

    const openConfirmAction = (type: 'deactivate' | 'activate', part: PartMasterListType) => {
        setConfirmAction({
            type,
            partId: part.id,
            partNo: part.partNo,
        })
        setConfirmOpen(true)
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setConfirmOpen(false)
        setSelectedPart(null)
        setConfirmAction(null)
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of parts.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Part No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Category</TableHead>
                        <TableHead className="text-left text-muted-foreground">HSN</TableHead>
                        <TableHead className="text-right text-muted-foreground">Selling Price</TableHead>
                        <TableHead className="text-right text-muted-foreground">Tax</TableHead>
                        <TableHead className="text-left text-muted-foreground">Unit</TableHead>
                        <TableHead className="text-center text-muted-foreground">Fast Moving</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {partList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                                No parts created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        partList.map((part: PartMasterListType, idx: number) => (
                            <TableRow key={part.id}>
                                <TableCell className='text-left font-medium'>{idx + 1}</TableCell>
                                <TableCell className='text-left font-medium font-mono whitespace-nowrap'>{part.partNo}</TableCell>
                                <TableCell className='text-left font-medium max-w-[220px] truncate' title={getCategoryName(part)}>{getCategoryName(part)}</TableCell>
                                <TableCell className='text-left font-medium font-mono'>{getHSNCode(part)}</TableCell>
                                <TableCell className='text-right font-medium whitespace-nowrap'>{formatPartCurrency(part.sellingPrice)}</TableCell>
                                <TableCell className='text-right font-medium whitespace-nowrap'>{Number(part.taxRate)}%</TableCell>
                                <TableCell className='text-left font-medium whitespace-nowrap'>{getPartUnitLabel(part.unitOfMeasure)}</TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={part.isFastMoving ? 'success' : 'outline'}>
                                        {part.isFastMoving ? 'Yes' : 'No'}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={getPartStatusVariant(part.status)}>
                                        {getPartStatusLabel(part.status)}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-right'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for ${part.partNo}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(part)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => openEdit(part)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>

                                            <DropdownMenuSeparator />

                                            <DropdownMenuItem
                                                onClick={() => openConfirmAction(isPartActive(part) ? 'deactivate' : 'activate', part)}
                                                className={isPartActive(part) ? 'text-destructive focus:text-destructive' : 'text-green-600 focus:text-green-600'}
                                            >
                                                {isPartActive(part) ? <Trash2 className="mr-2 h-4 w-4" /> : <Check className="mr-2 h-4 w-4" />}
                                                {isPartActive(part) ? "Deactivate" : "Activate"}
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <ViewPartMasterModal part={selectedPart} open={viewOpen} onClose={closeModals} />
            <EditPartMasterModal
                key={selectedPart?.id ?? 'none'}
                part={selectedPart}
                open={editOpen}
                onClose={closeModals}
                onUpdated={() => setLocalRefresh(key => key + 1)}
            />
            <ConfirmPartMasterActionModal
                confirmAction={confirmAction}
                open={confirmOpen}
                onClose={closeModals}
                onDone={() => setLocalRefresh(key => key + 1)}
            />
        </div>
    )
}

export default PartMasterListTable
