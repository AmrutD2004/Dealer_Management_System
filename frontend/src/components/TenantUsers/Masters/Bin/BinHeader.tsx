import { Button } from '@/components/ui/button'
import { cn } from "@/lib/utils"
import { Archive, Plus } from 'lucide-react'
import { useState } from 'react'
import { CreateBinModal } from '../Modals/CreateBinModal'

const BinHeader = () => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <Archive className="h-4 w-4" /> <span className="font-semibold tracking-tight text-2xl text-foreground">Bin Management</span>
                    </div>
                    <p className='text-muted-foreground font-medium text-sm'>Manage the storage bins available for this tenant.</p>
                </div>
                <div className='ms-auto'>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Create Bin
                    </Button>
                </div>
            </div>
            <CreateBinModal open={open} setOpen={setOpen} />
        </>
    )
}

export default BinHeader
