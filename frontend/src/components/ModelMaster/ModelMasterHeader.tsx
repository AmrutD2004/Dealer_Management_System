import { AuthContext } from '@/Contexts/AuthContext'
import { Car } from 'lucide-react'
import { useContext } from 'react'
import { CreateModelModal } from './Modals/CreateModelModal'

interface ModelMasterHeaderProps {
    onCreated?: () => void
}

const ModelMasterHeader = ({ onCreated }: ModelMasterHeaderProps) => {
    const { userInfo } = useContext(AuthContext)

    return (
        <div className='flex w-full items-center text-foreground'>
            <div className='flex flex-col items-start gap-2'>
                <div className='flex items-center gap-2'>
                    <Car /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Model Master</h1>
                </div>
                <p className='text-muted-foreground font-medium text-sm'>Manage all the vehicle models available on the DMS platform.</p>
            </div>
            {userInfo?.role === 'SUPER_ADMIN' && <div className='ms-auto'>
                <CreateModelModal onCreated={onCreated} />
            </div>}
        </div>
    )
}

export default ModelMasterHeader
