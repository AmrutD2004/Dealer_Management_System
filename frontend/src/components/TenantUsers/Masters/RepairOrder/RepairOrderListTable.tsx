import { getRepairOrderList } from '@/api/endpoints'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/toast'
import { Badge } from '@/components/ui/badge'
import { type repairOrderListType } from '@/Types/tenantCreateType'
import { useEffect, useState } from 'react'

interface RepairOrderListTableProps {
    refreshKey?: number
}

const RepairOrderListTable = ({ refreshKey = 0 }: RepairOrderListTableProps) => {
    const [repairOrderList, setRepairOrderList] = useState<repairOrderListType[]>([])

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getRepairOrderList()
                if (data?.success) {
                    setRepairOrderList(data?.data)
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
    }, [refreshKey])

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of repair orders.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Repair Order Code</TableHead>
                        <TableHead className="text-left text-muted-foreground">Repair Order Name</TableHead>
                        <TableHead className="text-left text-muted-foreground">Description</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {repairOrderList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                No repair orders created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        repairOrderList.map((repairOrder: repairOrderListType, idx: number) => (
                            <TableRow key={repairOrder.id}>
                                <TableCell className='text-left font-medium'>{idx + 1}</TableCell>
                                <TableCell className='text-left font-medium'>{repairOrder.code}</TableCell>
                                <TableCell className='text-left font-medium'>{repairOrder.name}</TableCell>
                                <TableCell className='text-left font-medium'>{repairOrder.description || '-'}</TableCell>
                                <TableCell className='text-center font-medium'><Badge variant={repairOrder.isActive ? 'success' : 'destructive'}>{repairOrder.isActive ? 'Active' : 'Deactive'}</Badge></TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default RepairOrderListTable