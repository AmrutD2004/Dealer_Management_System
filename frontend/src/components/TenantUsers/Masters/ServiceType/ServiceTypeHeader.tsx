import { Boxes, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from 'cn'
import { CreateServiceTypeModal } from '../Modals/CreateServiceTypeModal'

interface ServiceTypeHeaderProps {
    onCreated?: () => void
}

const ServiceTypeHeader = ({ onCreated }: ServiceTypeHeaderProps) => {
    const [open, setOpen] = useState(false)
  return (
    <>
<div className='flex w-full items-center text-foreground'>
         <div className='flex flex-col items-start gap-2'>
             <div className='flex items-center gap-2'>
                 <Boxes /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Service Type Management</h1>
             </div>
        </div>
        <div className='ms-auto'>
            <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                <Plus />Create Type
            </Button>
        </div>
    </div>
    <CreateServiceTypeModal open={open} setOpen={setOpen} onCreated={onCreated} />
   </>
  )
}

export default ServiceTypeHeader