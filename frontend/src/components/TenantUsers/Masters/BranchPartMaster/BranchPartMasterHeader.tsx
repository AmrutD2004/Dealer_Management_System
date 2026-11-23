import { Button } from '@/components/ui/button'
import { cn } from "@/lib/utils"
import { PackageSearch, Plus } from 'lucide-react'
import { useState } from 'react'
import { CreateBranchPartMasterModal } from '../Modals/CreateBranchPartMasterModal'

interface BranchPartMasterHeaderProps {
    onCreated?: () => void
}

const BranchPartMasterHeader = ({ onCreated }: BranchPartMasterHeaderProps) => {
    const [open, setOpen] = useState(false)

    return (
        <>
            <div className='flex w-full items-center text-foreground'>
                <div className='flex flex-col items-start gap-2'>
                    <div className='flex items-center gap-2'>
                        <PackageSearch /><h1 className='font-semibold tracking-tight text-2xl text-foreground'>Branch wise Part Master</h1>
                    </div>
                    <p className='text-muted-foreground font-medium text-sm'>Manage parts, stores and bins for the current branch.</p>
                </div>
                <div className='ms-auto flex items-center gap-2'>
                    <Button className={cn('flex items-center gap-2')} onClick={() => setOpen(true)}>
                        <Plus />Create Branch Part
                    </Button>
                </div>
            </div>
            <CreateBranchPartMasterModal open={open} setOpen={setOpen} onCreated={onCreated} />
        </>
    )
}

export default BranchPartMasterHeader
