import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Users, UserCheck } from 'lucide-react'

/* Structure only — values will be populated from the dashboard API. */

const KpiCards = () => {
    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full'>
            <Card>
                <CardHeader className='flex flex-row items-center justify-between'>
                    <CardTitle className='text-muted-foreground font-medium'>Total Tenants</CardTitle>
                    <Building2 className='text-muted-foreground h-5 w-5' />
                </CardHeader>
                <CardContent className='flex items-end gap-3'>
                    <span className='text-3xl font-semibold tracking-tight'>--</span>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between'>
                    <CardTitle className='text-muted-foreground font-medium'>Active Tenants</CardTitle>
                    <UserCheck className='text-muted-foreground h-5 w-5' />
                </CardHeader>
                <CardContent className='flex items-end gap-3'>
                    <span className='text-3xl font-semibold tracking-tight'>--</span>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className='flex flex-row items-center justify-between'>
                    <CardTitle className='text-muted-foreground font-medium'>Platform Users</CardTitle>
                    <Users className='text-muted-foreground h-5 w-5' />
                </CardHeader>
                <CardContent className='flex items-end gap-3'>
                    <span className='text-3xl font-semibold tracking-tight'>--</span>
                </CardContent>
            </Card>
        </div>
    )
}

export default KpiCards
