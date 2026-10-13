import { ClipboardList, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CreateJobCardModal } from './Modals/CreateJobCardModal'

interface JobCardHeaderProps {
    onCreated?: () => void
}

const JobCardHeader = ({ onCreated }: JobCardHeaderProps) => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <ClipboardList /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Job Card Management</h1>
                    </div>
                </div>
                <div className='ms-auto'>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Create Job Card
                    </Button>
                </div>
            </div>
            <CreateJobCardModal open={open} setOpen={setOpen} onCreated={onCreated} />
        </>
    )
}

export default JobCardHeader
