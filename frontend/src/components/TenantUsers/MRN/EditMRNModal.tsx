import { getBinList, getBranchPartMasterList, getStorageList, updateMRN } from "@/api/endpoints"
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
import type { mrnFormType, mrnListType } from "@/Types/mrnType"
import type { binListType, storageListType } from "@/Types/tenantCreateType"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import MRNFormFields from "./MRNFormFields"
import { buildMrnUpdatePayload, createInitialMrnForm, mrnFormFromRecord, validateMrnForm } from "./mrnForm"

interface EditMRNModalProps {
    mrn: mrnListType | null
    open: boolean
    onClose: () => void
    onUpdated?: () => void
}

export function EditMRNModal({ mrn, open, onClose, onUpdated }: EditMRNModalProps) {
    const [loading, setLoading] = useState(false)
    const [stores, setStores] = useState<storageListType[]>([])
    const [bins, setBins] = useState<binListType[]>([])
    const [parts, setParts] = useState<BranchPartMasterListType[]>([])
    const [formData, setFormData] = useState<mrnFormType>(createInitialMrnForm)

    useEffect(() => {
        if (mrn) {
            setFormData(mrnFormFromRecord(mrn))
        }
    }, [mrn])

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [storeData, binData, partData] = await Promise.all([
                    getStorageList(),
                    getBinList(),
                    getBranchPartMasterList(),
                ])
                if (storeData?.success) setStores(storeData?.data ?? [])
                if (binData?.success) setBins(binData?.data ?? [])
                if (partData?.success) setParts(partData?.data ?? [])
            } catch (err: unknown) {
                toast.add({ type: "error", description: getErrorMessage(err) })
            }
        }
        if (open) {
            loadOptions()
        }
    }, [open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!mrn) return
        const validationError = validateMrnForm(formData)
        if (validationError) {
            toast.add({ type: "error", description: validationError })
            return
        }
        setLoading(true)
        try {
            const data = await updateMRN(buildMrnUpdatePayload(formData), mrn.id)
            if (data?.success) {
                toast.add({ type: "success", description: data?.message })
                onUpdated?.()
                setTimeout(onClose, 10)
            } else {
                toast.add({ type: "error", description: data?.message })
            }
        } catch (err: unknown) {
            toast.add({ type: "error", description: getErrorMessage(err) })
        } finally {
            setLoading(false)
        }
    }

    if (!mrn) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm w-full md:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Update MRN</DialogTitle>
                    <DialogDescription>Update the MRN details and save changes. Store, date and MRN type cannot be changed.</DialogDescription>
                </DialogHeader>

                <form id="mrn-edit-form" onSubmit={handleSubmit}>
                    <MRNFormFields
                        formData={formData}
                        setFormData={setFormData}
                        stores={stores}
                        bins={bins}
                        parts={parts}
                        lockIdentity
                    />
                </form>

                <DialogFooter>
                    <Button type="button" variant="outline" disabled={loading} onClick={onClose}>Cancel</Button>
                    <Button form="mrn-edit-form" type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        Update MRN
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
