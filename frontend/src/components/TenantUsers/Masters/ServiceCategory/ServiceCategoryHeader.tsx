import { Tags, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from 'cn'
import { CreateServiceCategoryModal } from '../Modals/CreateServiceCategoryModal'

interface ServiceCategoryHeaderProps {
    onCreated?: () => void
}

const ServiceCategoryHeader = ({ onCreated }: ServiceCategoryHeaderProps) => {
    const [open, setOpen] = useState(false)
  return (
    <>
<div className='flex w-full items-center text-foreground'>
         <div className='flex flex-col items-start gap-2'>
             <div className='flex items-center gap-2'>
                 <Tags /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Service Category Management</h1>
             </div>
        </div>
        <div className='ms-auto'>
            <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                <Plus />Create Category
            </Button>
        </div>
    </div>
    <CreateServiceCategoryModal open={open} setOpen={setOpen} onCreated={onCreated} />
   </>
  )
}

export default ServiceCategoryHeader