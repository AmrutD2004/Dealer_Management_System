import { getBinList, getBranchPartMasterList, getStorageList, updateMRN } from "@/api/endpoints"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/utils"
import type { BranchPartMasterListType } from "@/Types/branchPartMasterType"
import type { mrnFormType, mrnListType } from "@/Types/mrnType"
import type { binListType, storageListType } from "@/Types/tenantCreateType"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import MRNFormFields from "./MRNFormFields"
import { buildMrnUpdatePayload, mrnFormFromRecord, validateMrnForm } from "./mrnForm"

interface MRNEditFormProps {
    mrn: mrnListType
    onCancel: () => void
    onUpdated: () => void
}

export function MRNEditForm({ mrn, onCancel, onUpdated }: MRNEditFormProps) {
    const [loading, setLoading] = useState(false)
    const [stores, setStores] = useState<storageListType[]>([])
    const [bins, setBins] = useState<binListType[]>([])
    const [parts, setParts] = useState<BranchPartMasterListType[]>([])
    const [formData, setFormData] = useState<mrnFormType>(() => mrnFormFromRecord(mrn))

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
        loadOptions()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
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
                onUpdated()
            } else {
                toast.add({ type: "error", description: data?.message })
            }
        } catch (err: unknown) {
            toast.add({ type: "error", description: getErrorMessage(err) })
        } finally {
            setLoading(false)
        }
    }

    return (
        <form id="mrn-edit-form" onSubmit={handleSubmit} className="py-6">
            <MRNFormFields
                formData={formData}
                setFormData={setFormData}
                stores={stores}
                bins={bins}
                parts={parts}
                lockIdentity
            />

            <div className="mt-6 flex justify-end gap-2">
                <Button type="button" variant="outline" disabled={loading} onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                    Update MRN
                </Button>
            </div>
        </form>
    )
}
