import { Button } from '@/components/ui/button'
import { cn } from 'cn'
import { Key, Plus } from 'lucide-react'
import { useState } from 'react'
import AssignPermissionModal from '../Modals/AssignPermissionModal'

const AssignPermissionHeader = () => {
  const [open, setOpen] = useState(false)
    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <Key /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Assign Permission To Role</h1>
                    </div>
                    <p className='text-sm tracking-tight text-muted-foreground leading-tight'>User can assign permission to a particular role</p>
                </div>
                <div className='ms-auto'>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Assign Permission
                    </Button>
                </div>
            </div>
            <AssignPermissionModal open={open} onClose={setOpen} />
        </>
    )
}

export default AssignPermissionHeader
