import { CalendarClock, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useNavigate, useParams } from 'react-router-dom'

const ServiceAppointmentHeader = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    return (
        <div className='flex w-full items-center text-foreground'>
            <div className='flex flex-col items-start gap-2'>
                <div className='flex items-center gap-2'>
                    <CalendarClock /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Service Appointment Management</h1>
                </div>
                <p className='text-sm text-muted-foreground'>Create and manage service appointments for customer vehicles.</p>
            </div>
            <div className='ms-auto'>
                <Button className={cn('flex items-center gap-2')} onClick={() => navigate(`/tenant/${id}/service-appointment/create`)}>
                    <Plus />Create Service Appointment
                </Button>
            </div>
        </div>
    )
}

export default ServiceAppointmentHeader
