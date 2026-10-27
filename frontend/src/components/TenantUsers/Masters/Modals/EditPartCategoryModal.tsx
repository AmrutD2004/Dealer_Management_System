import { editPartCategory, getPartCategoryList } from "@/api/endpoints"
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

interface EditPartCategoryModalProps {
    category: PartCategoryListType | null
    open: boolean
    onClose: () => void
    onUpdated?: () => void
}

export function EditPartCategoryModal({ category, open, onClose, onUpdated }: EditPartCategoryModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [categories, setCategories] = useState<PartCategoryListType[]>([])
    const [formData, setFormData] = useState<PartCategoryCreateType>({
        code: category?.code ?? "",
        name: category?.name ?? "",
        parentId: category?.parentId ? String(category.parentId) : "none",
    })

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

    const getDescendantIds = (categoryId: number) => {
        const descendants = new Set<number>()
        const collect = (parentId: number) => {
            categories.forEach((item) => {
                if (item.parentId === parentId && !descendants.has(item.id)) {
                    descendants.add(item.id)
                    collect(item.id)
                }
            })
        }
        collect(categoryId)
        return descendants
    }

    const descendantIds = category ? getDescendantIds(category.id) : new Set<number>()
    const selectableCategories = categories.filter((item) => item.id !== category?.id && !descendantIds.has(item.id))

    const parentItems = [
        { value: "none", label: "None (Top Level)" },
        ...selectableCategories.map((item) => ({
            value: String(item.id),
            label: `${item.code} - ${item.name}${item.isActive ? "" : " (Inactive)"}`,
        })),
    ]

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!category) return
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
            const data = await editPartCategory(payload, category.id)
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

    if (!category) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Edit Part Category</DialogTitle>
                    <DialogDescription>Update the part category details.</DialogDescription>
                </DialogHeader>

                <form id="part-category-edit-form" onSubmit={handleSubmit}>
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
                    <Button size="sm" type="button" onClick={onClose} variant="outline" disabled={loading} className="h-7 px-3 text-xs">Cancel</Button>
                    <Button size="sm" form="part-category-edit-form" type="submit" disabled={loading} className="h-7 px-3 text-xs">
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Saving....</span>}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
