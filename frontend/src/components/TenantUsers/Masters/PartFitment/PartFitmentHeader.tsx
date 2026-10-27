import { Button } from '@/components/ui/button'
import { cn } from 'cn'
import { Link2, Plus } from 'lucide-react'
import { useState } from 'react'
import { CreatePartFitmentModal } from '../Modals/CreatePartFitmentModal'

interface PartFitmentHeaderProps {
    onCreated?: () => void
}

const PartFitmentHeader = ({ onCreated }: PartFitmentHeaderProps) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <Link2 /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Part Fitment Management</h1>
                    </div>
                    <p className='text-muted-foreground font-medium text-sm'>Manage which vehicle brands, models and variants each part fits.</p>
                </div>
                <div className='ms-auto'>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Create Fitment
                    </Button>
                </div>
            </div>
            <CreatePartFitmentModal open={open} setOpen={setOpen} onCreated={onCreated} />
        </>
    )
}

export default PartFitmentHeader
