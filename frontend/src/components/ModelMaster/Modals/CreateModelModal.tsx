import { createModel, getBrandListWithoutPagination } from "@/api/endpoints"
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
import type { ModelCreateType } from "@/Types/modelMasterType"
import { cn } from "cn"
import { Car, Loader2, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { carBodyTypeOptions } from "../bodyTypeOptions"

interface CreateModelModalProps {
    onCreated?: () => void
}

const initialFormData: ModelCreateType = {
    brandId: "",
    modelCode: "",
    modelName: "",
    bodyType: "",
}

export function CreateModelModal({ onCreated }: CreateModelModalProps) {
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [brands, setBrands] = useState<BrandListType[]>([])
    const [formData, setFormData] = useState<ModelCreateType>(initialFormData)

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
            const data = await createModel(payload)
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
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            toast.add({
                type: 'error',
                description: message
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open}>
            <Button onClick={() => setOpen(true)} className={cn('flex items-center gap-2 shadow')}>
                <Plus /> Create Model
            </Button>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Car className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle>Create Model</DialogTitle>
                            <DialogDescription>
                                Add a new vehicle model to the DMS platform.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form id="model-create-form" onSubmit={handleSubmit}>
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
                    <Button onClick={() => setOpen(false)} variant="outline" size="sm" className="h-7 px-3 text-xs">Cancel</Button>
                    <Button form="model-create-form" type="submit" disabled={loading} size="sm" className="h-7 px-3 text-xs">
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Creating....</span>}
                        Create Model
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
