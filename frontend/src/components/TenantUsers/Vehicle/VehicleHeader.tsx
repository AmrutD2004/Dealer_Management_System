import { Car, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CreateVehicleModal } from './Modals/CreateVehicleModal'

interface VehicleHeaderProps {
    onCreated?: () => void
}

const VehicleHeader = ({ onCreated }: VehicleHeaderProps) => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <Car /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Vehicle Management</h1>
                    </div>
                </div>
                <div className='ms-auto'>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Create Vehicle
                    </Button>
                </div>
            </div>
            <CreateVehicleModal open={open} setOpen={setOpen} onCreated={onCreated} />
        </>
    )
}

export default VehicleHeader