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
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Category Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Category Code <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
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
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
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
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Category Name <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='name' placeholder="Select a category code to auto-fill" readOnly value={formData.name}  className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                                    <FieldLabel className="text-xs font-medium">Description</FieldLabel>
                                    <div className="min-w-0">
                                        <Textarea name='description' placeholder="Details about this service category" onChange={handleChange} value={formData.description}  className="min-h-[48px] rounded-none px-2 py-1 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={() => setOpen(false)} variant="outline">Cancel</Button>
                    <Button size="sm" form="service-category-form" type="submit" disabled={loading} className="h-7 px-3 text-xs">
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Creating....</span>}
                        Create Category
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}