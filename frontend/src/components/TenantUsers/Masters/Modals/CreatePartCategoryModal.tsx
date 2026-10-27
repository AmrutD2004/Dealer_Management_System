import { createPartCategory, getPartCategoryList } from "@/api/endpoints"
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
import { toast } from "@/components/ui/toast"
import type { PartCategoryCreateType, PartCategoryListType } from "@/Types/partCategoryType"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface CreatePartCategoryModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    onCreated?: () => void
}

const initialFormData: PartCategoryCreateType = {
    code: "",
    name: "",
    parentId: "none",
}

export function CreatePartCategoryModal({ open, setOpen, onCreated }: CreatePartCategoryModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [categories, setCategories] = useState<PartCategoryListType[]>([])
    const [formData, setFormData] = useState<PartCategoryCreateType>(initialFormData)

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getPartCategoryList()
                if (data?.success) {
                    setCategories(data?.data ?? [])
                }
            } catch (err: unknown) {
                toast.add({
                    type: 'error',
                    description: (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                })
            }
        }
        if (open) loadCategories()
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const parentItems = [
        { value: "none", label: "None (Top Level)" },
        ...categories.map((category) => ({
            value: String(category.id),
            label: `${category.code} - ${category.name}${category.isActive ? "" : " (Inactive)"}`,
        })),
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.code.trim() || !formData.name.trim()) {
            toast.add({
                type: 'error',
                description: 'Category code and name are required'
            })
            return
        }
        setLoading(true)
        try {
            const payload = {
                code: formData.code.trim(),
                name: formData.name.trim(),
                parentId: formData.parentId && formData.parentId !== "none" ? Number(formData.parentId) : null,
            }
            const data = await createPartCategory(payload)
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
                    <DialogTitle>Create New Part Category</DialogTitle>
                    <DialogDescription>Add a new part category to the tenant.</DialogDescription>
                </DialogHeader>

                <form id="part-category-form" onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Category Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Category Code <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='code'
                                            placeholder="e.g. ENGINE"
                                            required
                                            onChange={handleChange}
                                            value={formData.code}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Category Name <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='name'
                                            placeholder="e.g. Engine Parts"
                                            required
                                            onChange={handleChange}
                                            value={formData.name}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Parent Category</FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={parentItems}
                                            value={formData.parentId || "none"}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value ?? "none" }))}
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select parent category" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {parentItems.map((item) => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={() => setOpen(false)} variant="outline" disabled={loading}>Cancel</Button>
                    <Button size="sm" form="part-category-form" type="submit" disabled={loading} className="h-7 px-3 text-xs">
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Creating....</span>}
                        Create Category
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
