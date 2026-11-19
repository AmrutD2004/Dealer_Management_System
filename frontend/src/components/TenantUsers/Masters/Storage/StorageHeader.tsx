import { Button } from '@/components/ui/button'
import { cn } from "@/lib/utils"
import { Folder, Plus } from 'lucide-react'
import { useState } from 'react'
import { CreateStorageModal } from '../Modals/CreateStorageModal'

const StorageHeader = () => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <Folder className="h-4 w-4" /> <span className="font-semibold tracking-tight text-2xl text-foreground">Storage Management</span>
                    </div>
                    <p className='text-muted-foreground font-medium text-sm'>Manage the storage locations available for this tenant.</p>
                </div>
                <div className='ms-auto'>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Create Storage
                    </Button>
                </div>
            </div>
            <CreateStorageModal open={open} setOpen={setOpen} />
        </>
    )
}

export default StorageHeader
