import { createVehicle, getBrandListWithoutPagination, getCustomerList, getModelListWithoutPagination, getVariantListWithoutPagination } from "@/api/endpoints"
import { Button } from "@/components/ui/button"
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
import type { customerListType } from "@/Types/tenantCreateType"
import type { vehicleBrand } from "@/Types/vehicleBrand"
import type { vehicleModel } from "@/Types/vehicleModel"
import type { vehicleVariant } from "@/Types/vehicleVariants"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface VehicleCreateFormProps {
    onCancel: () => void
    onCreated?: () => void
}

const fuelTypeOptions = [
    { value: "Petrol", label: "Petrol" },
    { value: "Diesel", label: "Diesel" },
    { value: "CNG", label: "CNG" },
    { value: "Electric", label: "Electric" },
    { value: "Hybrid", label: "Hybrid" },
]

const transmissionOptions = [
    { value: "Manual", label: "Manual" },
    { value: "Automatic", label: "Automatic" },
]

const initialFormData = {
    chassisNumber: "",
    color: "",
    currentOdometerReading: "",
    customerId: "",
    engineNumber: "",
    modelId: "",
    brandId: "",
    manufacturingYear: "",
    purchaseDate: "",
    registrationDate: "",
    variantId: "",
    vehicleNumber: "",
}

export function VehicleCreateForm({ onCancel, onCreated }: VehicleCreateFormProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [customers, setCustomers] = useState<customerListType[]>([])
    const [formData, setFormData] = useState(initialFormData)
    const [vehicleBrand, setVehicleBrand] = useState<vehicleBrand[]>([])
    const [vehicleModel, setVehicleModel] = useState<vehicleModel[]>([])
    const [vehicleVariant, setVehicleVariant] = useState<vehicleVariant[]>([])

    const fetchDropdowns = async () => {
        try {
            const [brand, model, variant] = await Promise.all([
                getBrandListWithoutPagination(),
                getModelListWithoutPagination(),
                getVariantListWithoutPagination()
            ])
            if (brand?.success) {
                setVehicleBrand(brand?.data)
            }
            if (model?.success) {
                setVehicleModel(model?.data)
            }
            if (variant?.success) {
                setVehicleVariant(variant?.data)
            }
        } catch (err : any) {
            toast.add({
                type : 'error',
                description : err?.response?.data?.message
            })
        }
    }

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await getCustomerList(0, 100)
                if (res?.success) {
                    setCustomers(res?.data || [])
                }
            } catch {
                // ignore
            }
        }
        fetchCustomers()
        fetchDropdowns()
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const data = await createVehicle({
                ...formData,
                engineNumber : formData.engineNumber.toUpperCase(),
                chassisNumber : formData.chassisNumber.toUpperCase(),
                vehicleNumber : formData.vehicleNumber.toUpperCase(),
                currentOdometerReading: Number(formData.currentOdometerReading),
                customerId: Number(formData.customerId),
            })
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                setFormData(initialFormData)
                setTimeout(() => {
                    onCreated?.()
                }, 1500)
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
    const filterVehicleByBrand = formData.brandId ? vehicleModel.filter((f) => String(f.brandId) === formData.brandId) : vehicleModel
    const filterVehicleByModel = formData.modelId ? vehicleVariant.filter((f) => String(f.modelId) === formData.modelId) : vehicleVariant
    return (
        <form id="vehicle-form" onSubmit={handleSubmit}>
            <div className="space-y-4 py-3">
                <div>
                    <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Vehicle Details</h3></div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2 xl:grid-cols-3">
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Vehicle Number <span className="text-red-500">*</span></FieldLabel>
                            <div className="min-w-0">
                                <Input name='vehicleNumber' placeholder="Vehicle Number" required onChange={handleChange} value={formData.vehicleNumber.toUpperCase()} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Customer <span className="text-red-500">*</span></FieldLabel>
                            <div className="min-w-0">
                                <Select
                                    items={customers.map(c => ({ value: String(c.id), label: `${c.firstName} ${c.lastName} - ${c.mobileNo}` }))}
                                    value={formData.customerId || null}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value ?? "" }))}
                                    required
                                >
                                    <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                        <SelectValue placeholder="Select customer" />
                                    </SelectTrigger>
                                    <SelectContent align="start" alignItemWithTrigger={false}>
                                        {customers.map((c) => (
                                            <SelectItem key={c.id} value={String(c.id)}>
                                                {c.firstName} {c.lastName} - {c.mobileNo}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Chassis Number <span className="text-red-500">*</span></FieldLabel>
                            <div className="min-w-0">
                                <Input name='chassisNumber' placeholder="Chassis Number" required onChange={handleChange} value={formData.chassisNumber.toUpperCase()} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Engine Number <span className="text-red-500">*</span></FieldLabel>
                            <div className="min-w-0">
                                <Input name='engineNumber' placeholder="Engine Number" required onChange={handleChange} value={formData.engineNumber.toUpperCase()} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Brand <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={vehicleBrand.map(b => ({ value: String(b.id), label: `${b.brandName} - ${b.brandCode}` }))}
                                            value={formData.brandId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, brandId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select brand" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {vehicleBrand.map((b) => (
                                                    <SelectItem key={b.id} value={String(b.id)}>
                                                        {b.brandName} - {b.brandCode}
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
                                        disabled={!formData.brandId}
                                            items={filterVehicleByBrand.map(m => ({ value: String(m.id), label: `${m.modelName} - ${m.modelCode}` }))}
                                            value={formData.modelId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, modelId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select model" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {filterVehicleByBrand.map((m) => (
                                                    <SelectItem key={m.id} value={String(m.id)}>
                                                        {m.modelName} - {m.modelCode}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Variant</FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                        disabled={!formData.modelId}
                                            items={filterVehicleByModel.map(v => ({ value: String(v.id), label: `${v.variantName} - ${v.variantCode} - ${v.fuelType}` }))}
                                            value={formData.variantId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, variantId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select brand" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {filterVehicleByModel.map((v) => (
                                                    <SelectItem key={v.id} value={String(v.id)}>
                                                        {v.variantName} - {v.variantCode} - {v.fuelType}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Color</FieldLabel>
                            <div className="min-w-0">
                                <Input name='color' placeholder="Color" onChange={handleChange} value={formData.color} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Manufacturing Year</FieldLabel>
                            <div className="min-w-0">
                                <Input name='manufacturingYear' type='number' placeholder="YYYY" onChange={handleChange} value={formData.manufacturingYear} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Registration Date</FieldLabel>
                            <div className="min-w-0">
                                <Input name='registrationDate' type='date' onChange={handleChange} value={formData.registrationDate} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Purchase Date</FieldLabel>
                            <div className="min-w-0">
                                <Input name='purchaseDate' type='date' onChange={handleChange} value={formData.purchaseDate} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Current Odometer Reading <span className="text-red-500">*</span></FieldLabel>
                            <div className="min-w-0">
                                <Input name='currentOdometerReading' type='number' placeholder="Odometer reading" required onChange={handleChange} value={formData.currentOdometerReading} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 m-5 ">
                <Button type="button" variant="outline" size="sm" className="h-7 px-3 text-xs" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" size="sm" className="h-7 px-3 text-xs" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                    Create
                </Button>
            </div>
        </form>
    )
}
