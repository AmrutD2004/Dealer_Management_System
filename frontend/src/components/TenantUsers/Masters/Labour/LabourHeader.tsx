import { FileSpreadsheet, HardHat, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { cn } from "@/lib/utils"
import { CreateLabourModal } from '../Modals/CreateLabourModal'
import { ImportExcelModal } from '../Imports/ImportExcelModal'
import { labourImportConfig } from '../Imports/importConfigs'

interface LabourHeaderProps {
    onCreated?: () => void
}

const LabourHeader = ({ onCreated }: LabourHeaderProps) => {
    const [open, setOpen] = useState(false)
    const [importOpen, setImportOpen] = useState(false)
  return (
    <>
<div className='flex w-full items-center text-foreground'>
         <div className='flex flex-col items-start gap-2'>
             <div className='flex items-center gap-2'>
                 <HardHat /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Labour Management</h1>
             </div>
        </div>
        <div className='ms-auto flex items-center gap-2'>
            <Button variant='outline' className={cn('flex items-center gap-2')} onClick={() => setImportOpen(true)}>
                <FileSpreadsheet />Import Excel
            </Button>
            <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                <Plus />Create Labour
            </Button>
        </div>
    </div>
    <CreateLabourModal open={open} setOpen={setOpen} onCreated={onCreated} />
    <ImportExcelModal open={importOpen} setOpen={setImportOpen} config={labourImportConfig} onImported={onCreated} />
   </>
  )
}

export default LabourHeader
