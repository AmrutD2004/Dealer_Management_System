import { createHSN } from "@/api/endpoints"
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
import type { HSNCreateType } from "@/Types/hsnMasterType"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface CreateHSNModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    onCreated?: () => void
}

const initialFormData: HSNCreateType = {
    hsnCode: "",
    description: "",
    taxRate: "",
}

export function CreateHSNModal({ open, setOpen, onCreated }: CreateHSNModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState<HSNCreateType>(initialFormData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
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
            const data = await createHSN(payload)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                setFormData(initialFormData)
                onCreated?.()
                setTimeout(() => {
                    setOpen(false)
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

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Create New HSN</DialogTitle>
                    <DialogDescription>Add a new HSN code to the tenant.</DialogDescription>
                </DialogHeader>

                <form id="hsn-create-form" onSubmit={handleSubmit}>
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
                    <Button type="button" onClick={() => setOpen(false)} variant="outline" disabled={loading}>Cancel</Button>
                    <Button  form="hsn-create-form" type="submit" disabled={loading} >
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Creating....</span>}
                        Create HSN
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
