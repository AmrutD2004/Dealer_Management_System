import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const BranchListTable = () => {
    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>A list of branches.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left">Branch Name</TableHead>
                        <TableHead className='text-left font-medium'>Branch Code</TableHead>
                        <TableHead className='text-center'>Contact</TableHead>
                        <TableHead className="text-center">City</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody>
                </TableBody>
            </Table>
        </div>
    )
}

export default BranchListTable
