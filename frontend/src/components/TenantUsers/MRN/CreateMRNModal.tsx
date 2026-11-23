import { createMRN, getBinList, getBranchPartMasterList, getStorageList } from "@/api/endpoints"
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
import type { binListType, storageListType } from "@/Types/tenantCreateType"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import MRNFormFields from "./MRNFormFields"
import { buildMrnPayload, createInitialMrnForm, validateMrnForm } from "./mrnForm"

interface CreateMRNModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    onCreated: () => void
}

export function CreateMRNModal({ open, setOpen, onCreated }: CreateMRNModalProps) {
    const [loading, setLoading] = useState(false)
    const [stores, setStores] = useState<storageListType[]>([])
    const [bins, setBins] = useState<binListType[]>([])
    const [parts, setParts] = useState<BranchPartMasterListType[]>([])
    const [formData, setFormData] = useState(createInitialMrnForm)

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
            setFormData(createInitialMrnForm())
            loadOptions()
        }
    }, [open])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const validationError = validateMrnForm(formData)
        if (validationError) {
            toast.add({ type: "error", description: validationError })
            return
        }
        setLoading(true)
        try {
            const data = await createMRN(buildMrnPayload(formData))
            if (data?.success) {
                toast.add({ type: "success", description: data?.message })
                setFormData(createInitialMrnForm())
                onCreated()
                setTimeout(() => setOpen(false), 10)
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
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm w-full md:max-w-5xl lg:max-w-6xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Create MRN</DialogTitle>
                    <DialogDescription>Record the incoming parts against a delivery note or invoice.</DialogDescription>
                </DialogHeader>

                <form id="mrn-create-form" onSubmit={handleSubmit}>
                    <MRNFormFields
                        formData={formData}
                        setFormData={setFormData}
                        stores={stores}
                        bins={bins}
                        parts={parts}
                    />
                </form>

                <DialogFooter>
                    <Button type="button" variant="outline" disabled={loading} onClick={() => setOpen(false)}>Cancel</Button>
                    <Button form="mrn-create-form" type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        Create MRN
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
