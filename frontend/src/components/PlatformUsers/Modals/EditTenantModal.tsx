import type { tenantUpdateType, tenantPlanType, tenantSubscriptionStatusType, tenantDetailType } from '@/Types/tenantCreateType'
import React, { useContext, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/toast'
import { editTenant } from '@/api/endpoints'
import { PlatformUserContext } from '@/Contexts/PlatformUserContext.tsx/PlatformUserContext'
import { Loader2, Building2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

type props = {
  tenant: tenantDetailType | null,
  open: boolean,
  onClose: () => void
}

const EditTenantModal = ({ tenant, open, onClose }: props) => {
    const { fetchTenantsList, tenantSkip, tenantTake, closeAllModals, selectedTenant } = useContext(PlatformUserContext)
    const [formData, setFormData] = useState<tenantUpdateType>({
        tenant_code: "",
        tenant_name: "",
        tenant_email: "",
        tenant_phone: "",
        tenant_gst_number: "",
        tenant_address: "",
        tenant_register_city: "",
        tenant_register_state: "",
        tenant_register_country: "",
        tenant_register_pincode: "",
        tenant_sub_plan: "Basic",
        tenant_sub_status: "ACTIVE",
    })
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (tenant) {
            setFormData({
                tenant_code: tenant.tenantCode ?? "",
                tenant_name: tenant.tenantName ?? "",
                tenant_email: tenant.email ?? "",
                tenant_phone: tenant.phone ?? "",
                tenant_gst_number: tenant.gstNumber ?? "",
                tenant_address: tenant.address ?? "",
                tenant_register_city: tenant.city ?? "",
                tenant_register_state: tenant.state ?? "",
                tenant_register_country: tenant.country ?? "",
                tenant_register_pincode: tenant.pincode ?? "",
                tenant_sub_plan: tenant.subscriptionPlan as tenantPlanType ?? "Basic",
                tenant_sub_status: tenant.subscriptionStatus as tenantSubscriptionStatusType ?? "ACTIVE",
            })
        }
    }, [tenant])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement| HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (name: string, value: string | null) => {
        setFormData(prev => ({ ...prev, [name]: value ?? "" }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        try {
            const tenantId = selectedTenant?.id
            if (!tenantId) {
                toast.add({
                    type: 'error',
                    description: 'Tenant ID not found'
                })
                setLoading(false)
                return
            }
            const data = await editTenant(formData, tenantId)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })

                fetchTenantsList(tenantSkip, tenantTake)
                setTimeout(() => {
                    closeAllModals()
                    onClose()
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

    const planOptions: tenantPlanType[] = ["Basic", "Pro", "Premium"]
    const statusOptions: tenantSubscriptionStatusType[] = ["TRIAL", "ACTIVE", "SUSPENDED", "EXPIRED", "CANCELLED"]

    return (
    <Dialog open={open} >
      <DialogContent className="max-w-sm lg:max-w-3xl md:max-w-xl overflow-y-auto max-h-[90vh] scrollbarHide " showCloseButton={false} >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <DialogTitle>Edit Tenant Details</DialogTitle>
              <DialogDescription>
                Update the tenant organization information. All fields are required.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form id="tenant-edit-form" onSubmit={handleSubmit}>
          <div className="space-y-4 py-3">
            {/* Tenant Identity */}
            <div>
              <div className="mb-2 bg-muted/40 px-2 py-1">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Tenant Identity</h3>
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                  <FieldLabel className="text-xs font-medium">Tenant Code <span className="text-red-500">*</span></FieldLabel>
                  <Input
                    name='tenant_code'
                    type='text'
                    className='h-7 rounded-none px-2 text-xs hover:cursor-not-allowed'
                    placeholder="T-ABCD1234"
                    onChange={handleChange}
                    value={formData.tenant_code}
                    readOnly
                    disabled
                  />
                </div>
                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                  <FieldLabel className="text-xs font-medium">Tenant Name <span className="text-red-500">*</span></FieldLabel>
                  <Input
                    name='tenant_name'
                    type='text'
                    placeholder="Acme Corporation"
                    required
                    onChange={handleChange}
                    value={formData.tenant_name}
                    className="h-7 rounded-none px-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <div className="mb-2 bg-muted/40 px-2 py-1">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Contact Information</h3>
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                  <FieldLabel className="text-xs font-medium">Email <span className="text-red-500">*</span></FieldLabel>
                  <Input
                    name='tenant_email'
                    type='email'
                    placeholder="contact@acme.com"
                    required
                    onChange={handleChange}
                    value={formData.tenant_email}
                    className="h-7 rounded-none px-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                  <FieldLabel className="text-xs font-medium">Phone <span className="text-red-500">*</span></FieldLabel>
                  <Input
                    name='tenant_phone'
                    type='tel'
                    placeholder="+91 98765 xxxxx"
                    required
                    onChange={handleChange}
                    value={formData.tenant_phone}
                    className="h-7 rounded-none px-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                  <FieldLabel className="text-xs font-medium">GST Number <span className="text-red-500">*</span></FieldLabel>
                  <Input
                    name='tenant_gst_number'
                    type='text'
                    placeholder="29ABCDE1234F1Z5"
                    required
                    onChange={handleChange}
                    value={formData.tenant_gst_number}
                    className="h-7 rounded-none px-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <div className="mb-2 bg-muted/40 px-2 py-1">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Registered Address</h3>
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                <div className="flex items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                  <FieldLabel className="w-[110px] shrink-0 text-xs font-medium">Address <span className="text-red-500">*</span></FieldLabel>
                  <div className="min-w-0 flex-1 max-w-sm">
                  <Textarea
                    name='tenant_address'
                    placeholder="123 Business Park, Sector 1"
                    onChange={handleChange}
                    required
                    value={formData.tenant_address}
                    className="h-7 rounded-none px-2 text-xs"
                  />
                  </div>
                </div>
                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                  <FieldLabel className="text-xs font-medium">City <span className="text-red-500">*</span></FieldLabel>
                  <Input
                    name='tenant_register_city'
                    type='text'
                    placeholder="Bangalore"
                    required
                    onChange={handleChange}
                    value={formData.tenant_register_city}
                    className="h-7 rounded-none px-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                  <FieldLabel className="text-xs font-medium">State <span className="text-red-500">*</span></FieldLabel>
                  <Input
                    name='tenant_register_state'
                    type='text'
                    placeholder="Karnataka"
                    required
                    onChange={handleChange}
                    value={formData.tenant_register_state}
                    className="h-7 rounded-none px-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                  <FieldLabel className="text-xs font-medium">Country <span className="text-red-500">*</span></FieldLabel>
                  <Input
                    name='tenant_register_country'
                    type='text'
                    placeholder="India"
                    required
                    onChange={handleChange}
                    value={formData.tenant_register_country}
                    className="h-7 rounded-none px-2 text-xs"
                  />
                </div>
                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                  <FieldLabel className="text-xs font-medium">Pincode <span className="text-red-500">*</span></FieldLabel>
                  <Input
                    name='tenant_register_pincode'
                    type='text'
                    placeholder="560001"
                    required
                    onChange={handleChange}
                    value={formData.tenant_register_pincode}
                    className="h-7 rounded-none px-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Subscription */}
            <div>
              <div className="mb-2 bg-muted/40 px-2 py-1">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Subscription</h3>
              </div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                  <FieldLabel className="text-xs font-medium">Plan <span className="text-red-500">*</span></FieldLabel>
                  <Select
                    name='tenant_sub_plan'
                    value={formData.tenant_sub_plan}
                    required
                    onValueChange={(value) => handleSelectChange('tenant_sub_plan', value)}
                  >
                    <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                      <SelectValue placeholder="Select Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      {planOptions.map((plan) => (
                        <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                  <FieldLabel className="text-xs font-medium">Status <span className="text-red-500">*</span></FieldLabel>
                  <Select
                    name='tenant_sub_status'
                    value={formData.tenant_sub_status}
                    required
                    onValueChange={(value) => handleSelectChange('tenant_sub_status', value)}
                  >
                    <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button onClick={() => { closeAllModals(); onClose() }} variant="outline"   disabled={loading}>Cancel</Button>
          <Button disabled={loading} form="tenant-edit-form" type="submit"  >
            {loading ? <span className='flex items-center gap-2'><Loader2 className="h-3 w-3 animate-spin" />Saving....</span> : " Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditTenantModal