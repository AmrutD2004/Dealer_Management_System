import { editVariant, getBrandListWithoutPagination, getModelListWithoutPagination } from "@/api/endpoints"
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
import type { BrandListType } from "@/Types/brandMasterType"
import type { ModelListType } from "@/Types/modelMasterType"
import type { VariantCreateType, VariantListType } from "@/Types/variantMasterType"
import dayjs from "dayjs"
import { Layers, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { fuelTypeOptions, transmissionOptions } from "../variantOptions"

interface EditVariantModalProps {
    variant: VariantListType | null
    open: boolean
    onClose: () => void
    onUpdated?: () => void
}

export function EditVariantModal({ variant, open, onClose, onUpdated }: EditVariantModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [models, setModels] = useState<ModelListType[]>([])
    const [brands, setBrands] = useState<BrandListType[]>([])
    const [formData, setFormData] = useState<VariantCreateType>({
        modelId: variant ? String(variant.modelId) : "",
        variantCode: variant?.variantCode ?? "",
        variantName: variant?.variantName ?? "",
        fuelType: variant?.fuelType ?? "",
        transmissionType: variant?.transmissionType ?? "",
        productionFrom: variant?.productionFrom ? dayjs(variant.productionFrom).format('YYYY-MM-DD') : "",
        productionTo: variant?.productionTo ? dayjs(variant.productionTo).format('YYYY-MM-DD') : "",
    })

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [modelData, brandData] = await Promise.all([
                    getModelListWithoutPagination(),
                    getBrandListWithoutPagination(),
                ])
                if (modelData?.success) {
                    setModels(modelData?.data ?? [])
                }
                if (brandData?.success) {
                    setBrands(brandData?.data ?? [])
                }
            } catch (err: unknown) {
                const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                toast.add({
                    type: 'error',
                    description: message
                })
            }
        }
        loadOptions()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const getBrandName = (brandId: number) => {
        return brands.find(brand => brand.id === brandId)?.brandName ?? `#${brandId}`
    }

    const modelItems = models.map(model => ({
        value: String(model.id),
        label: `${getBrandName(model.brandId)} ${model.modelName} - ${model.modelCode}`,
    }))

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!variant) return
        if (!formData.modelId || !formData.fuelType || !formData.transmissionType || !formData.productionFrom) {
            toast.add({
                type: 'error',
                description: 'Please fill all required fields'
            })
            return
        }
        setLoading(true)
        try {
            const payload = {
                modelId: formData.modelId,
                variantCode: formData.variantCode,
                variantName: formData.variantName,
                fuelType: formData.fuelType,
                transmisstionType: formData.transmissionType,
                productionFrom: new Date(formData.productionFrom).toISOString(),
                productionTo: formData.productionTo ? new Date(formData.productionTo).toISOString() : null,
            }
            const data = await editVariant(payload, variant.id)
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
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            toast.add({
                type: 'error',
                description: message
            })
        } finally {
            setLoading(false)
        }
    }

    if (!variant) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Layers className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle>Edit Variant</DialogTitle>
                            <DialogDescription>
                                Update the variant information. All required fields must be filled.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form id="variant-edit-form" onSubmit={handleSubmit}>
                    <div className="space-y-6 py-1">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Variant Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Model <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={modelItems}
                                            value={formData.modelId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, modelId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select model" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {models.map((model) => (
                                                    <SelectItem key={model.id} value={String(model.id)}>
                                                        {getBrandName(model.brandId)} {model.modelName} - {model.modelCode}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Variant Code <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='variantCode'
                                            type='text'
                                            placeholder="e.g. VX"
                                            required
                                            onChange={handleChange}
                                            value={formData.variantCode}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Variant Name <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='variantName'
                                            type='text'
                                            placeholder="e.g. VX Petrol MT"
                                            required
                                            onChange={handleChange}
                                            value={formData.variantName}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Fuel Type <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={fuelTypeOptions}
                                            value={formData.fuelType || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, fuelType: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select fuel type" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {fuelTypeOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Transmission Type <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={transmissionOptions}
                                            value={formData.transmissionType || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, transmissionType: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select transmission" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {transmissionOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Production From <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='productionFrom'
                                            type='date'
                                            required
                                            onChange={handleChange}
                                            value={formData.productionFrom}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Production To</FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='productionTo'
                                            type='date'
                                            onChange={handleChange}
                                            value={formData.productionTo}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button  onClick={onClose} variant="outline" disabled={loading} >Cancel</Button>
                    <Button  form="variant-edit-form" type="submit" disabled={loading} >
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Saving....</span>}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
