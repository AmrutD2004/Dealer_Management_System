import { editHSN } from "@/api/endpoints"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import type { HSNCreateType, HSNMasterType } from "@/Types/hsnMasterType"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface EditHSNModalProps {
    hsn: HSNMasterType | null
    open: boolean
    onClose: () => void
    onUpdated?: () => void
}

export function EditHSNModal({ hsn, open, onClose, onUpdated }: EditHSNModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState<HSNCreateType>({
        hsnCode: hsn?.hsnCode ?? "",
        description: hsn?.description ?? "",
        taxRate: hsn?.taxRate ?? "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!hsn) return
        if (!formData.hsnCode.trim()) {
            toast.add({
                type: 'error',
                description: 'HSN code is required'
            })
            return
        }
        if (formData.taxRate.trim() && (Number(formData.taxRate) < 0 || Number(formData.taxRate) > 100)) {
            toast.add({
                type: 'error',
                description: 'Tax rate must be between 0 and 100'
            })
            return
        }
        setLoading(true)
        try {
            const payload = {
                hsnCode: formData.hsnCode.trim(),
                description: formData.description.trim() || null,
                taxRate: formData.taxRate.trim() || null,
            }
            const data = await editHSN(payload, hsn.id)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                onUpdated?.()
                setTimeout(() => {
                    onClose()
                }, 2000)
            }
            if (!data?.success) {
                toast.add({
                    type: 'error',
                    description: data?.message
                })
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            })
        } finally {
            setLoading(false)
        }
    }

    if (!hsn) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Edit HSN</DialogTitle>
                    <DialogDescription>Update the HSN code details.</DialogDescription>
                </DialogHeader>

                <form id="hsn-edit-form" onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">HSN Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">HSN Code <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='hsnCode'
                                            placeholder="e.g. 8708"
                                            required
                                            onChange={handleChange}
                                            value={formData.hsnCode}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Tax Rate (%)</FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='taxRate'
                                            type='number'
                                            step='0.01'
                                            min='0'
                                            max='100'
                                            placeholder="e.g. 18"
                                            onChange={handleChange}
                                            value={formData.taxRate}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                                    <FieldLabel className="text-xs font-medium">Description</FieldLabel>
                                    <div className="min-w-0">
                                        <Textarea
                                            name='description'
                                            placeholder="Description of the HSN code"
                                            onChange={handleChange}
                                            value={formData.description}
                                         className="min-h-[48px] rounded-none px-2 py-1 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button  type="button" onClick={onClose} variant="outline" disabled={loading} >Cancel</Button>
                    <Button  form="hsn-edit-form" type="submit" disabled={loading} >
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Saving....</span>}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
