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
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/toast'
import { editTenant } from '@/api/endpoints'
import { PlatformUserContext } from '@/Contexts/PlatformUserContext.tsx/PlatformUserContext'
import { Loader2, Building2 } from 'lucide-react'

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
    <Dialog open={open}>
      <DialogContent className="max-w-sm lg:max-w-3xl md:max-w-xl overflow-y-auto max-h-[90vh]" showCloseButton={false}>
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
          <div className="space-y-6 py-1">
            {/* Tenant Identity */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Tenant Identity</h3>
              <div className="grid gap-4 grid-cols-2">
                <Field className="sm:col-span-2">
                  <FieldLabel>Tenant Code *</FieldLabel>
                  <FieldContent>
                    <Input
                      name='tenant_code'
                      type='text'
                      className='hover:cursor-not-allowed'
                      placeholder="T-ABCD1234"
                      onChange={handleChange}
                      value={formData.tenant_code}
                      readOnly
                      disabled
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Tenant Name *</FieldLabel>
                  <FieldContent>
                    <Input
                      name='tenant_name'
                      type='text'
                      placeholder="Acme Corporation"
                      onChange={handleChange}
                      value={formData.tenant_name}
                    />
                  </FieldContent>
                </Field>
              </div>
            </div>

            {/* Contact Information */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Contact Information</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field className="sm:col-span-2">
                  <FieldLabel>Email *</FieldLabel>
                  <FieldContent>
                    <Input
                      name='tenant_email'
                      type='email'
                      placeholder="contact@acme.com"
                      onChange={handleChange}
                      value={formData.tenant_email}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Phone *</FieldLabel>
                  <FieldContent>
                    <Input
                      name='tenant_phone'
                      type='tel'
                      placeholder="+91 98765 43210"
                      onChange={handleChange}
                      value={formData.tenant_phone}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>GST Number *</FieldLabel>
                  <FieldContent>
                    <Input
                      name='tenant_gst_number'
                      type='text'
                      placeholder="29ABCDE1234F1Z5"
                      onChange={handleChange}
                      value={formData.tenant_gst_number}
                    />
                  </FieldContent>
                </Field>
              </div>
            </div>

            {/* Address */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Registered Address</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field className="sm:col-span-2">
                  <FieldLabel>Address *</FieldLabel>
                  <FieldContent>
                    <Input
                      name='tenant_address'
                      type='text'
                      placeholder="123 Business Park, Sector 1"
                      onChange={handleChange}
                      value={formData.tenant_address}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>City *</FieldLabel>
                  <FieldContent>
                    <Input
                      name='tenant_register_city'
                      type='text'
                      placeholder="Bangalore"
                      onChange={handleChange}
                      value={formData.tenant_register_city}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>State *</FieldLabel>
                  <FieldContent>
                    <Input
                      name='tenant_register_state'
                      type='text'
                      placeholder="Karnataka"
                      onChange={handleChange}
                      value={formData.tenant_register_state}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Country *</FieldLabel>
                  <FieldContent>
                    <Input
                      name='tenant_register_country'
                      type='text'
                      placeholder="India"
                      onChange={handleChange}
                      value={formData.tenant_register_country}
                    />
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Pincode *</FieldLabel>
                  <FieldContent>
                    <Input
                      name='tenant_register_pincode'
                      type='text'
                      placeholder="560001"
                      onChange={handleChange}
                      value={formData.tenant_register_pincode}
                    />
                  </FieldContent>
                </Field>
              </div>
            </div>

            {/* Subscription */}
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Subscription</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Plan *</FieldLabel>
                  <FieldContent>
                    <Select
                      name='tenant_sub_plan'
                      value={formData.tenant_sub_plan}
                      onValueChange={(value) => handleSelectChange('tenant_sub_plan', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {planOptions.map((plan) => (
                          <SelectItem key={plan} value={plan}>{plan}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
                <Field>
                  <FieldLabel>Status *</FieldLabel>
                  <FieldContent>
                    <Select
                      name='tenant_sub_status'
                      value={formData.tenant_sub_status}
                      onValueChange={(value) => handleSelectChange('tenant_sub_status', value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>{status}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>
              </div>
            </div>
          </div>
        </form>
        <DialogFooter>
          <Button onClick={() => { closeAllModals(); onClose() }} variant="outline" disabled={loading}>Cancel</Button>
          <Button disabled={loading} form="tenant-edit-form" type="submit">
            {loading ? <span className='flex items-center gap-2'><Loader2 className="animate-spin" />Saving....</span> : " Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditTenantModal