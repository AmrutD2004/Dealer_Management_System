import { Button } from '@/components/ui/button'
import { cn } from 'cn'
import { Percent, Plus } from 'lucide-react'
import { useState } from 'react'
import { CreateHSNModal } from '../Modals/CreateHSNModal'

interface HSNMasterHeaderProps {
    onCreated?: () => void
}

const HSNMasterHeader = ({ onCreated }: HSNMasterHeaderProps) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <Percent /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>HSN Management</h1>
                    </div>
                    <p className='text-muted-foreground font-medium text-sm'>Manage the HSN codes and tax rates available for this tenant.</p>
                </div>
                <div className='ms-auto'>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Create HSN
                    </Button>
                </div>
            </div>
            <CreateHSNModal open={open} setOpen={setOpen} onCreated={onCreated} />
        </>
    )
}

export default HSNMasterHeader
