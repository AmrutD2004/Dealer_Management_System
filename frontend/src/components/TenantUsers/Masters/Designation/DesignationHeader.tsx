import { Briefcase, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from 'cn'
import { CreateDesignationModal } from '../Modals/CreateDesignationModal'

const DesignationHeader = () => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <Briefcase /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Designation Management</h1>
                    </div>
                </div>
                <div className='ms-auto'>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Create New Designation
                    </Button>
                </div>
            </div>
            <CreateDesignationModal open={open} setOpen={setOpen} />
        </>
    )
}

export default DesignationHeader
