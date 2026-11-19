import { editBin, getStorageList } from "@/api/endpoints"
import { getErrorMessage } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { TenantContext } from "@/Contexts/Tenant/TenantContext"
import type { binListType, storageListType } from "@/Types/tenantCreateType"
import { Loader2, Tag } from "lucide-react"
import { useContext, useEffect, useState } from "react"

interface EditBinModalProps {
    bin: binListType | null
    open: boolean
    onClose: () => void
}

const initialFormData = {
    binCode: "",
    storeId: "",
    binDescription: "",
}

export function EditBinModal({ bin, open, onClose }: EditBinModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [stores, setStores] = useState<storageListType[]>([])
    const [formData, setFormData] = useState(initialFormData)
    const { fetchBinList, closeAllBinModals } = useContext(TenantContext)

    useEffect(() => {
        if (bin) {
            setFormData({
                binCode: bin.binCode ?? "",
                storeId: String(bin.storeId ?? ""),
                binDescription: bin.binDescription ?? "",
            })
        }
    }, [bin])

    useEffect(() => {
        const loadStores = async () => {
            try {
                const data = await getStorageList()
                if (data?.success) {
                    setStores(data?.data ?? [])
                }
            } catch (err: unknown) {
                toast.add({
                    type: 'error',
                    description: getErrorMessage(err)
                })
            }
        }
        if (open) loadStores()
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCancel = () => {
        closeAllBinModals()
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!bin) return
        if (!formData.binCode.trim() || !formData.storeId) {
            toast.add({
                type: 'error',
                description: 'Bin code and storage location are required'
            })
            return
        }
        setLoading(true)
        try {
            const payload = {
                binCode: formData.binCode.trim(),
                binDescription: formData.binDescription.trim() || null,
                storeId: Number(formData.storeId),
            }
            const data = await editBin(payload, bin.id)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchBinList()
                setTimeout(() => {
                    handleCancel()
                }, 10)
            } else {
                toast.add({
                    type: 'error',
                    description: data?.message
                })
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: getErrorMessage(err)
            })
        } finally {
            setLoading(false)
        }
    }

    if (!bin) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-2xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Tag className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle>Edit Bin</DialogTitle>
                            <DialogDescription>Update the bin code, description or storage location.</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form id="bin-edit-form" onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Bin Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Bin Code <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='binCode' placeholder="e.g. BIN001" required onChange={handleChange} value={formData.binCode} className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Storage <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={stores.map((store) => ({ value: String(store.id), label: `${store.code} - ${store.description}` }))}
                                            value={formData.storeId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, storeId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select storage" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {stores.map((store) => (
                                                    <SelectItem key={store.id} value={String(store.id)}>
                                                        {store.code} - {store.description}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                                    <FieldLabel className="text-xs font-medium">Description</FieldLabel>
                                    <div className="min-w-0">
                                        <Textarea name='binDescription' placeholder="Optional description" onChange={handleChange} value={formData.binDescription} className="min-h-[48px] rounded-none px-2 py-1 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={handleCancel} variant="outline" disabled={loading}>Cancel</Button>
                    <Button form="bin-edit-form" type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        Update Bin
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
