import { createPartMaster, getHSNList, getPartCategoryList } from "@/api/endpoints"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import type { PartCategoryListType } from "@/Types/partCategoryType"
import type { PartMasterCreateType, PartMasterHSNType } from "@/Types/partMasterType"
import dayjs from "dayjs"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { partUnitOptions } from "../PartMaster/partOptions"

interface CreatePartMasterModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    onCreated?: () => void
}

const initialFormData: PartMasterCreateType = {
    partNo: "",
    partDescription: "",
    partCategoryId: "none",
    hsnId: "",
    sellingPrice: "",
    taxRate: "",
    unitOfMeasure: "",
    reorderLevel: "",
    isFastMoving: false,
    validFrom: dayjs().format('YYYY-MM-DD'),
    validTo: "",
}

export function CreatePartMasterModal({ open, setOpen, onCreated }: CreatePartMasterModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [categories, setCategories] = useState<PartCategoryListType[]>([])
    const [hsnList, setHsnList] = useState<PartMasterHSNType[]>([])
    const [formData, setFormData] = useState<PartMasterCreateType>(initialFormData)

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [categoryData, hsnData] = await Promise.all([
                    getPartCategoryList(),
                    getHSNList(),
                ])
                if (categoryData?.success) {
                    setCategories(categoryData?.data ?? [])
                }
                if (hsnData?.success) {
                    setHsnList(hsnData?.data ?? [])
                }
            } catch (err: unknown) {
                toast.add({
                    type: 'error',
                    description: (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                })
            }
        }
        if (open) loadOptions()
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const categoryItems = [
        { value: "none", label: "None (Uncategorized)" },
        ...categories.map((category) => ({
            value: String(category.id),
            label: `${category.code} - ${category.name}${category.isActive ? "" : " (Inactive)"}`,
        })),
    ]

    const hsnItems = hsnList.map((hsn) => ({
        value: String(hsn.id),
        label: `${hsn.hsnCode}${hsn.description ? ` - ${hsn.description}` : ""}${hsn.taxRate ? ` (${hsn.taxRate}%)` : ""}`,
    }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.hsnId || !formData.unitOfMeasure) {
            toast.add({
                type: 'error',
                description: 'Please select an HSN code and unit of measure'
            })
            return
        }
        if (dayjs(formData.validTo).isBefore(dayjs(formData.validFrom), 'day')) {
            toast.add({
                type: 'error',
                description: 'Valid To date cannot be before Valid From date'
            })
            return
        }
        setLoading(true)
        try {
            const payload = {
                partNo: formData.partNo.trim(),
                partDescription: formData.partDescription.trim(),
                partCategoryId: formData.partCategoryId && formData.partCategoryId !== "none" ? Number(formData.partCategoryId) : null,
                hsnId: Number(formData.hsnId),
                sellingPrice: formData.sellingPrice,
                taxRate: formData.taxRate,
                unitOfMeasure: formData.unitOfMeasure,
                reorderLevel: formData.reorderLevel ? Number(formData.reorderLevel) : null,
                isFastMoving: formData.isFastMoving,
                validFrom: new Date(formData.validFrom).toISOString(),
                validTo: new Date(formData.validTo).toISOString(),
            }
            const data = await createPartMaster(payload)
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
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-4xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Create New Part</DialogTitle>
                    <DialogDescription>Add a new part to the tenant.</DialogDescription>
                </DialogHeader>

                <form id="part-master-form" onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Part Details</h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Field>
                                    <FieldLabel>Part Number <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input
                                            name='partNo'
                                            placeholder="e.g. P-10001"
                                            required
                                            onChange={handleChange}
                                            value={formData.partNo}
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Part Category</FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={categoryItems}
                                            value={formData.partCategoryId || "none"}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, partCategoryId: value ?? "none" }))}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select part category" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {categoryItems.map((item) => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field className="sm:col-span-2 lg:col-span-3">
                                    <FieldLabel>Part Description <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Textarea
                                            name='partDescription'
                                            placeholder="Description of the part"
                                            required
                                            onChange={handleChange}
                                            value={formData.partDescription}
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>HSN Code <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={hsnItems}
                                            value={formData.hsnId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, hsnId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select HSN code" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {hsnList.map((hsn) => (
                                                    <SelectItem key={hsn.id} value={String(hsn.id)}>
                                                        {hsn.hsnCode}{hsn.description ? ` - ${hsn.description}` : ""}{hsn.taxRate ? ` (${hsn.taxRate}%)` : ""}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Unit of Measure <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={partUnitOptions}
                                            value={formData.unitOfMeasure || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, unitOfMeasure: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select unit" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {partUnitOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Selling Price <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input
                                            name='sellingPrice'
                                            type='number'
                                            step='0.01'
                                            min='0'
                                            placeholder="e.g. 1500.00"
                                            required
                                            onChange={handleChange}
                                            value={formData.sellingPrice}
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Tax Rate (%) <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input
                                            name='taxRate'
                                            type='number'
                                            step='0.01'
                                            min='0'
                                            placeholder="e.g. 18"
                                            required
                                            onChange={handleChange}
                                            value={formData.taxRate}
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Reorder Level</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            name='reorderLevel'
                                            type='number'
                                            step='1'
                                            min='0'
                                            placeholder="e.g. 10"
                                            onChange={handleChange}
                                            value={formData.reorderLevel}
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Fast Moving</FieldLabel>
                                    <FieldContent>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="part-is-fast-moving"
                                                checked={formData.isFastMoving}
                                                onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isFastMoving: checked }))}
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                {formData.isFastMoving ? "Yes" : "No"}
                                            </span>
                                        </div>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Valid From <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input
                                            name='validFrom'
                                            type='date'
                                            required
                                            onChange={handleChange}
                                            value={formData.validFrom}
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Valid To <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input
                                            name='validTo'
                                            type='date'
                                            required
                                            onChange={handleChange}
                                            value={formData.validTo}
                                        />
                                    </FieldContent>
                                </Field>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={() => setOpen(false)} variant="outline" disabled={loading}>Cancel</Button>
                    <Button form="part-master-form" type="submit" disabled={loading}>
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating....</span>}
                        Create Part
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
