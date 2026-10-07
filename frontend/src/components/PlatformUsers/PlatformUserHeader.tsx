import { useContext } from 'react'
import { ShieldCheck } from 'lucide-react'
import {AddPlatformUserModal} from './Modals/AddPlatformUserModal'
import { AuthContext } from '@/Contexts/AuthContext'

const PlatformUserHeader = () => {
    const {userInfo} = useContext(AuthContext)
  return (
   <>
<div className='flex w-full items-center text-foreground'>
         <div className='flex flex-col items-start gap-2'>
             <div className='flex items-center gap-2'>
                 <ShieldCheck /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Platform Users</h1>
             </div>
            <p className='text-muted-foreground font-medium text-sm'>Manage the admin team that has access to the DMS platform, and control who is a super admin or a support admin.</p>
        </div>
        {userInfo?.role === 'SUPER_ADMIN' && <div className='ms-auto'>
            <AddPlatformUserModal />
        </div> }
        
    </div>
   </>
  )
}

export default PlatformUserHeader
