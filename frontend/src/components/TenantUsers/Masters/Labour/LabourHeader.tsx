import { HardHat, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from 'cn'
import { CreateLabourModal } from '../Modals/CreateLabourModal'

interface LabourHeaderProps {
    onCreated?: () => void
}

const LabourHeader = ({ onCreated }: LabourHeaderProps) => {
    const [open, setOpen] = useState(false)
  return (
    <>
<div className='flex w-full items-center text-foreground'>
         <div className='flex flex-col items-start gap-2'>
             <div className='flex items-center gap-2'>
                 <HardHat /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Labour Management</h1>
             </div>
        </div>
        <div className='ms-auto'>
            <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                <Plus />Create Labour
            </Button>
        </div>
    </div>
    <CreateLabourModal open={open} setOpen={setOpen} onCreated={onCreated} />
   </>
  )
}

export default LabourHeader
