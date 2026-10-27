import { editTenantBranch } from "@/api/endpoints"
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
import type { branchListType } from "@/Types/tenantCreateType"
import { Loader2 } from "lucide-react"
import { useContext, useEffect, useState } from "react"

interface EditBranchModalProps {
    branch: branchListType | null,
    open: boolean,
    onClose: () => void
}

const initialFormData = {
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
}

export function EditBranchModal({ branch, open, onClose }: EditBranchModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const { fetchTenantBranchList, skip, take, closeAllModals } = useContext(TenantContext)
    const [formData, setFormData] = useState(initialFormData)

    useEffect(() => {
        if (branch) {
            setFormData({
                branchName: branch.branchName ?? "",
                email: branch.email ?? "",
                phone: branch.phone ?? "",
                address1: branch.address1 ?? "",
                address2: branch.address2 ?? "",
                locality: branch.locality ?? "",
                city: branch.city ?? "",
                state: branch.state ?? "",
                country: branch.country ?? "",
                pincode: branch.pincode ?? "",
            })
        }
    }, [branch])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCancel = () => {
        closeAllModals()
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        setLoading(true)
        e.preventDefault()
        if (!branch) return
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
            const data = await editTenantBranch(payload, branch.id)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchTenantBranchList(skip, take)
                setTimeout(() => {
                    handleCancel()
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
        } finally {
            setLoading(false)
        }
    }

    if (!branch) return null

    return (
        <Dialog open={open}>
            <form>
                <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                    <DialogHeader>
                        <DialogTitle>Edit Branch</DialogTitle>
                        <DialogDescription>Update the branch details.</DialogDescription>
                    </DialogHeader>

                    <form id="branch-edit-form" onSubmit={handleSubmit}>
                        <div className="space-y-4 py-3">
                            <div>
                                <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Branch Details</h3></div>
                                <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Branch Code</FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='branchCode' disabled value={branch.branchCode}  className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Branch Name <span className="text-red-500">*</span></FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='branchName' placeholder="Branch Name" required onChange={handleChange} value={formData.branchName}  className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Email <span className="text-red-500">*</span></FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='email' type='email' placeholder="branch@redogroup.com" required onChange={handleChange} value={formData.email}  className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Phone <span className="text-red-500">*</span></FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='phone' placeholder="+91 00000 00000" required onChange={handleChange} value={formData.phone}  className="h-7 rounded-none px-2 text-xs" />
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
                                            <Input name='address1' placeholder="Address Line 1" required onChange={handleChange} value={formData.address1}  className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                                        <FieldLabel className="text-xs font-medium">Address Line 2</FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='address2' placeholder="Address Line 2" onChange={handleChange} value={formData.address2}  className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Locality <span className="text-red-500">*</span></FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='locality' placeholder="Locality" required onChange={handleChange} value={formData.locality}  className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">City <span className="text-red-500">*</span></FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='city' placeholder="City" required onChange={handleChange} value={formData.city}  className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">State <span className="text-red-500">*</span></FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='state' placeholder="State" required onChange={handleChange} value={formData.state}  className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Country <span className="text-red-500">*</span></FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='country' placeholder="Country" required onChange={handleChange} value={formData.country}  className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Pincode <span className="text-red-500">*</span></FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='pincode' placeholder="Pincode" required onChange={handleChange} value={formData.pincode}  className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <DialogFooter>
                        <Button size="sm" onClick={handleCancel} variant="outline" className="h-7 px-3 text-xs">Cancel</Button>
                        <Button size="sm" form="branch-edit-form" type="submit" disabled={loading} className="h-7 px-3 text-xs">
                            {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Saving....</span>}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
