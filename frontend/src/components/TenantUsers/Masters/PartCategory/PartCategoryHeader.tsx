import { Button } from '@/components/ui/button'
import { cn } from "@/lib/utils"
import { FileSpreadsheet, Package, Plus } from 'lucide-react'
import { useState } from 'react'
import { CreatePartCategoryModal } from '../Modals/CreatePartCategoryModal'
import { ImportExcelModal } from '../Imports/ImportExcelModal'
import { partCategoryImportConfig } from '../Imports/importConfigs'

interface PartCategoryHeaderProps {
    onCreated?: () => void
}

const PartCategoryHeader = ({ onCreated }: PartCategoryHeaderProps) => {
    const [open, setOpen] = useState(false)
    const [importOpen, setImportOpen] = useState(false)

    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <Package /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Part Category Management</h1>
                    </div>
                    <p className='text-muted-foreground font-medium text-sm'>Manage the part categories available for this tenant.</p>
                </div>
                <div className='ms-auto flex items-center gap-2'>
                    <Button variant='outline' className={cn('flex items-center gap-2')} onClick={() => setImportOpen(true)}>
                        <FileSpreadsheet />Import Excel
                    </Button>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Create Category
                    </Button>
                </div>
            </div>
            <CreatePartCategoryModal open={open} setOpen={setOpen} onCreated={onCreated} />
            <ImportExcelModal open={importOpen} setOpen={setImportOpen} config={partCategoryImportConfig} onImported={onCreated} />
        </>
    )
}

export default PartCategoryHeader
