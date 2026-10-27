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
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
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
                // setTimeout(() => {
                //     setOpen(false)
                // }, 2000)
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
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-2xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Create New HSN</DialogTitle>
                    <DialogDescription>Add a new HSN code to the tenant.</DialogDescription>
                </DialogHeader>

                <form id="hsn-create-form" onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">HSN Details</h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Field>
                                    <FieldLabel>HSN Code <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input
                                            name='hsnCode'
                                            placeholder="e.g. 8708"
                                            required
                                            onChange={handleChange}
                                            value={formData.hsnCode}
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Tax Rate (%)</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            name='taxRate'
                                            type='number'
                                            step='0.01'
                                            min='0'
                                            max='100'
                                            placeholder="e.g. 18"
                                            onChange={handleChange}
                                            value={formData.taxRate}
                                        />
                                    </FieldContent>
                                </Field>
                                <Field className="sm:col-span-2 lg:col-span-3">
                                    <FieldLabel>Description</FieldLabel>
                                    <FieldContent>
                                        <Textarea
                                            name='description'
                                            placeholder="Description of the HSN code"
                                            onChange={handleChange}
                                            value={formData.description}
                                        />
                                    </FieldContent>
                                </Field>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={() => setOpen(false)} variant="outline" disabled={loading}>Cancel</Button>
                    <Button form="hsn-create-form" type="submit" disabled={loading}>
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating....</span>}
                        Create HSN
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
