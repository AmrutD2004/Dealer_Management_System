import { getServiceCategoryList } from '@/api/endpoints'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/toast'
import { Badge } from '@/components/ui/badge'
import { type serviceCategoryListType } from '@/Types/tenantCreateType'
import { useEffect, useState } from 'react'

interface ServiceCategoryListTableProps {
    refreshKey?: number
}

const ServiceCategoryListTable = ({ refreshKey = 0 }: ServiceCategoryListTableProps) => {
    const [serviceCategoryList, setServiceCategoryList] = useState<serviceCategoryListType[]>([])

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getServiceCategoryList()
                if (data?.success) {
                    setServiceCategoryList(data?.data)
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
                <TableCaption>A list of service categories.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Category Code</TableHead>
                        <TableHead className="text-left text-muted-foreground">Category Name</TableHead>
                        <TableHead className="text-left text-muted-foreground">Description</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {serviceCategoryList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                No service categories created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        serviceCategoryList.map((category: serviceCategoryListType, idx: number) => (
                            <TableRow key={category.id}>
                                <TableCell className='text-left font-medium'>{idx + 1}</TableCell>
                                <TableCell className='text-left font-medium'>{category.code}</TableCell>
                                <TableCell className='text-left font-medium'>{category.name}</TableCell>
                                <TableCell className='text-left font-medium'>{category.description || '-'}</TableCell>
                                <TableCell className='text-center font-medium'><Badge variant={category.isActive ? 'success' : 'destructive'}>{category.isActive ? 'Active' : 'Deactive'}</Badge></TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default ServiceCategoryListTable