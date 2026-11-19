import { createBin } from "@/api/endpoints"
import { getErrorMessage } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
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
import { Textarea } from "@/components/ui/textarea"
import { useContext, useState } from "react"
import { TenantContext } from "@/Contexts/Tenant/TenantContext"
import { toast } from "@/components/ui/toast"
import { Loader2 } from "lucide-react"

interface CreateBinModalProps {
    open: boolean
    setOpen: (open: boolean) => void
}

const initialFormData = {
    binCode: "",
    binName: "",
    description: "",
    isActive: true,
}

export function CreateBinModal({ open, setOpen }: CreateBinModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const { fetchBinList, binSkip, binTake } = useContext(TenantContext)
    const [formData, setFormData] = useState(initialFormData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.binCode.trim() || !formData.binName.trim()) {
            toast.add({
                type: 'error',
                description: 'Bin code and bin name are required'
            })
            return
        }
        setLoading(true)
        try {
            const payload = {
                binCode: formData.binCode.trim(),
                binName: formData.binName.trim(),
                description: formData.description.trim() || null,
                isActive: formData.isActive
            }
            const data = await createBin(payload)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                setFormData(initialFormData)
                fetchBinList(binSkip, binTake)
                setTimeout(() => {
                    setOpen(false)
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

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-2xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Create New Bin</DialogTitle>
                    <DialogDescription>Add a new bin to the tenant.</DialogDescription>
                </DialogHeader>

                <form id="bin-create-form" onSubmit={handleSubmit}>
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
                                    <FieldLabel className="text-xs font-medium">Bin Name <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='binName' placeholder="e.g. Main Warehouse" required onChange={handleChange} value={formData.binName} className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                                    <FieldLabel className="text-xs font-medium">Description</FieldLabel>
                                    <div className="min-w-0">
                                        <Textarea name='description' placeholder="Optional description" onChange={handleChange} value={formData.description} className="min-h-[48px] rounded-none px-2 py-1 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                                    <FieldLabel className="text-xs font-medium">Active</FieldLabel>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id="isActive"
                                            checked={formData.isActive}
                                            onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isActive: checked }))}
                                        />
                                        <span className="text-sm text-muted-foreground">
                                            {formData.isActive ? "Yes" : "No"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={() => setOpen(false)} variant="outline" disabled={loading}>Cancel</Button>
                    <Button form="bin-create-form" type="submit" disabled={loading}>
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Creating....</span>}
                        Create Bin
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
