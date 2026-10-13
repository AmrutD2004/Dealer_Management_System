import { Wrench, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from 'cn'
import { CreateRepairOrderModal } from '../Modals/CreateRepairOrderModal'

interface RepairOrderHeaderProps {
    onCreated?: () => void
}

const RepairOrderHeader = ({ onCreated }: RepairOrderHeaderProps) => {
    const [open, setOpen] = useState(false)
  return (
    <>
<div className='flex w-full items-center text-foreground'>
         <div className='flex flex-col items-start gap-2'>
             <div className='flex items-center gap-2'>
                 <Wrench /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Repair Order Management</h1>
             </div>
        </div>
        <div className='ms-auto'>
            <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                <Plus />Create Repair Order
            </Button>
        </div>
    </div>
    <CreateRepairOrderModal open={open} setOpen={setOpen} onCreated={onCreated} />
   </>
  )
}

export default RepairOrderHeader