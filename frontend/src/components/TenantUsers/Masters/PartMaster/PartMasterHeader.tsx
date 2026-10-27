import { Button } from '@/components/ui/button'
import { cn } from 'cn'
import { PackageSearch, Plus } from 'lucide-react'
import { useState } from 'react'
import { CreatePartMasterModal } from '../Modals/CreatePartMasterModal'

interface PartMasterHeaderProps {
    onCreated?: () => void
}

const PartMasterHeader = ({ onCreated }: PartMasterHeaderProps) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <PackageSearch /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Part Master</h1>
                    </div>
                    <p className='text-muted-foreground font-medium text-sm'>Manage the parts available for this tenant.</p>
                </div>
                <div className='ms-auto'>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Create Part
                    </Button>
                </div>
            </div>
            <CreatePartMasterModal open={open} setOpen={setOpen} onCreated={onCreated} />
        </>
    )
}

export default PartMasterHeader
