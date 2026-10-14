import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import { JobCardCreateForm } from '@/components/TenantUsers/JobCard/JobCardCreateForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ClipboardList } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const JobCardCreate = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const goBack = () => navigate(`/tenant/${id}/job-card`)

    return (
        <TenantDashboardLayout>
            <div className='min-h-screen'>
                <div className='mx-auto max-w-7xl space-y-6'>
                    <div className='flex items-start justify-between gap-4 px-7 py-5'>
                        <div>
                            <div className='flex items-center gap-2'>
                                <ClipboardList />
                                <h1 className='text-2xl font-semibold tracking-tight text-foreground'>Create Job Card</h1>
                            </div>
                            <p className='mt-1 text-sm text-muted-foreground'>Open a job card for a vehicle service.</p>
                        </div>
                        <Button variant='outline' onClick={goBack} className='mt-1 gap-2'>
                            <ArrowLeft className='h-4 w-4' />
                            Back
                        </Button>
                    </div>

                    <div className='rounded-2xl border px-6 shadow-sm mx-5 mb-5'>
                        <JobCardCreateForm onCancel={goBack} onCreated={goBack} />
                    </div>
                </div>
            </div>
        </TenantDashboardLayout>
    )
}

export default JobCardCreate
