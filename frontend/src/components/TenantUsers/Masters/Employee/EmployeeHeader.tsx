import { Users, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from 'cn'
import { CreateEmployeeModal } from '../Modals/CreateEmployeeModal'

const EmployeeHeader = () => {
    const [open, setOpen] = useState(false)
    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <Users /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Employee Management</h1>
                    </div>
                </div>
                <div className='ms-auto'>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Add New Employee
                    </Button>
                </div>
            </div>
            <CreateEmployeeModal open={open} setOpen={setOpen} />
        </>
    )
}

export default EmployeeHeader
