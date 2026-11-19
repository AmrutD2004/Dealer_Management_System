import { AuthContext } from '@/Contexts/AuthContext'
import { KeyRound } from 'lucide-react'
import { useContext } from 'react'
import { AddPermissionModal } from './Modals/AddPermissionModal'

const PermissionHeader = () => {
    const { userInfo } = useContext(AuthContext)
    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <KeyRound /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Permission Management</h1>
                    </div>
                    <p className='text-muted-foreground font-medium text-sm'>Manage all the permissions available on the DMS platform.</p>
                </div>
                {userInfo?.role === 'SUPER_ADMIN' && <div className='ms-auto'>
                    <AddPermissionModal />
                </div>}

            </div>
        </>
    )
}

export default PermissionHeader
