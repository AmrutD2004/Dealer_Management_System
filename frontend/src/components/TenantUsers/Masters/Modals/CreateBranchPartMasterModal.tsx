import { createBranchPartMaster, getBinList, getPartMasterList, getStorageList } from "@/api/endpoints"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/utils"
import type { PartMasterListType } from "@/Types/partMasterType"
import type { binListType, storageListType } from "@/Types/tenantCreateType"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import BranchPartMasterFormFields from "../BranchPartMaster/BranchPartMasterFormFields"
import {
    buildBranchPartMasterPayload,
    initialBranchPartMasterForm,
    validateBranchPartMasterForm
} from "../BranchPartMaster/branchPartMasterForm"

interface CreateBranchPartMasterModalProps {
    open: boolean,
    setOpen: (open: boolean) => void,
    onCreated?: () => void
}

export function CreateBranchPartMasterModal({ open, setOpen, onCreated }: CreateBranchPartMasterModalProps) {
    const [loading, setLoading] = useState(false)
    const [parts, setParts] = useState<PartMasterListType[]>([])
    const [stores, setStores] = useState<storageListType[]>([])
    const [bins, setBins] = useState<binListType[]>([])
    const [formData, setFormData] = useState(initialBranchPartMasterForm)

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [partData, storeData, binData] = await Promise.all([
                    getPartMasterList(),
                    getStorageList(),
                    getBinList()
                ])
                if (partData?.success) setParts(partData?.data ?? [])
                if (storeData?.success) setStores(storeData?.data ?? [])
                if (binData?.success) setBins(binData?.data ?? [])
            } catch (err: unknown) {
                toast.add({ type: 'error', description: getErrorMessage(err) })
            }
        }
        if (open) {
            setFormData(initialBranchPartMasterForm)
            loadOptions()
        }
    }, [open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const validationError = validateBranchPartMasterForm(formData)
        if (validationError) {
            toast.add({ type: 'error', description: validationError })
            return
        }
        setLoading(true)
        try {
            const data = await createBranchPartMaster(buildBranchPartMasterPayload(formData))
            if (data?.success) {
                toast.add({ type: 'success', description: data?.message })
                onCreated?.()
                setFormData(initialBranchPartMasterForm)
                setTimeout(() => setOpen(false), 10)
            } else {
                toast.add({ type: 'error', description: data?.message })
            }
        } catch (err: unknown) {
            toast.add({ type: 'error', description: getErrorMessage(err) })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm w-full md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Create Branch wise Part Master</DialogTitle>
                    <DialogDescription>Add a part to this branch with its store, bin and stock details.</DialogDescription>
                </DialogHeader>

                <form id="branch-part-master-create-form" onSubmit={handleSubmit}>
                    <BranchPartMasterFormFields
                        formData={formData}
                        setFormData={setFormData}
                        parts={parts}
                        stores={stores}
                        bins={bins}
                        allowMultipleStores
                    />
                </form>

                <DialogFooter>
                    <Button type="button" variant="outline" disabled={loading} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button form="branch-part-master-create-form" type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
