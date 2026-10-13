import { UserRound, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { CreateCustomerModal } from './Modals/CreateCustomerModal'

interface CustomerHeaderProps {
    onCreated?: () => void
}

const CustomerHeader = ({ onCreated }: CustomerHeaderProps) => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <UserRound /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Customer Management</h1>
                    </div>
                </div>
                <div className='ms-auto'>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Create Customer
                    </Button>
                </div>
            </div>
            <CreateCustomerModal open={open} setOpen={setOpen} onCreated={onCreated} />
        </>
    )
}

export default CustomerHeader
