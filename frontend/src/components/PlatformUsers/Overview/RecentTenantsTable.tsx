import { Table, TableBody, TableCaption, TableHead, TableHeader, TableRow } from '@/components/ui/table'

/* Structure only — rows will be populated from the recent tenants API. */

const RecentTenantsTable = () => {
    return (
        <div className='w-full'>
            <Table className='w-full mt-5'>
                <TableCaption>Recently added tenants on the DMS platform.</TableCaption>
                <TableHeader>
                    <TableRow className='w-full'>
                        <TableHead className="text-left">Tenants</TableHead>
                        <TableHead className='text-left font-medium'>Code</TableHead>
                        <TableHead className='text-center'>Contact</TableHead>
                        <TableHead className='text-center'>Plan</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Created</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>

                <TableBody />
            </Table>
        </div>
    )
}

export default RecentTenantsTable
