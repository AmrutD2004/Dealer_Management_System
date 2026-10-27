import { editModel, getBrandListWithoutPagination } from "@/api/endpoints"
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
import type { ModelCreateType, ModelListType } from "@/Types/modelMasterType"
import { Car, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { carBodyTypeOptions } from "../bodyTypeOptions"

interface EditModelModalProps {
    model: ModelListType | null
    open: boolean
    onClose: () => void
    onUpdated?: () => void
}

export function EditModelModal({ model, open, onClose, onUpdated }: EditModelModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [brands, setBrands] = useState<BrandListType[]>([])
    const [formData, setFormData] = useState<ModelCreateType>({
        brandId: model ? String(model.brandId) : "",
        modelCode: model?.modelCode ?? "",
        modelName: model?.modelName ?? "",
        bodyType: model?.bodyType ?? "",
    })

    useEffect(() => {
        const loadBrands = async () => {
            try {
                const data = await getBrandListWithoutPagination()
                if (data?.success) {
                    setBrands(data?.data ?? [])
                }
            } catch (err: unknown) {
                const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                toast.add({
                    type: 'error',
                    description: message
                })
            }
        }
        loadBrands()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!model) return
        if (!formData.brandId || !formData.bodyType) {
            toast.add({
                type: 'error',
                description: 'Please select a brand and body type'
            })
            return
        }
        setLoading(true)
        try {
            const payload = {
                brandId: formData.brandId,
                modelCode: formData.modelCode,
                modelName: formData.modelName,
                bodyType: formData.bodyType,
            }
            const data = await editModel(payload, model.id)
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

    if (!model) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Car className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle>Edit Model</DialogTitle>
                            <DialogDescription>
                                Update the model information. All required fields must be filled.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form id="model-edit-form" onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Model Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Brand <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={brands.map(brand => ({ value: String(brand.id), label: `${brand.brandName} - ${brand.brandCode}` }))}
                                            value={formData.brandId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, brandId: value ?? "" }))}
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
                                    <FieldLabel className="text-xs font-medium">Body Type <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={carBodyTypeOptions}
                                            value={formData.bodyType || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, bodyType: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select body type" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {carBodyTypeOptions.map((option) => (
                                                    <SelectItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Model Code <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='modelCode'
                                            type='text'
                                            placeholder="e.g. CITY"
                                            required
                                            onChange={handleChange}
                                            value={formData.modelCode}
                                            className="h-7 rounded-none px-2 text-xs"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Model Name <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='modelName'
                                            type='text'
                                            placeholder="e.g. Honda City"
                                            required
                                            onChange={handleChange}
                                            value={formData.modelName}
                                            className="h-7 rounded-none px-2 text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button onClick={onClose} variant="outline" size="sm" className="h-7 px-3 text-xs" disabled={loading}>Cancel</Button>
                    <Button form="model-edit-form" type="submit" disabled={loading} size="sm" className="h-7 px-3 text-xs">
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Saving....</span>}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
