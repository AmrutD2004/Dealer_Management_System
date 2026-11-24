import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import { MRNCreateForm } from '@/components/TenantUsers/MRN/MRNCreateForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft, PackagePlus } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const MRNCreate = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const goBack = () => navigate(`/tenant/${id}/mrn`)

    return (
        <TenantDashboardLayout>
            <div className='min-h-screen'>
                <div className='mx-auto max-w-7xl space-y-6'>
                    <div className='flex items-start justify-between gap-4 px-7 py-5'>
                        <div>
                            <div className='flex items-center gap-2'>
                                <PackagePlus />
                                <h1 className='text-2xl font-semibold tracking-tight text-foreground'>Create MRN</h1>
                            </div>
                            <p className='mt-1 text-sm text-muted-foreground'>Record the incoming parts against a delivery note or invoice.</p>
                        </div>
                        <Button variant='outline' onClick={goBack} className='mt-1 gap-2'>
                            <ArrowLeft className='h-4 w-4' />
                            Back
                        </Button>
                    </div>

                    <div className='rounded-2xl border px-6 shadow-sm mx-5 mb-5'>
                        <MRNCreateForm onCancel={goBack} onCreated={goBack} />
                    </div>
                </div>
            </div>
        </TenantDashboardLayout>
    )
}

export default MRNCreate
