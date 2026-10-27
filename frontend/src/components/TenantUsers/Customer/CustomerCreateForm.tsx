import { createCustomer } from "@/api/endpoints"
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
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface CustomerCreateFormProps {
    onCancel: () => void
    onCreated?: () => void
}

export const titleOptions = [
    { value: "Mr", label: "Mr" },
    { value: "Mrs", label: "Mrs" },
    { value: "Ms", label: "Ms" },
    { value: "Miss", label: "Miss" },
    { value: "Dr", label: "Dr" },
]

const titleItems = titleOptions.map((option) => ({
    value: option.value,
    label: option.label,
}))

const initialFormData = {
    title: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    mobileNo: "",
    alternateMobileNo: "",
    dateOfBirth: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
    labourDiscountPercent: "",
    partDiscountPercent: "",
}

export function CustomerCreateForm({ onCancel, onCreated }: CustomerCreateFormProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState(initialFormData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const data = await createCustomer(formData)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                setFormData(initialFormData)
                setTimeout(() => {
                    onCreated?.()
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
        <form id="customer-form" onSubmit={handleSubmit} >
            <div className="space-y-4 py-3">
                <div>
                    <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Customer Details</h3></div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Title <span className="text-red-500">*</span></FieldLabel>
                            <div className="min-w-0">
                                <Select
                                    items={titleItems}
                                    value={formData.title || null}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, title: value ?? "" }))}
                                    required
                                >
                                    <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                        <SelectValue placeholder="Select a title" />
                                    </SelectTrigger>
                                    <SelectContent align="start" alignItemWithTrigger={false}>
                                        {titleOptions.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">First Name <span className="text-red-500">*</span></FieldLabel>
                            <div className="min-w-0">
                                <Input name='firstName' placeholder="First Name" required onChange={handleChange} value={formData.firstName} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Middle Name</FieldLabel>
                            <div className="min-w-0">
                                <Input name='middleName' placeholder="Middle Name" onChange={handleChange} value={formData.middleName} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Last Name <span className="text-red-500">*</span></FieldLabel>
                            <div className="min-w-0">
                                <Input name='lastName' placeholder="Last Name" required onChange={handleChange} value={formData.lastName} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Email</FieldLabel>
                            <div className="min-w-0">
                                <Input name='email' type='email' placeholder="customer@example.com" onChange={handleChange} value={formData.email} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Mobile No <span className="text-red-500">*</span></FieldLabel>
                            <div className="min-w-0">
                                <Input name='mobileNo' placeholder="+91 00000 00000" required onChange={handleChange} value={formData.mobileNo} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Alternate Mobile No</FieldLabel>
                            <div className="min-w-0">
                                <Input name='alternateMobileNo' placeholder="+91 00000 00000" onChange={handleChange} value={formData.alternateMobileNo} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Date of Birth</FieldLabel>
                            <div className="min-w-0">
                                <Input name='dateOfBirth' type='date' onChange={handleChange} value={formData.dateOfBirth} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Address</h3></div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                            <FieldLabel className="text-xs font-medium">Address Line 1 <span className="text-red-500">*</span></FieldLabel>
                            <div className="min-w-0">
                                <Input name='address1' placeholder="Address Line 1" required onChange={handleChange} value={formData.address1} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                            <FieldLabel className="text-xs font-medium">Address Line 2</FieldLabel>
                            <div className="min-w-0">
                                <Input name='address2' placeholder="Address Line 2" onChange={handleChange} value={formData.address2} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">City</FieldLabel>
                            <div className="min-w-0">
                                <Input name='city' placeholder="City" onChange={handleChange} value={formData.city} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">State</FieldLabel>
                            <div className="min-w-0">
                                <Input name='state' placeholder="State" onChange={handleChange} value={formData.state} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Country</FieldLabel>
                            <div className="min-w-0">
                                <Input name='country' placeholder="Country" onChange={handleChange} value={formData.country} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Pincode</FieldLabel>
                            <div className="min-w-0">
                                <Input name='pincode' placeholder="Pincode" onChange={handleChange} value={formData.pincode} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Discount</h3></div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Labour Discount % <span className="text-red-500">*</span></FieldLabel>
                            <div className="min-w-0">
                                <Input name='labourDiscountPercent' type='number' step='0.01' min='0' placeholder="0" required onChange={handleChange} value={formData.labourDiscountPercent} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Part Discount % <span className="text-red-500">*</span></FieldLabel>
                            <div className="min-w-0">
                                <Input name='partDiscountPercent' type='number' step='0.01' min='0' placeholder="0" required onChange={handleChange} value={formData.partDiscountPercent} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 m-5">
                <Button type="button" onClick={onCancel} variant="outline" size="sm" className="h-7 px-3 text-xs" disabled={loading}>Cancel</Button>
                <Button type="submit" size="sm" className="h-7 px-3 text-xs" disabled={loading}>
                    {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Creating....</span>}
                    Create Customer
                </Button>
            </div>
        </form>
    )
}
