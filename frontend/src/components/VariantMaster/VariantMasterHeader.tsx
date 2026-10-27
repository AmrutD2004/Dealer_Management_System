import { AuthContext } from '@/Contexts/AuthContext'
import { Layers } from 'lucide-react'
import { useContext } from 'react'
import { CreateVariantModal } from './Modals/CreateVariantModal'

interface VariantMasterHeaderProps {
    onCreated?: () => void
}

const VariantMasterHeader = ({ onCreated }: VariantMasterHeaderProps) => {
    const { userInfo } = useContext(AuthContext)

    return (
        <div className='flex w-full items-center text-foreground'>
            <div className='flex flex-col items-start gap-2'>
                <div className='flex items-center gap-2'>
                    <Layers /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Variant Master</h1>
                </div>
                <p className='text-muted-foreground font-medium text-sm'>Manage all the vehicle variants available on the DMS platform.</p>
            </div>
            {userInfo?.role === 'SUPER_ADMIN' && <div className='ms-auto'>
                <CreateVariantModal onCreated={onCreated} />
            </div>}
        </div>
    )
}

export default VariantMasterHeader
