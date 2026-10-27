import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { CalendarClock, Plus } from 'lucide-react'
import { useState } from 'react'
import { CreateJobCardAllocationModal } from './Modals/CreateJobCardAllocationModal'

interface JobCardAllocationHeaderProps {
    onCreated?: () => void
}

const JobCardAllocationHeader = ({ onCreated }: JobCardAllocationHeaderProps) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <CalendarClock /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Job Card Allocation</h1>
                    </div>
                    <p className='text-muted-foreground font-medium text-sm'>Assign open job cards to dealer bays and mechanics.</p>
                </div>
                <div className='ms-auto'>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Allocate Job Card
                    </Button>
                </div>
            </div>
            <CreateJobCardAllocationModal open={open} setOpen={setOpen} onCreated={onCreated} />
        </>
    )
}

export default JobCardAllocationHeader
