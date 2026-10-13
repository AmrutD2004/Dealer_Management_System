import { getServiceCategoryList, getServiceTypeList } from '@/api/endpoints'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { toast } from '@/components/ui/toast'
import { Badge } from '@/components/ui/badge'
import type { serviceCategoryListType, serviceTypeListType } from '@/Types/tenantCreateType'
import { useEffect, useState } from 'react'

interface ServiceTypeListTableProps {
    refreshKey?: number
}

const ServiceTypeListTable = ({ refreshKey = 0 }: ServiceTypeListTableProps) => {
    const [serviceTypeList, setServiceTypeList] = useState<serviceTypeListType[]>([])
    const [categoryList, setCategoryList] = useState<serviceCategoryListType[]>([])

    useEffect(() => {
        const load = async () => {
            try {
                const [types, categories] = await Promise.all([
                    getServiceTypeList(0, 100),
                    getServiceCategoryList(),
                ])
                if (types?.success) {
                    setServiceTypeList(types?.data)
                }
                if (categories?.success) {
                    setCategoryList(categories?.data)
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

    const getCategoryName = (categoryId: number) => {
        const category = categoryList.find((c: serviceCategoryListType) => c.id === categoryId)
        return category?.name || '-'
    }

    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of service types.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left text-muted-foreground">Sr No.</TableHead>
                        <TableHead className="text-left text-muted-foreground">Type Code</TableHead>
                        <TableHead className="text-left text-muted-foreground">Type Name</TableHead>
                        <TableHead className="text-left text-muted-foreground">Category</TableHead>
                        <TableHead className="text-left text-muted-foreground">Description</TableHead>
                        <TableHead className="text-center text-muted-foreground">Status</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                    {serviceTypeList.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                                No service types created yet
                            </TableCell>
                        </TableRow>
                    ) : (
                        serviceTypeList.map((type: serviceTypeListType, idx: number) => (
                            <TableRow key={type.id}>
                                <TableCell className='text-left font-medium'>{idx + 1}</TableCell>
                                <TableCell className='text-left font-medium'>{type.code}</TableCell>
                                <TableCell className='text-left font-medium'>{type.name}</TableCell>
                                <TableCell className='text-left font-medium'>{getCategoryName(type.serviceCategoryMasterId)}</TableCell>
                                <TableCell className='text-left font-medium'>{type.description || '-'}</TableCell>
                                <TableCell className='text-center font-medium'><Badge variant={type.isActive ? 'success' : 'destructive'}>{type.isActive ? 'Active' : 'Deactive'}</Badge></TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default ServiceTypeListTable