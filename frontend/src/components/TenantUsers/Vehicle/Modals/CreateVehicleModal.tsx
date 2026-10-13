import { createVehicle, getVehicleList, deactivateVehicle, activateVehicle } from "@/api/endpoints"
import { getCustomerList } from "@/api/endpoints"
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
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface CreateVehicleModalProps {
    open: boolean
    setOpen: (open: boolean) => void
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
    fuleType: "",
    manufacture: "",
    manufacturingYear: "",
    model: "",
    purchaseDate: "",
    registrationDate: "",
    transmissionType: "",
    variant: "",
    vehicleNumber: "",
}

export function CreateVehicleModal({ open, setOpen, onCreated }: CreateVehicleModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [customers, setCustomers] = useState<any[]>([])
    const [formData, setFormData] = useState(initialFormData)

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const res = await getCustomerList(0, 100)
                if (res?.success) {
                    setCustomers(res?.data || [])
                }
            } catch (err) {
                // ignore
            }
        }
        if (open) {
            fetchCustomers()
        }
    }, [open])

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
                currentOdometerReading: Number(formData.currentOdometerReading),
                customerId: Number(formData.customerId),
            })
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                setFormData(initialFormData)
                onCreated?.()
                setTimeout(() => {
                    setOpen(false)
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

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Create New Vehicle</DialogTitle>
                    <DialogDescription>Add a new vehicle to the tenant.</DialogDescription>
                </DialogHeader>

                <form id="vehicle-form" onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Vehicle Details</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel>Vehicle Number <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='vehicleNumber' placeholder="Vehicle Number" required onChange={handleChange} value={formData.vehicleNumber} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Customer <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={customers.map(c => ({ value: String(c.id), label: `${c.firstName} ${c.lastName} - ${c.mobileNo}` }))}
                                            value={formData.customerId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
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
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Chassis Number <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='chassisNumber' placeholder="Chassis Number" required onChange={handleChange} value={formData.chassisNumber} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Engine Number <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='engineNumber' placeholder="Engine Number" required onChange={handleChange} value={formData.engineNumber} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Manufacturer <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='manufacture' placeholder="Manufacturer" required onChange={handleChange} value={formData.manufacture} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Model <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='model' placeholder="Model" required onChange={handleChange} value={formData.model} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Variant</FieldLabel>
                                    <FieldContent>
                                        <Input name='variant' placeholder="Variant" onChange={handleChange} value={formData.variant} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Color</FieldLabel>
                                    <FieldContent>
                                        <Input name='color' placeholder="Color" onChange={handleChange} value={formData.color} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Fuel Type</FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={fuelTypeOptions.map(f => ({ value: f.value, label: f.label }))}
                                            value={formData.fuleType || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, fuleType: value ?? "" }))}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select fuel type" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {fuelTypeOptions.map((f) => (
                                                    <SelectItem key={f.value} value={f.value}>
                                                        {f.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Transmission Type</FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={transmissionOptions.map(t => ({ value: t.value, label: t.label }))}
                                            value={formData.transmissionType || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, transmissionType: value ?? "" }))}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select transmission" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {transmissionOptions.map((t) => (
                                                    <SelectItem key={t.value} value={t.value}>
                                                        {t.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Manufacturing Year</FieldLabel>
                                    <FieldContent>
                                        <Input name='manufacturingYear' type='number' placeholder="YYYY" onChange={handleChange} value={formData.manufacturingYear} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Registration Date</FieldLabel>
                                    <FieldContent>
                                        <Input name='registrationDate' type='date' onChange={handleChange} value={formData.registrationDate} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Purchase Date</FieldLabel>
                                    <FieldContent>
                                        <Input name='purchaseDate' type='date' onChange={handleChange} value={formData.purchaseDate} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Current Odometer Reading <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='currentOdometerReading' type='number' placeholder="Odometer reading" required onChange={handleChange} value={formData.currentOdometerReading} />
                                    </FieldContent>
                                </Field>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" form="vehicle-form" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}