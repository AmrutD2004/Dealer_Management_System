import { createBranch } from "@/api/endpoints"
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
import { toast } from "@/components/ui/toast"
import { TenantContext } from "@/Contexts/Tenant/TenantContext"
import { Loader2 } from "lucide-react"
import { useContext, useState } from "react"

interface CreateBranchModalProps {
    open: boolean
    setOpen: (open: boolean) => void
}

export function CreateBranchModal({ open, setOpen }: CreateBranchModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const { fetchTenantBranchList, skip, take } = useContext(TenantContext)
    const [formData, setFormData] = useState({
        branchName: "",
        email: "",
        phone: "",
        address1: "",
        address2: "",
        locality: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true)
        e.preventDefault()
        try {
            const payload = {
                tenant_branchName: formData.branchName,
                tenant_branchEmail: formData.email,
                tenant_branchPhone: formData.phone,
                tenant_branchAddress: formData.address1,
                tenant_branchAddress2: formData.address2,
                tenant_branchLocality: formData.locality,
                tenant_branchCity: formData.city,
                tenant_branchState: formData.state,
                tenant_branchCountry: formData.country,
                tenant_branchPincode: formData.pincode
            }
            const data = await createBranch(payload)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                setFormData({
                    branchName: "",
                    email: "",
                    phone: "",
                    address1: "",
                    address2: "",
                    locality: "",
                    city: "",
                    state: "",
                    country: "",
                    pincode: "",
                })
                fetchTenantBranchList(skip, take)
                setTimeout(()=>{
                    setOpen(false)
                }, 2000)
            }
            if (!data?.success) {
                toast.add({
                    type: 'error',
                    description: data?.message
                })
            }
        } catch (err: any) {
            toast.add({
                type: 'error',
                description: err?.response?.data?.message
            })
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open}>
            <form>
                <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                    <DialogHeader>
                        <DialogTitle>Create New Branch</DialogTitle>
                        <DialogDescription>Add a new branch to the tenant.</DialogDescription>
                    </DialogHeader>

                    <form id="branch-form" onSubmit={handleSubmit}>
                        <div className="space-y-4 py-3">
                            <div>
                                <div className="mb-2 bg-muted/40 px-2 py-1">
                                    <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Branch Details</h3>
                                </div>
                                <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Branch Name <span className="text-red-500">*</span></FieldLabel>
                                        <Input name='branchName' placeholder="Branch Name" required onChange={handleChange} value={formData.branchName} className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Email <span className="text-red-500">*</span></FieldLabel>
                                        <Input name='email' type='email' placeholder="branch@redogroup.com" required onChange={handleChange} value={formData.email} className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Phone <span className="text-red-500">*</span></FieldLabel>
                                        <Input name='phone' placeholder="+91 00000 00000" required onChange={handleChange} value={formData.phone} className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="mb-2 bg-muted/40 px-2 py-1">
                                    <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Address</h3>
                                </div>
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
                                        <FieldLabel className="text-xs font-medium">Locality <span className="text-red-500">*</span></FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='locality' placeholder="Locality" required onChange={handleChange} value={formData.locality} className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">City <span className="text-red-500">*</span></FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='city' placeholder="City" required onChange={handleChange} value={formData.city} className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">State <span className="text-red-500">*</span></FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='state' placeholder="State" required onChange={handleChange} value={formData.state} className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Country <span className="text-red-500">*</span></FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='country' placeholder="Country" required onChange={handleChange} value={formData.country} className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Pincode <span className="text-red-500">*</span></FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='pincode' placeholder="Pincode" required onChange={handleChange} value={formData.pincode} className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                <DialogFooter>
                    <Button type="button" onClick={() => setOpen(false)} variant="outline" size="sm" className="h-7 px-3 text-xs">Cancel</Button>
                    <Button form="branch-form" type="submit" size="sm" className="h-7 px-3 text-xs" disabled={loading}>
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Creating....</span>}
                        Create Branch
                    </Button>
                </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
