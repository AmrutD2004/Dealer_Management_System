import { Car, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useNavigate, useParams } from 'react-router-dom'

const VehicleHeader = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    return (
        <div className='flex w-full items-center text-foreground'>
            <div className='flex flex-col items-start gap-2'>
                <div className='flex items-center gap-2'>
                    <Car /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Vehicle Management</h1>
                </div>
            </div>
            <div className='ms-auto'>
                <Button className={cn('flex items-center gap-2')} onClick={() => navigate(`/tenant/${id}/vehicle/create`)}>
                    <Plus />Create Vehicle
                </Button>
            </div>
        </div>
    )
}

export default VehicleHeader
