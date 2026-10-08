import { Building2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from 'cn'
import { CreateBranchModal } from '../Modals/CreateBranchModal'

const BranchHeader = () => {
    const [open, setOpen] = useState(false)
  return (
    <>
<div className='flex w-full items-center text-foreground'>
         <div className='flex flex-col items-start gap-2'>
             <div className='flex items-center gap-2'>
                 <Building2 /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Branch Management</h1>
             </div>
        </div>
        <div className='ms-auto'>
            <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                <Plus />Create New Branch
            </Button>
        </div>
    </div>
    <CreateBranchModal open={open} setOpen={setOpen} />
   </>
  )
}

export default BranchHeader
