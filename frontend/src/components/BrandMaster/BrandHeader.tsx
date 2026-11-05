import { AuthContext } from '@/Contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { FileSpreadsheet, Tag } from 'lucide-react'
import { useContext, useState } from 'react'
import { ImportExcelUploadModal } from '../TenantUsers/Masters/Imports/ImportExcelUploadModal'
import { brandImportConfig } from '../TenantUsers/Masters/Imports/importUploadConfigs'
import { CreateBrandModal } from './Modals/CreateBrandModal'

interface BrandHeaderProps {
    onCreated?: () => void
}

const BrandHeader = ({ onCreated }: BrandHeaderProps) => {
    const { userInfo, userType } = useContext(AuthContext)
    const [importOpen, setImportOpen] = useState(false)

    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <Tag /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Brand Master</h1>
                    </div>
                    <p className='text-muted-foreground font-medium text-sm'>Manage all the vehicle brands available on the DMS platform.</p>
                </div>
                {userType === 'PLATFORM_USER' && <div className='ms-auto flex items-center gap-2'>
                    <Button variant='outline' className='flex items-center gap-2' onClick={() => setImportOpen(true)}>
                        <FileSpreadsheet />Import Excel
                    </Button>
                </div>}
                {userInfo?.role?.roleCode === 'SUPER_ADMIN' && <div className='ms-auto'>
                    <CreateBrandModal onCreated={onCreated} />
                </div>}
            </div>
            <ImportExcelUploadModal open={importOpen} setOpen={setImportOpen} config={brandImportConfig} onImported={onCreated} />
        </>
    )
}

export default BrandHeader
