import { createRepairOrder } from "@/api/endpoints"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface CreateRepairOrderModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    onCreated?: () => void
}

const repairOrderCodeOptions = [
    { value: "QUICK_REPAIR", label: "Quick Repair" },
    { value: "MINOR_MECHANICAL", label: "Minor Mechanical" },
    { value: "MAJOR_MECHANICAL", label: "Major Mechanical" },
    { value: "MINOR_ACCIDENTAL", label: "Minor Accidental" },
    { value: "MAJOR_ACCIDENTAL", label: "Major Accidental" },
    { value: "SCHEDULE_MAINTENANCE", label: "Schedule Maintenance" },
]

const repairOrderCodeItems = repairOrderCodeOptions.map((option) => ({
    value: option.value,
    label: option.label,
}))

const initialFormData = {
    code: "",
    name: "",
    description: "",
}

const getRepairOrderName = (code: string) => {
    switch (code) {
        case "QUICK_REPAIR":
            return "Quick Repair"
        case "MINOR_MECHANICAL":
            return "Minor Mechanical"
        case "MAJOR_MECHANICAL":
            return "Major Mechanical"
        case "MINOR_ACCIDENTAL":
            return "Minor Accidental"
        case "MAJOR_ACCIDENTAL":
            return "Major Accidental"
        case "SCHEDULE_MAINTENANCE":
            return "Schedule Maintenance"
        default:
            return ""
    }
}

export function CreateRepairOrderModal({ open, setOpen, onCreated }: CreateRepairOrderModalProps) {
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
                code: formData.code,
                name: formData.name,
                description: formData.description,
            }
            const data = await createRepairOrder(payload)
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
                    <DialogTitle>Create New Repair Order</DialogTitle>
                    <DialogDescription>Add a new repair order type to the tenant.</DialogDescription>
                </DialogHeader>

                <form id="repair-order-form" onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Repair Order Details</h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Field>
                                    <FieldLabel>Repair Order Code <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={repairOrderCodeItems}
                                            value={formData.code || null}
                                            onValueChange={(value) => setFormData(prev => ({
                                                ...prev,
                                                code: value ?? "",
                                                name: getRepairOrderName(value ?? ""),
                                            }))}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a repair order code" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {repairOrderCodeOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Repair Order Name <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='name' placeholder="Select a repair order code to auto-fill" readOnly value={formData.name} />
                                    </FieldContent>
                                </Field>
                                <Field className="sm:col-span-2 lg:col-span-3">
                                    <FieldLabel>Description</FieldLabel>
                                    <FieldContent>
                                        <Textarea name='description' placeholder="Details about this repair order" onChange={handleChange} value={formData.description} />
                                    </FieldContent>
                                </Field>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={() => setOpen(false)} variant="outline">Cancel</Button>
                    <Button form="repair-order-form" type="submit" disabled={loading}>
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating....</span>}
                        Create Repair Order
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}