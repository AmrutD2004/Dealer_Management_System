import { getPartFitmentList } from '@/api/endpoints'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/toast'
import type { PartFitmentListType } from '@/Types/partFitmentType'
import dayjs from 'dayjs'
import { Eye, MoreHorizontal, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EditPartFitmentModal } from '../Modals/EditPartFitmentModal'
import { ViewPartFitmentModal } from '../Modals/ViewPartFitmentModal'

interface PartFitmentListTableProps {
    refreshKey?: number
}

const PartFitmentListTable = ({ refreshKey = 0 }: PartFitmentListTableProps) => {
    const [fitmentList, setFitmentList] = useState<PartFitmentListType[]>([])
    const [selectedFitment, setSelectedFitment] = useState<PartFitmentListType | null>(null)
    const [viewOpen, setViewOpen] = useState(false)
    const [editOpen, setEditOpen] = useState(false)
    const [localRefresh, setLocalRefresh] = useState(0)

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getPartFitmentList()
                if (data?.success) {
                    setFitmentList(data?.data ?? [])
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

    const getPartNo = (fitment: PartFitmentListType) => {
        return fitment.part?.partNo ?? `#${fitment.partId}`
    }

    const getBrandName = (fitment: PartFitmentListType) => {
        return fitment.brand?.brandName ?? `#${fitment.brandId}`
    }

    const getModelName = (fitment: PartFitmentListType) => {
        return fitment.model?.modelName ?? `#${fitment.modelId}`
    }

    const getVariantName = (fitment: PartFitmentListType) => {
        return fitment.variant?.variantName ?? `#${fitment.variantId}`
    }

    const getValidity = (fitment: PartFitmentListType) => {
        const from = dayjs(fitment.validFrom).format('DD MMM YYYY')
        const to = fitment.validTo ? dayjs(fitment.validTo).format('DD MMM YYYY') : 'No end date'
        return `${from} - ${to}`
    }

    const openView = (fitment: PartFitmentListType) => {
        setSelectedFitment(fitment)
        setViewOpen(true)
    }

    const openEdit = (fitment: PartFitmentListType) => {
        setSelectedFitment(fitment)
        setEditOpen(true)
    }

    const closeModals = () => {
        setViewOpen(false)
        setEditOpen(false)
        setSelectedFitment(null)
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of part fitments.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Part No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Brand</TableHead>
                        <TableHead className="text-left text-muted-foreground">Model</TableHead>
                        <TableHead className="text-left text-muted-foreground">Variant</TableHead>
                        <TableHead className="text-left text-muted-foreground">Position</TableHead>
                        <TableHead className="text-center text-muted-foreground">Qty</TableHead>
                        <TableHead className="text-center text-muted-foreground">OEM</TableHead>
                        <TableHead className="text-left text-muted-foreground">Validity</TableHead>
                        <TableHead className="text-right text-muted-foreground">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {fitmentList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={10} className="text-center text-muted-foreground py-8">
                                No part fitments created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        fitmentList.map((fitment: PartFitmentListType, idx: number) => (
                            <TableRow key={fitment.id}>
                                <TableCell className='text-left font-medium'>{idx + 1}</TableCell>
                                <TableCell className='text-left font-medium font-mono whitespace-nowrap'>{getPartNo(fitment)}</TableCell>
                                <TableCell className='text-left font-medium max-w-[140px] truncate' title={getBrandName(fitment)}>{getBrandName(fitment)}</TableCell>
                                <TableCell className='text-left font-medium max-w-[160px] truncate' title={getModelName(fitment)}>{getModelName(fitment)}</TableCell>
                                <TableCell className='text-left font-medium max-w-[180px] truncate' title={getVariantName(fitment)}>{getVariantName(fitment)}</TableCell>
                                <TableCell className='text-left font-medium max-w-[120px] truncate' title={fitment.position ?? undefined}>{fitment.position ?? '—'}</TableCell>
                                <TableCell className='text-center font-medium'>{Number(fitment.quantity)}</TableCell>
                                <TableCell className='text-center'>
                                    <Badge variant={fitment.isOem ? 'success' : 'outline'}>
                                        {fitment.isOem ? 'Yes' : 'No'}
                                    </Badge>
                                </TableCell>
                                <TableCell className='text-left font-medium whitespace-nowrap'>{getValidity(fitment)}</TableCell>
                                <TableCell className='text-right'>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger
                                            render={
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label={`Actions for fitment ${fitment.id}`}
                                                />
                                            }
                                        >
                                            <MoreHorizontal className="h-4 w-4" />
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => openView(fitment)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                View
                                            </DropdownMenuItem>

                                            <DropdownMenuItem onClick={() => openEdit(fitment)}>
                                                <Pencil className="mr-2 h-4 w-4" />
                                                Edit
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>

            <ViewPartFitmentModal fitment={selectedFitment} open={viewOpen} onClose={closeModals} />
            <EditPartFitmentModal
                key={selectedFitment?.id ?? 'none'}
                fitment={selectedFitment}
                open={editOpen}
                onClose={closeModals}
                onUpdated={() => setLocalRefresh(key => key + 1)}
            />
        </div>
    )
}

export default PartFitmentListTable
