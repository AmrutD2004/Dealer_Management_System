import { ShieldCheck, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from 'cn'
import { CreateRoleModal } from '../Modals/CreateRoleModal'

const RoleHeader = () => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <ShieldCheck /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Role Management</h1>
                    </div>
                </div>
                <div className='ms-auto'>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Create New Role
                    </Button>
                </div>
            </div>
            <CreateRoleModal open={open} setOpen={setOpen} />
        </>
    )
}

export default RoleHeader
