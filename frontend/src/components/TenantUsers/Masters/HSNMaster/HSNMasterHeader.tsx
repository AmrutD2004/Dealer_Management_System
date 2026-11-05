import { Button } from '@/components/ui/button'
import { cn } from "@/lib/utils"
import { FileSpreadsheet, Percent, Plus } from 'lucide-react'
import { useState } from 'react'
import { ImportExcelUploadModal } from '../Imports/ImportExcelUploadModal'
import { hsnImportConfig } from '../Imports/importUploadConfigs'
import { CreateHSNModal } from '../Modals/CreateHSNModal'

interface HSNMasterHeaderProps {
    onCreated?: () => void
}

const HSNMasterHeader = ({ onCreated }: HSNMasterHeaderProps) => {
    const [open, setOpen] = useState(false)
    const [importOpen, setImportOpen] = useState(false)

    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <Percent /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>HSN Management</h1>
                    </div>
                    <p className='text-muted-foreground font-medium text-sm'>Manage the HSN codes and tax rates available for this tenant.</p>
                </div>
                <div className='ms-auto flex items-center gap-2'>
                    <Button variant='outline' className={cn('flex items-center gap-2')} onClick={() => setImportOpen(true)}>
                        <FileSpreadsheet />Import Excel
                    </Button>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Create HSN
                    </Button>
                </div>
            </div>
            <CreateHSNModal open={open} setOpen={setOpen} onCreated={onCreated} />
            <ImportExcelUploadModal open={importOpen} setOpen={setImportOpen} config={hsnImportConfig} onImported={onCreated} />
        </>
    )
}

export default HSNMasterHeader
