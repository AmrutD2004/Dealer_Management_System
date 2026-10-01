import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { Field } from "@/components/Field";
import { FormSection } from "./FormSection";
import { useState } from "react";
import { type userCreateType, type tenantCreateType, type branchCreateType } from "@/Types/tenantTypes";
import { tenantCreation } from "@/api/endpoint";
import { toast } from "../ui/toast";
import { cn } from "cn";
import { Loader2 } from "lucide-react";

type props = {
  onCancel: () => void
}

export function TenantCreateForm({ onCancel }: props) {
  const [tenantData, setTenantData] = useState<tenantCreateType>({
    tenantName: '',
    email: '',
    phone: '',
    gstNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    subscriptionPlan: '',
    subscriptionStatus: ''
  })
  const [initialBranchData, setInitialBranchData] = useState<branchCreateType>({
    branchName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    locality: '',
    city: '',
    state: '',
    country: '',
    pincode: ''
  })

  const [initialUserData, setInitialUserData] = useState<userCreateType>({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    passwordHash: ''
  })

  const handleTenantChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTenantData(prev => ({ ...prev, [name]: value }))
  }
  const handleBranchChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInitialBranchData(prev => ({ ...prev, [name]: value }))
  }
  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInitialUserData(prev => ({ ...prev, [name]: value }))
  }

  const [loading, setLoading] = useState<boolean>(false)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const formData = {
        // Tenant Details
        tenant_name: tenantData.tenantName,
        tenant_email: tenantData.email,
        tenant_phone: tenantData.phone,
        tenant_gst_number: tenantData.gstNumber,
        tenant_address: tenantData.address,
        tenant_register_city: tenantData.city,
        tenant_register_state: tenantData.state,
        tenant_register_country: tenantData.country,
        tenant_register_pincode: tenantData.pincode,
        tenant_sub_plan: tenantData.subscriptionPlan,
        tenant_sub_status: tenantData.subscriptionStatus,

        // Initial Branch Details
        tenant_initial_branchName: initialBranchData.branchName,
        tenant_initial_branchEmail: initialBranchData.email,
        tenant_initial_branchPhone: initialBranchData.phone,
        tenant_initial_branchAddress: initialBranchData.address1,
        tenant_initial_branchAddress2: initialBranchData.address2,
        tenant_initial_branchLocality: initialBranchData.locality,
        tenant_initial_branchCity: initialBranchData.city,
        tenant_initial_branchState: initialBranchData.state,
        tenant_initial_branchCountry: initialBranchData.country,
        tenant_initial_branchPincode: initialBranchData.pincode,

        // Initial Tenant Admin Details
        first_name: initialUserData.firstName,
        middle_name: initialUserData.middleName,
        last_name: initialUserData.lastName,
        email: initialUserData.email,
        phone_no: initialUserData.mobileNo,
        passwordHash: initialUserData.passwordHash,
      };

      const data = await tenantCreation(formData)
      if (data?.success) {
        toast.add({
          type: 'success',
          description: data?.message
        })
        setTenantData({
          tenantName: '',
          email: '',
          phone: '',
          gstNumber: '',
          address: '',
          city: '',
          state: '',
          country: '',
          pincode: '',
          subscriptionPlan: '',
          subscriptionStatus: ''
        })
        setInitialBranchData({
          branchName: '',
          email: '',
          phone: '',
          address1: '',
          address2: '',
          locality: '',
          city: '',
          state: '',
          country: '',
          pincode: ''
        })
        setInitialUserData({
          firstName: '',
          middleName: '',
          lastName: '',
          email: '',
          mobileNo: '',
          passwordHash: ''
        })
      }
      if (!data?.message) {
        toast.add({
          type: 'error',
          description: data?.message
        })
      }
    } catch (error: any) {
      setLoading(false)
      toast.add({
        type: 'error',
        description: error?.response?.data?.message
      })
    } finally {
      setLoading(false)
    }
  }
  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {/* Tenant Details */}
      <FormSection title="Tenant Details" withSeparator={false}>
        <Field label="Tenant Name *" >
          <Input name="tenantName" placeholder="ABC Motors Pvt Ltd" onChange={handleTenantChange} />
        </Field>

        <Field label="Email *">
          <Input name="email" type="email" placeholder="admin@company.com" onChange={handleTenantChange} />
        </Field>

        <Field label="Phone *">
          <Input name="phone" placeholder="98765 43210" onChange={handleTenantChange} />
        </Field>

        <Field label="GST Number *">
          <Input name="gstNumber" placeholder="27AAECA1234A1Z5" onChange={handleTenantChange} />
        </Field>

        <Field label="Address *" className="sm:col-span-2">
          <Textarea name="address" placeholder="Business address" onChange={handleTenantChange} />
        </Field>

        <Field label="City *">
          <Input name="city" placeholder="Pune" onChange={handleTenantChange} />
        </Field>

        <Field label="State *">
          <Input name="state" placeholder="Maharashtra" onChange={handleTenantChange} />
        </Field>

        <Field label="Country *">
          <Input name="country" placeholder="India" onChange={handleTenantChange} />
        </Field>

        <Field label="Pincode *">
          <Input name="pincode" placeholder="411001" onChange={handleTenantChange} />
        </Field>
      </FormSection>

      {/* Subscription */}
      <FormSection title="Subscription">
        <Field label="Subscription Plan">
          <Select onValueChange={(value) => setTenantData((prev: any) => ({ ...prev, subscriptionPlan: value }))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Plan" />
            </SelectTrigger>
            <SelectContent>

              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Subscription Status">
          <Select onValueChange={(value) => setTenantData((prev: any) => ({ ...prev, subscriptionStatus: value }))}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TRIAL">Trial</SelectItem>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </FormSection>

      {/* Initial Branch */}
      <FormSection title="Initial Branch">

        <Field label="Branch Name *">
          <Input name="branchName" placeholder="Pune Main Branch" onChange={handleBranchChange} />
        </Field>

        <Field label="Email">
          <Input name="email" type="email" placeholder="branch@company.com" onChange={handleBranchChange} />
        </Field>

        <Field label="Address 1" className="sm:col-span-2">
          <Textarea name="address1" placeholder="Branch address" onChange={handleBranchChange} />
        </Field>
        <Field label="Address 2" className="sm:col-span-2">
          <Textarea name="address2" placeholder="Branch address" onChange={handleBranchChange} />
        </Field>

        <Field label="Locality">
          <Input name="locality" placeholder="Kothrud" onChange={handleBranchChange} />
        </Field>

        <Field label="City">
          <Input name="city" placeholder="Pune" onChange={handleBranchChange} />
        </Field>

        <Field label="State">
          <Input name="state" placeholder="Maharashtra" onChange={handleBranchChange} />
        </Field>

        <Field label="Country">
          <Input name="country" placeholder="India" onChange={handleBranchChange} />
        </Field>

        <Field label="Phone">
          <Input name="phone" placeholder="98765 43210" onChange={handleBranchChange} />
        </Field>
        
        <Field label="Pincode">
          <Input name="pincode" placeholder="411038" onChange={handleBranchChange} />
        </Field>
      </FormSection>

      {/* Initial Tenant Admin */}
      <FormSection title="Initial Tenant Admin" withSeparator={false}>

        <Field label="First Name">
          <Input name="firstName" placeholder="Rajesh" onChange={handleUserChange} />
        </Field>

        <Field label="Middle Name">
          <Input name="middleName" placeholder="Kumar" onChange={handleUserChange} />
        </Field>

        <Field label="Last Name">
          <Input name="lastName" placeholder="Sharma" onChange={handleUserChange} />
        </Field>

        <Field label="Email *">
          <Input name="email" type="email" placeholder="admin@company.com" onChange={handleUserChange} />
        </Field>

        <Field label="Mobile No *">
          <Input name="mobileNo" placeholder="98765 43210" onChange={handleUserChange} />
        </Field>

        <Field label="Password *" >
          <Input name="passwordHash" type="password" placeholder="••••••••••" onChange={handleUserChange} />
        </Field>
      </FormSection>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
        <Button type="button" variant="outline">
          Cancel
        </Button>

        <Button type="submit" disabled={loading} className={cn(`${loading ? 'flex items-center justify-center gap-2 cursor-not-allowed' : 'cursor-pointer'}w-full`)}>
          {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" />Creating...</span> : 'Create Tenant'}
        </Button>
      </div>
    </form>
  );
}