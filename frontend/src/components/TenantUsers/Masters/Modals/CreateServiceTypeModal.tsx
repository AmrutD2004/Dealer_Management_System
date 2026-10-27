import { createServiceType, getServiceCategoryList } from "@/api/endpoints"
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
import { toast } from "@/components/ui/toast"
import type { serviceCategoryListType } from "@/Types/tenantCreateType"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface CreateServiceTypeModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    onCreated?: () => void
}

const initialFormData = {
    serviceCategoryId: "",
    code: "",
    name: "",
    description: "",
}

export function CreateServiceTypeModal({ open, setOpen, onCreated }: CreateServiceTypeModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [categoryList, setCategoryList] = useState<serviceCategoryListType[]>([])
    const [formData, setFormData] = useState(initialFormData)

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await getServiceCategoryList()
                if (data?.success) {
                    setCategoryList(data?.data)
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

    const categoryItems = categoryList.map((category: serviceCategoryListType) => ({
        value: String(category.id),
        label: category.name,
    }))

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
                serviceCategoryId: Number(formData.serviceCategoryId),
            }
            const data = await createServiceType(payload)
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
                    <DialogTitle>Create New Service Type</DialogTitle>
                    <DialogDescription>Add a new service type to the tenant.</DialogDescription>
                </DialogHeader>

                <form id="service-type-form" onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Type Details</h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Field>
                                    <FieldLabel>Service Category <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={categoryItems}
                                            value={formData.serviceCategoryId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, serviceCategoryId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {categoryList.map((category: serviceCategoryListType) => (
                                                    <SelectItem key={category.id} value={String(category.id)}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Type Code <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='code' placeholder="e.g. ST001" required onChange={handleChange} value={formData.code} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Type Name <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='name' placeholder="e.g. Engine Oil Change" required onChange={handleChange} value={formData.name} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Description</FieldLabel>
                                    <FieldContent>
                                        <Input name='description' placeholder="Details about this service type" onChange={handleChange} value={formData.description} />
                                    </FieldContent>
                                </Field>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={() => setOpen(false)} variant="outline">Cancel</Button>
                    <Button form="service-type-form" type="submit" disabled={loading}>
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating....</span>}
                        Create Type
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}