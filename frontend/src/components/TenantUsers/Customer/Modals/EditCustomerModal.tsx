import { editCustomer } from "@/api/endpoints"
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
import type { customerListType } from "@/Types/tenantCreateType"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { titleOptions } from "../CustomerCreateForm"

interface EditCustomerModalProps {
    customer: customerListType | null
    open: boolean
    onClose: () => void
    onUpdated?: () => void
}

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

export function EditCustomerModal({ customer, open, onClose, onUpdated }: EditCustomerModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [prevCustomer, setPrevCustomer] = useState<customerListType | null>(null)
    const [formData, setFormData] = useState(initialFormData)

    if (customer && customer !== prevCustomer) {
        setPrevCustomer(customer)
        setFormData({
            title: customer.title ?? "",
            firstName: customer.firstName ?? "",
            middleName: customer.middleName ?? "",
            lastName: customer.lastName ?? "",
            email: customer.email ?? "",
            mobileNo: customer.mobileNo ?? "",
            alternateMobileNo: customer.alternateMobileNo ?? "",
            dateOfBirth: customer.dateOfBirth ? customer.dateOfBirth.slice(0, 10) : "",
            address1: customer.address1 ?? "",
            address2: customer.address2 ?? "",
            city: customer.city ?? "",
            state: customer.state ?? "",
            country: customer.country ?? "",
            pincode: customer.pincode ?? "",
            labourDiscountPercent: String(customer.laborDiscountPercent ?? ""),
            partDiscountPercent: String(customer.partDiscountPercent ?? ""),
        })
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!customer) return
        setLoading(true)
        try {
            const data = await editCustomer(formData, customer.id)
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

    if (!customer) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Edit Customer</DialogTitle>
                    <DialogDescription>Update the customer details.</DialogDescription>
                </DialogHeader>

                <form id="customer-edit-form" onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Customer Details</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel>Customer Code</FieldLabel>
                                    <FieldContent>
                                        <Input name='customerCode' disabled value={customer.customerCode} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Title <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={titleItems}
                                            value={formData.title || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, title: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
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
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>First Name <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='firstName' placeholder="First Name" required onChange={handleChange} value={formData.firstName} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Middle Name</FieldLabel>
                                    <FieldContent>
                                        <Input name='middleName' placeholder="Middle Name" onChange={handleChange} value={formData.middleName} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Last Name <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='lastName' placeholder="Last Name" required onChange={handleChange} value={formData.lastName} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Email</FieldLabel>
                                    <FieldContent>
                                        <Input name='email' type='email' placeholder="customer@example.com" onChange={handleChange} value={formData.email} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Mobile No <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='mobileNo' placeholder="+91 00000 00000" required onChange={handleChange} value={formData.mobileNo} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Alternate Mobile No</FieldLabel>
                                    <FieldContent>
                                        <Input name='alternateMobileNo' placeholder="+91 00000 00000" onChange={handleChange} value={formData.alternateMobileNo} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Date of Birth</FieldLabel>
                                    <FieldContent>
                                        <Input name='dateOfBirth' type='date' onChange={handleChange} value={formData.dateOfBirth} />
                                    </FieldContent>
                                </Field>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Address</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field className="sm:col-span-2">
                                    <FieldLabel>Address Line 1 <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='address1' placeholder="Address Line 1" required onChange={handleChange} value={formData.address1} />
                                    </FieldContent>
                                </Field>
                                <Field className="sm:col-span-2">
                                    <FieldLabel>Address Line 2</FieldLabel>
                                    <FieldContent>
                                        <Input name='address2' placeholder="Address Line 2" onChange={handleChange} value={formData.address2} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>City</FieldLabel>
                                    <FieldContent>
                                        <Input name='city' placeholder="City" onChange={handleChange} value={formData.city} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>State</FieldLabel>
                                    <FieldContent>
                                        <Input name='state' placeholder="State" onChange={handleChange} value={formData.state} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Country</FieldLabel>
                                    <FieldContent>
                                        <Input name='country' placeholder="Country" onChange={handleChange} value={formData.country} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Pincode</FieldLabel>
                                    <FieldContent>
                                        <Input name='pincode' placeholder="Pincode" onChange={handleChange} value={formData.pincode} />
                                    </FieldContent>
                                </Field>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Discount</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel>Labour Discount % <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='labourDiscountPercent' type='number' step='0.01' min='0' placeholder="0" required onChange={handleChange} value={formData.labourDiscountPercent} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Part Discount % <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='partDiscountPercent' type='number' step='0.01' min='0' placeholder="0" required onChange={handleChange} value={formData.partDiscountPercent} />
                                    </FieldContent>
                                </Field>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={onClose} variant="outline">Cancel</Button>
                    <Button form="customer-edit-form" type="submit" disabled={loading}>
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving....</span>}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
