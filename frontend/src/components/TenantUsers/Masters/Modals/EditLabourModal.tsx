import { editLabour } from "@/api/endpoints"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldContent } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import type { labourListType } from "@/Types/tenantCreateType"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface EditLabourModalProps {
    labour: labourListType | null
    open: boolean
    onClose: () => void
    onUpdated?: () => void
}

const initialFormData = {
    labourCode: "",
    labourName: "",
    labourDescription: "",
    rate: "",
    standardHours: "",
}

export function EditLabourModal({ labour, open, onClose, onUpdated }: EditLabourModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState(initialFormData)

    useEffect(() => {
        if (labour) {
            setFormData({
                labourCode: labour.labourCode ?? "",
                labourName: labour.labourName ?? "",
                labourDescription: labour.labourDescription ?? "",
                rate: String(labour.rate ?? ""),
                standardHours: String(labour.standardHours ?? ""),
            })
        }
    }, [labour])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        if (!labour) return
        try {
            const payload = {
                labourCode: formData.labourCode,
                labourName: formData.labourName,
                labourDescription: formData.labourDescription,
                rate: formData.rate,
                standardHours: formData.standardHours,
            }
            const data = await editLabour(payload, labour.id)
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

    if (!labour) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Edit Labour</DialogTitle>
                    <DialogDescription>Update the labour details.</DialogDescription>
                </DialogHeader>

                <form id="labour-edit-form" onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Labour Details</h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Field>
                                    <FieldLabel>Labour Code <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='labourCode' required onChange={handleChange} value={formData.labourCode} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Labour Name <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='labourName' placeholder="e.g. Engine Oil Replacement" required onChange={handleChange} value={formData.labourName} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Rate <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='rate' type="number" step="0.01" placeholder="e.g. 500" required onChange={handleChange} value={formData.rate} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Standard Hours <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='standardHours' type="number" step="0.01" placeholder="e.g. 1.5" required onChange={handleChange} value={formData.standardHours} />
                                    </FieldContent>
                                </Field>
                                <Field className="sm:col-span-2 lg:col-span-3">
                                    <FieldLabel>Description</FieldLabel>
                                    <FieldContent>
                                        <Textarea name='labourDescription' placeholder="Details about this labour" onChange={handleChange} value={formData.labourDescription} />
                                    </FieldContent>
                                </Field>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
                    <Button form="labour-edit-form" type="submit" disabled={loading}>
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving....</span>}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
