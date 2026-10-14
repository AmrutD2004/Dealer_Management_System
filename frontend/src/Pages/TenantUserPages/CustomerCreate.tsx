import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import { CustomerCreateForm } from '@/components/TenantUsers/Customer/CustomerCreateForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft, UserRound } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const CustomerCreate = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const goBack = () => navigate(`/tenant/${id}/customer`)

    return (
        <TenantDashboardLayout>
            <div className='min-h-screen'>
                <div className='mx-auto max-w-7xl space-y-6'>
                    <div className='flex items-start justify-between gap-4 px-7 py-4'>
                        <div>
                            <div className='flex items-center gap-2 '>
                                <UserRound />
                                <h1 className='text-2xl font-semibold tracking-tight text-foreground'>Create Customer</h1>
                            </div>
                            <p className='mt-1 text-sm text-muted-foreground'>Add a new customer to the tenant.</p>
                        </div>
                        <Button variant='outline' onClick={goBack} className='mt-1 gap-2'>
                            <ArrowLeft className='h-4 w-4' />
                            Back
                        </Button>
                    </div>

                    <div className='rounded-2xl border px-6 shadow-sm mx-5 mb-5'>
                        <CustomerCreateForm onCancel={goBack} onCreated={goBack} />
                    </div>
                </div>
            </div>
        </TenantDashboardLayout>
    )
}

export default CustomerCreate
