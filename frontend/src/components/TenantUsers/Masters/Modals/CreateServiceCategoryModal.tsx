import { createServiceCategory } from "@/api/endpoints"
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

interface CreateServiceCategoryModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    onCreated?: () => void
}

const categoryCodeOptions = [
    { value: "PDI", label: "PDI" },
    { value: "WARRANTY", label: "Warranty" },
    { value: "EXTENDED_WARRANTY", label: "Extended Warranty" },
    { value: "POST_WARRANTY", label: "Post Warranty" },
    { value: "ACCIDENT", label: "Accident" },
    // { value: "IN_TRANSIT", label: "In Transit" },
]

const categoryCodeItems = categoryCodeOptions.map((option) => ({
    value: option.value,
    label: option.label,
}))

const initialFormData = {
    code: "",
    name: "",
    description: "",
}

const getCategoryName = (code: string) => {
    switch (code) {
        case "PDI":
            return "Pre Delivery Inspection"
        case "WARRANTY":
            return "Warranty"
        case "EXTENDED_WARRANTY":
            return "Extended Warranty"
        case "POST_WARRANTY":
            return "Post Warranty"
        case "ACCIDENT":
            return "Accident"
        case "IN_TRANSIT":
            return "In Transit"
        default:
            return ""
    }
}

export function CreateServiceCategoryModal({ open, setOpen, onCreated }: CreateServiceCategoryModalProps) {
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
            const data = await createServiceCategory(payload)
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
                description: (err as any)?.response?.data?.message
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Create New Service Category</DialogTitle>
                    <DialogDescription>Add a new service category to the tenant.</DialogDescription>
                </DialogHeader>

                <form id="service-category-form" onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Category Details</h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Field>
                                    <FieldLabel>Category Code <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={categoryCodeItems}
                                            value={formData.code || null}
                                            onValueChange={(value) => setFormData(prev => ({
                                                ...prev,
                                                code: value ?? "",
                                                name: getCategoryName(value ?? ""),
                                            }))}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a category code" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {categoryCodeOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Category Name <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='name' placeholder="Select a category code to auto-fill" readOnly value={formData.name} />
                                    </FieldContent>
                                </Field>
                                <Field className="sm:col-span-2 lg:col-span-3">
                                    <FieldLabel>Description</FieldLabel>
                                    <FieldContent>
                                        <Textarea name='description' placeholder="Details about this service category" onChange={handleChange} value={formData.description} />
                                    </FieldContent>
                                </Field>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={() => setOpen(false)} variant="outline">Cancel</Button>
                    <Button form="service-category-form" type="submit" disabled={loading}>
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating....</span>}
                        Create Category
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}