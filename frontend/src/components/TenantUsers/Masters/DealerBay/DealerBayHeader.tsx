import { Button } from '@/components/ui/button'
import { cn } from 'cn'
import { Plus, Warehouse } from 'lucide-react'
import { useState } from 'react'
import { CreateDealerBayModal } from '../Modals/CreateDealerBayModal'

interface DealerBayHeaderProps {
    onCreated?: () => void
}

const DealerBayHeader = ({ onCreated }: DealerBayHeaderProps) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <Warehouse /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Dealer's Bay Management</h1>
                    </div>
                    <p className='text-muted-foreground font-medium text-sm'>Manage service bays available in each tenant branch.</p>
                </div>
                <div className='ms-auto'>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Create Bay
                    </Button>
                </div>
            </div>
            <CreateDealerBayModal open={open} setOpen={setOpen} onCreated={onCreated} />
        </>
    )
}

export default DealerBayHeader
