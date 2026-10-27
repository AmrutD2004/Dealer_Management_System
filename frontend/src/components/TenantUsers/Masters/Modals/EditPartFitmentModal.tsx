import { editPartFitment, getBrandListWithoutPagination, getModelListWithoutPagination, getPartMasterList, getVariantListWithoutPagination } from "@/api/endpoints"
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
import { toast } from "@/components/ui/toast"
import type { BrandListType } from "@/Types/brandMasterType"
import type { ModelListType } from "@/Types/modelMasterType"
import type { PartFitmentCreateType, PartFitmentListType } from "@/Types/partFitmentType"
import type { PartMasterListType } from "@/Types/partMasterType"
import type { VariantListType } from "@/Types/variantMasterType"
import dayjs from "dayjs"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface EditPartFitmentModalProps {
    fitment: PartFitmentListType | null
    open: boolean
    onClose: () => void
    onUpdated?: () => void
}

export function EditPartFitmentModal({ fitment, open, onClose, onUpdated }: EditPartFitmentModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [brands, setBrands] = useState<BrandListType[]>([])
    const [models, setModels] = useState<ModelListType[]>([])
    const [variants, setVariants] = useState<VariantListType[]>([])
    const [parts, setParts] = useState<PartMasterListType[]>([])
    const [formData, setFormData] = useState<PartFitmentCreateType>({
        brandId: fitment?.brandId ? String(fitment.brandId) : "",
        modelId: fitment?.modelId ? String(fitment.modelId) : "",
        variantId: fitment?.variantId ? String(fitment.variantId) : "",
        partId: fitment?.partId ? String(fitment.partId) : "",
        position: fitment?.position ?? "",
        quantity: fitment?.quantity ? String(fitment.quantity) : "1",
        isOem: fitment?.isOem ?? true,
        validFrom: fitment?.validFrom ? dayjs(fitment.validFrom).format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        validTo: fitment?.validTo ? dayjs(fitment.validTo).format('YYYY-MM-DD') : "",
    })

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [brandData, modelData, variantData, partData] = await Promise.all([
                    getBrandListWithoutPagination(),
                    getModelListWithoutPagination(),
                    getVariantListWithoutPagination(),
                    getPartMasterList(),
                ])
                if (brandData?.success) {
                    setBrands(brandData?.data ?? [])
                }
                if (modelData?.success) {
                    setModels(modelData?.data ?? [])
                }
                if (variantData?.success) {
                    setVariants(variantData?.data ?? [])
                }
                if (partData?.success) {
                    setParts(partData?.data ?? [])
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const selectedBrandId = formData.brandId ? Number(formData.brandId) : null
    const selectedModelId = formData.modelId ? Number(formData.modelId) : null

    const modelItems = models
        .filter((model) => selectedBrandId === null || model.brandId === selectedBrandId)
        .map((model) => ({
            value: String(model.id),
            label: `${model.modelName} - ${model.modelCode}`,
        }))

    const variantItems = variants
        .filter((variant) => selectedModelId === null || variant.modelId === selectedModelId)
        .map((variant) => ({
            value: String(variant.id),
            label: `${variant.variantName} - ${variant.variantCode}`,
        }))

    const partItems = parts.map((part) => ({
        value: String(part.id),
        label: `${part.partNo} - ${part.partDescription}`,
    }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!fitment) return
        if (!formData.brandId || !formData.modelId || !formData.variantId || !formData.partId) {
            toast.add({
                type: 'error',
                description: 'Please select brand, model, variant and part'
            })
            return
        }
        if (!formData.quantity || Number(formData.quantity) <= 0) {
            toast.add({
                type: 'error',
                description: 'Quantity must be greater than 0'
            })
            return
        }
        if (formData.validTo && dayjs(formData.validTo).isBefore(dayjs(formData.validFrom), 'day')) {
            toast.add({
                type: 'error',
                description: 'Valid To date cannot be before Valid From date'
            })
            return
        }
        setLoading(true)
        try {
            const payload = {
                brandId: Number(formData.brandId),
                modelId: Number(formData.modelId),
                variantId: Number(formData.variantId),
                partId: Number(formData.partId),
                position: formData.position.trim() || null,
                quantity: Number(formData.quantity),
                isOem: formData.isOem,
                validFrom: new Date(formData.validFrom).toISOString(),
                validTo: formData.validTo ? new Date(formData.validTo).toISOString() : null,
            }
            const data = await editPartFitment(payload, fitment.id)
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

    if (!fitment) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Edit Part Fitment</DialogTitle>
                    <DialogDescription>Update the vehicle compatibility for this part.</DialogDescription>
                </DialogHeader>

                <form id="part-fitment-edit-form" onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Vehicle Compatibility</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Brand <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={brands.map((brand) => ({ value: String(brand.id), label: `${brand.brandName} - ${brand.brandCode}` }))}
                                            value={formData.brandId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, brandId: value ?? "", modelId: "", variantId: "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select brand" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {brands.map((brand) => (
                                                    <SelectItem key={brand.id} value={String(brand.id)}>
                                                        {brand.brandName} - {brand.brandCode}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Model <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={modelItems}
                                            value={formData.modelId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, modelId: value ?? "", variantId: "" }))}
                                            disabled={!formData.brandId}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder={formData.brandId ? "Select model" : "Select brand first"} />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {modelItems.map((item) => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Variant <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={variantItems}
                                            value={formData.variantId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, variantId: value ?? "" }))}
                                            disabled={!formData.modelId}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder={formData.modelId ? "Select variant" : "Select model first"} />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {variantItems.map((item) => (
                                                    <SelectItem key={item.value} value={item.value}>
                                                        {item.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Part <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={partItems}
                                            value={formData.partId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, partId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select part" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {partItems.map((item) => (
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

                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Fitment Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Position</FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='position'
                                            placeholder="e.g. Front Left"
                                            onChange={handleChange}
                                            value={formData.position}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Quantity <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='quantity'
                                            type='number'
                                            step='0.01'
                                            min='0.01'
                                            placeholder="e.g. 1"
                                            required
                                            onChange={handleChange}
                                            value={formData.quantity}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">OEM Part</FieldLabel>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="edit-part-fitment-is-oem"
                                                checked={formData.isOem}
                                                onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isOem: checked }))}
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                {formData.isOem ? "Yes" : "No"}
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
                                    <FieldLabel className="text-xs font-medium">Valid To</FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='validTo'
                                            type='date'
                                            onChange={handleChange}
                                            value={formData.validTo}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button size="sm" type="button" onClick={onClose} variant="outline" disabled={loading} className="h-7 px-3 text-xs">Cancel</Button>
                    <Button size="sm" form="part-fitment-edit-form" type="submit" disabled={loading} className="h-7 px-3 text-xs">
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Saving....</span>}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
