import { Button } from '@/components/ui/button'
import { cn } from 'cn'
import { Key, Plus } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const AssignPermissionHeader = () => {
    const {id} = useParams()
    const navigate = useNavigate()
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
                    <Button className={cn('flex items-center gap-2')} onClick={() => navigate(`/tenant/${id}/masters/assign/permission`)}>
                        <Plus />Assign Permission
                    </Button>
                </div>
            </div>
        </>
    )
}

export default AssignPermissionHeader
