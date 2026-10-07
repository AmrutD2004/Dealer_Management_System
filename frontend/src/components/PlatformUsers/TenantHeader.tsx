import { AuthContext } from '@/Contexts/AuthContext'
import {  Building2, Plus } from 'lucide-react'
import { useContext } from 'react'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { cn } from 'cn'

const TenantHeader = () => {
    const navigate = useNavigate()
    const {userInfo} = useContext(AuthContext)
  return (
    <>
<div className='flex w-full items-center text-foreground'>
         <div className='flex flex-col items-start gap-2'>
             <div className='flex items-center gap-2'>
                 <Building2 /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Tenant Management</h1>
             </div>
            <p className='text-muted-foreground font-medium text-sm'>Manage all organizations registered on the DMS platform.</p>
        </div>
        {userInfo?.role === 'SUPER_ADMIN' && <div className='ms-auto'>
            <Button className={cn('flex items-center gap-2')} onClick={() => navigate('/platform/tenant/create')}>
                <Plus />Create Tenant
            </Button>
        </div> }
        
    </div>
   </>
  )
}

export default TenantHeader
