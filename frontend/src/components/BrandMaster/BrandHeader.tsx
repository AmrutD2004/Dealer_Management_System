import { AuthContext } from '@/Contexts/AuthContext'
import { Tag } from 'lucide-react'
import { useContext } from 'react'
import { CreateBrandModal } from './Modals/CreateBrandModal'

interface BrandHeaderProps {
    onCreated?: () => void
}

const BrandHeader = ({ onCreated }: BrandHeaderProps) => {
    const { userInfo } = useContext(AuthContext)

    return (
        <div className='flex w-full items-center text-foreground'>
            <div className='flex flex-col items-start gap-2'>
                <div className='flex items-center gap-2'>
                    <Tag /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Brand Master</h1>
                </div>
                <p className='text-muted-foreground font-medium text-sm'>Manage all the vehicle brands available on the DMS platform.</p>
            </div>
            {userInfo?.role === 'SUPER_ADMIN' && <div className='ms-auto'>
                <CreateBrandModal onCreated={onCreated} />
            </div>}
        </div>
    )
}

export default BrandHeader
