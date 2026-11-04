import TenantDashboardLayout from '@/components/layout/TenantLayout/DashboardLayout'
import { ServiceAppointmentCreateForm } from '@/components/TenantUsers/ServiceAppointment/ServiceAppointmentCreateForm'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CalendarClock } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'

const ServiceAppointmentCreate = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const goBack = () => navigate(`/tenant/${id}/service-appointment`)

    return (
        <TenantDashboardLayout>
            <div className='min-h-screen'>
                <div className='mx-auto max-w-7xl space-y-6'>
                    <div className='flex items-start justify-between gap-4 px-7 py-5'>
                        <div>
                            <div className='flex items-center gap-2'>
                                <CalendarClock />
                                <h1 className='text-2xl font-semibold tracking-tight text-foreground'>Create Service Appointment</h1>
                            </div>
                            <p className='mt-1 text-sm text-muted-foreground'>Schedule a service appointment for a customer vehicle.</p>
                        </div>
                        <Button variant='outline' onClick={goBack} className='mt-1 gap-2'>
                            <ArrowLeft className='h-4 w-4' />
                            Back
                        </Button>
                    </div>


                    <div className='rounded-2xl border px-6 shadow-sm mx-5 mb-5'>
                        <ServiceAppointmentCreateForm onCancel={goBack} onCreated={goBack} />
                    </div>
                </div>
            </div>
        </TenantDashboardLayout>
    )
}

export default ServiceAppointmentCreate
