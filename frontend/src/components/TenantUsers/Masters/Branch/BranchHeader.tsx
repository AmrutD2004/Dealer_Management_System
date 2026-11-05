import { Building2, FileSpreadsheet, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useContext, useState } from 'react'
import { cn } from "@/lib/utils"
import { TenantContext } from '@/Contexts/Tenant/TenantContext'
import { CreateBranchModal } from '../Modals/CreateBranchModal'
import { ImportExcelModal } from '../Imports/ImportExcelModal'
import { branchImportConfig } from '../Imports/importConfigs'

const BranchHeader = () => {
    const [open, setOpen] = useState(false)
    const [importOpen, setImportOpen] = useState(false)
    const { fetchTenantBranchList, skip, take } = useContext(TenantContext)
  return (
    <>
<div className='flex w-full items-center text-foreground'>
         <div className='flex flex-col items-start gap-2'>
             <div className='flex items-center gap-2'>
                 <Building2 /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Branch Management</h1>
             </div>
        </div>
        <div className='ms-auto flex items-center gap-2'>
            <Button variant='outline' className={cn('flex items-center gap-2')} onClick={() => setImportOpen(true)}>
                <FileSpreadsheet />Import Excel
            </Button>
            <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                <Plus />Create New Branch
            </Button>
        </div>
    </div>
    <CreateBranchModal open={open} setOpen={setOpen} />
    <ImportExcelModal open={importOpen} setOpen={setImportOpen} config={branchImportConfig} onImported={() => fetchTenantBranchList(skip, take)} />
   </>
  )
}

export default BranchHeader
