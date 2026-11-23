import { getBinList, getPartMasterList, getStorageList, updateBranchPartMaster } from "@/api/endpoints"
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
import type { BranchPartMasterListType } from "@/Types/branchPartMasterType"
import type { PartMasterListType } from "@/Types/partMasterType"
import type { binListType, storageListType } from "@/Types/tenantCreateType"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import BranchPartMasterFormFields from "../BranchPartMaster/BranchPartMasterFormFields"
import {
    branchPartMasterFormFromRecord,
    buildBranchPartMasterPayload,
    initialBranchPartMasterForm,
    validateBranchPartMasterForm
} from "../BranchPartMaster/branchPartMasterForm"

interface EditBranchPartMasterModalProps {
    record: BranchPartMasterListType | null,
    open: boolean,
    onClose: () => void,
    onUpdated?: () => void
}

export function EditBranchPartMasterModal({ record, open, onClose, onUpdated }: EditBranchPartMasterModalProps) {
    const [loading, setLoading] = useState(false)
    const [parts, setParts] = useState<PartMasterListType[]>([])
    const [stores, setStores] = useState<storageListType[]>([])
    const [bins, setBins] = useState<binListType[]>([])
    const [formData, setFormData] = useState(initialBranchPartMasterForm)

    useEffect(() => {
        if (record) {
            setFormData(branchPartMasterFormFromRecord(record))
        }
    }, [record])

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
        if (open) loadOptions()
    }, [open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!record) return
        const validationError = validateBranchPartMasterForm(formData)
        if (validationError) {
            toast.add({ type: 'error', description: validationError })
            return
        }
        setLoading(true)
        try {
            const data = await updateBranchPartMaster(buildBranchPartMasterPayload(formData), record.id)
            if (data?.success) {
                toast.add({ type: 'success', description: data?.message })
                onUpdated?.()
                setTimeout(onClose, 10)
            } else {
                toast.add({ type: 'error', description: data?.message })
            }
        } catch (err: unknown) {
            toast.add({ type: 'error', description: getErrorMessage(err) })
        } finally {
            setLoading(false)
        }
    }

    if (!record) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm w-full md:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Update Branch wise Part Master</DialogTitle>
                    <DialogDescription>Update stock, levels and pricing. Part, store and bin cannot be changed.</DialogDescription>
                </DialogHeader>

                <form id="branch-part-master-edit-form" onSubmit={handleSubmit}>
                    <BranchPartMasterFormFields
                        formData={formData}
                        setFormData={setFormData}
                        parts={parts}
                        stores={stores}
                        bins={bins}
                        lockIdentity
                    />
                </form>

                <DialogFooter>
                    <Button type="button" variant="outline" disabled={loading} onClick={onClose}>Cancel</Button>
                    <Button form="branch-part-master-edit-form" type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        Update
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
