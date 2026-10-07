import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import RecentTenantsTable from './RecentTenantsTable'

const RecentTenants = () => {
    const navigate = useNavigate()

    return (
        <Card className='mt-7'>
            <CardHeader className='flex flex-row items-center justify-between'>
                <div className='flex flex-col gap-1'>
                    <CardTitle>Recently Added Tenants</CardTitle>
                    <span className='text-sm text-muted-foreground'>Latest organizations registered on the platform.</span>
                </div>
                <Button variant={'outline'} className='flex items-center gap-2' onClick={() => navigate('/platform/tenant')}>
                    View all <ArrowRight className='h-4 w-4' />
                </Button>
            </CardHeader>
            <CardContent>
                <RecentTenantsTable />
            </CardContent>
        </Card>
    )
}

export default RecentTenants
