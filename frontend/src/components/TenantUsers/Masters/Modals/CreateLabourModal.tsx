import { createLabour } from "@/api/endpoints"
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
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface CreateLabourModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    onCreated?: () => void
}

const initialFormData = {
    labourCode: "",
    labourName: "",
    labourDescription: "",
    rate: "",
    standardHours: "",
}

export function CreateLabourModal({ open, setOpen, onCreated }: CreateLabourModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState(initialFormData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const payload = {
                labourCode: formData.labourCode,
                labourName: formData.labourName,
                labourDescription: formData.labourDescription,
                rate: formData.rate,
                standardHours: formData.standardHours,
            }
            const data = await createLabour(payload)
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
                    <DialogTitle>Create New Labour</DialogTitle>
                    <DialogDescription>Add a new labour to the tenant.</DialogDescription>
                </DialogHeader>

                <form id="labour-form" onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Labour Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Labour Code <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='labourCode' placeholder="e.g. LAB001" required onChange={handleChange} value={formData.labourCode}  className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Labour Name <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='labourName' placeholder="e.g. Engine Oil Replacement" required onChange={handleChange} value={formData.labourName}  className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Rate <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='rate' type="number" step="0.01" placeholder="e.g. 500" required onChange={handleChange} value={formData.rate}  className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Standard Hours <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='standardHours' type="number" step="0.01" placeholder="e.g. 1.5" required onChange={handleChange} value={formData.standardHours}  className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                                    <FieldLabel className="text-xs font-medium">Description</FieldLabel>
                                    <div className="min-w-0">
                                        <Textarea name='labourDescription' placeholder="Details about this labour" onChange={handleChange} value={formData.labourDescription}  className="min-h-[48px] rounded-none px-2 py-1 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={() => setOpen(false)} variant="outline">Cancel</Button>
                    <Button  form="labour-form" type="submit" disabled={loading} >
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Creating....</span>}
                        Create Labour
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
