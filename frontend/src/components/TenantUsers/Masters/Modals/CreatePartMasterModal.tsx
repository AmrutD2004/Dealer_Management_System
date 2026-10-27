import { createPartMaster, getHSNList, getPartCategoryList, getBrandListWithoutPagination, getModelListWithoutPagination, getVariantListWithoutPagination } from "@/api/endpoints"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import type { PartCategoryListType } from "@/Types/partCategoryType"
import type { PartMasterCreateType, PartMasterHSNType } from "@/Types/partMasterType"
import dayjs from "dayjs"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { partUnitOptions } from "../PartMaster/partOptions"
import type { vehicleBrand } from "@/Types/vehicleBrand"
import type { vehicleModel } from "@/Types/vehicleModel"
import type { vehicleVariant } from "@/Types/vehicleVariants"

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
    brandId: "",
    modelId: "",
    variantId: "",
    isOem: false,
    position: "",
    quantity: "",
    fitmentValidFrom: dayjs().format('YYYY-MM-DD'),
    fitmentValidTo: "",
}

export function CreatePartMasterModal({ open, setOpen, onCreated }: CreatePartMasterModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [categories, setCategories] = useState<PartCategoryListType[]>([])
    const [hsnList, setHsnList] = useState<PartMasterHSNType[]>([])
    const [brands, setBrands] = useState<vehicleBrand[]>([])
    const [models, setModels] = useState<vehicleModel[]>([])
    const [variants, setVariants] = useState<vehicleVariant[]>([])
    const [formData, setFormData] = useState<PartMasterCreateType>(initialFormData)

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [categoryData, hsnData, brandData, modelData, variantData] = await Promise.all([
                    getPartCategoryList(),
                    getHSNList(),
                    getBrandListWithoutPagination(),
                    getModelListWithoutPagination(),
                    getVariantListWithoutPagination(),
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
        if (!formData.brandId || !formData.modelId || !formData.variantId) {
            toast.add({
                type: 'error',
                description: 'Please select Brand, Model and Variant for fitment'
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
        if (formData.fitmentValidTo && dayjs(formData.fitmentValidTo).isBefore(dayjs(formData.fitmentValidFrom), 'day')) {
            toast.add({
                type: 'error',
                description: 'Fitment Valid To date cannot be before Fitment Valid From date'
            })
            return
        }
        setLoading(true)
        try {
            const payload: any = {
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
                brandId: Number(formData.brandId),
                modelId: Number(formData.modelId),
                variantId: Number(formData.variantId),
                isOem: formData.isOem,
                position: formData.position || null,
                quantity: formData.quantity ? Number(formData.quantity) : null,
                fitmentValidFrom: formData.fitmentValidFrom ? new Date(formData.fitmentValidFrom).toISOString() : new Date(formData.validFrom).toISOString(),
                fitmentValidTo: formData.fitmentValidTo ? new Date(formData.fitmentValidTo).toISOString() : null,
            }
            const data = await createPartMaster(payload)
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
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-2xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Create New Part</DialogTitle>
                    <DialogDescription>Add a new part to the tenant.</DialogDescription>
                </DialogHeader>

                <form id="part-master-form" onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Part Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Part Number <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='partNo'
                                            placeholder="e.g. P-10001"
                                            required
                                            onChange={handleChange}
                                            value={formData.partNo}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Part Category</FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={categoryItems}
                                            value={formData.partCategoryId || "none"}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, partCategoryId: value ?? "none" }))}
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
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
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                                    <FieldLabel className="text-xs font-medium">Part Description <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Textarea
                                            name='partDescription'
                                            placeholder="Description of the part"
                                            required
                                            onChange={handleChange}
                                            value={formData.partDescription}
                                         className="min-h-[48px] rounded-none px-2 py-1 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">HSN Code <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={hsnItems}
                                            value={formData.hsnId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, hsnId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
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
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Unit of Measure <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={partUnitOptions}
                                            value={formData.unitOfMeasure || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, unitOfMeasure: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
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
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Selling Price <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='sellingPrice'
                                            type='number'
                                            step='0.01'
                                            min='0'
                                            placeholder="e.g. 1500.00"
                                            required
                                            onChange={handleChange}
                                            value={formData.sellingPrice}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Tax Rate (%) <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='taxRate'
                                            type='number'
                                            step='0.01'
                                            min='0'
                                            placeholder="e.g. 18"
                                            required
                                            onChange={handleChange}
                                            value={formData.taxRate}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Reorder Level</FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='reorderLevel'
                                            type='number'
                                            step='1'
                                            min='0'
                                            placeholder="e.g. 10"
                                            onChange={handleChange}
                                            value={formData.reorderLevel}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Fast Moving</FieldLabel>
                                    <div className="min-w-0">
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
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Valid From <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='validFrom'
                                            type='date'
                                            required
                                            onChange={handleChange}
                                            value={formData.validFrom}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Valid To <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='validTo'
                                            type='date'
                                            required
                                            onChange={handleChange}
                                            value={formData.validTo}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Fitment Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Brand <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select items={brands.map((b:any)=>({value:String(b.id),label:b.brandName}))} value={formData.brandId||null} onValueChange={(value)=>setFormData(prev=>({...prev,brandId:value??""}))} required>
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs"><SelectValue placeholder="Select brand" /></SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {brands.map((b:any)=>(<SelectItem key={b.id} value={String(b.id)}>{b.brandName}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Model <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select items={models.map((m:any)=>({value:String(m.id),label:m.modelName}))} value={formData.modelId||null} onValueChange={(value)=>setFormData(prev=>({...prev,modelId:value??""}))} required>
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs"><SelectValue placeholder="Select model" /></SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {models.map((m:any)=>(<SelectItem key={m.id} value={String(m.id)}>{m.modelName}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Variant <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select items={variants.map((v:any)=>({value:String(v.id),label:v.variantName}))} value={formData.variantId||null} onValueChange={(value)=>setFormData(prev=>({...prev,variantId:value??""}))} required>
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs"><SelectValue placeholder="Select variant" /></SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {variants.map((v:any)=>(<SelectItem key={v.id} value={String(v.id)}>{v.variantName}</SelectItem>))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">OEM</FieldLabel>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Switch id="fitment-is-oem" checked={formData.isOem} onCheckedChange={(checked:boolean)=>setFormData(prev=>({...prev,isOem:checked}))} />
                                            <span className="text-sm text-muted-foreground">{formData.isOem?"Yes":"No"}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Position</FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='position' placeholder="e.g. Front/Rear" onChange={handleChange} value={formData.position} className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Quantity</FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='quantity' type='number' min='0' placeholder="e.g. 1" onChange={handleChange} value={formData.quantity} className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Fitment Valid From</FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='fitmentValidFrom' type='date' onChange={handleChange} value={formData.fitmentValidFrom} className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Fitment Valid To</FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='fitmentValidTo' type='date' onChange={handleChange} value={formData.fitmentValidTo} className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={() => setOpen(false)} variant="outline" disabled={loading}>Cancel</Button>
                    <Button size="sm" form="part-master-form" type="submit" disabled={loading} className="h-7 px-3 text-xs">
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Creating....</span>}
                        Create Part
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
