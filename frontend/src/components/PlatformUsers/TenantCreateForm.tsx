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

import { Field, FieldLabel, FieldContent } from "@/components/ui/field";
import { FormSection } from "./FormSection";
import { useState } from "react";
import { type userCreateType, type tenantCreateType, type branchCreateType } from "@/Types/tenantCreateType";
import { tenantCreation } from "@/api/endpoints";
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
        tenant_gst_number: tenantData.gstNumber.toUpperCase(),
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
      if (!data?.success) {
        toast.add({
          type: 'error',
          description: data?.message ?? 'Failed to create tenant'
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
        <Field>
          <FieldLabel>Tenant Name *</FieldLabel>
          <FieldContent>
            <Input name="tenantName" value={tenantData.tenantName} placeholder="ABC Motors Pvt Ltd" onChange={handleTenantChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Email *</FieldLabel>
          <FieldContent>
            <Input name="email" value={tenantData.email} type="email" placeholder="admin@company.com" onChange={handleTenantChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Phone *</FieldLabel>
          <FieldContent>
            <Input name="phone" value={tenantData.phone} placeholder="98765 43210" onChange={handleTenantChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>GST Number *</FieldLabel>
          <FieldContent>
            <Input className="uppercase" name="gstNumber" value={tenantData.gstNumber} placeholder="27AAECA1234A1Z5" onChange={handleTenantChange} />
          </FieldContent>
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel>Address *</FieldLabel>
          <FieldContent>
            <Textarea name="address" value={tenantData.address} placeholder="Business address" onChange={handleTenantChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>City *</FieldLabel>
          <FieldContent>
            <Input name="city" value={tenantData.city} placeholder="Pune" onChange={handleTenantChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>State *</FieldLabel>
          <FieldContent>
            <Input name="state" value={tenantData.state} placeholder="Maharashtra" onChange={handleTenantChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Country *</FieldLabel>
          <FieldContent>
            <Input name="country" value={tenantData.country} placeholder="India" onChange={handleTenantChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Pincode *</FieldLabel>
          <FieldContent>
            <Input name="pincode" value={tenantData.pincode} placeholder="411001" onChange={handleTenantChange} />
          </FieldContent>
        </Field>
      </FormSection>

      {/* Subscription */}
      <FormSection title="Subscription">
        <Field>
          <FieldLabel>Subscription Plan</FieldLabel>
          <FieldContent>
            <Select name="subscriptionPlan" value={tenantData.subscriptionPlan || null} onValueChange={(value) => setTenantData((prev: any) => ({ ...prev, subscriptionPlan: value }))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Plan" />
              </SelectTrigger>
              <SelectContent>

                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Subscription Status</FieldLabel>
          <FieldContent>
            <Select name="subscriptionStatus" value={tenantData.subscriptionStatus || null} onValueChange={(value) => setTenantData((prev: any) => ({ ...prev, subscriptionStatus: value }))}>
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
          </FieldContent>
        </Field>
      </FormSection>

      {/* Initial Branch */}
      <FormSection title="Initial Branch">

        <Field>
          <FieldLabel>Branch Name *</FieldLabel>
          <FieldContent>
            <Input name="branchName" value={initialBranchData.branchName} placeholder="Pune Main Branch" onChange={handleBranchChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Email</FieldLabel>
          <FieldContent>
            <Input name="email" value={initialBranchData.email} type="email" placeholder="branch@company.com" onChange={handleBranchChange} />
          </FieldContent>
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel>Address 1</FieldLabel>
          <FieldContent>
            <Textarea name="address1" value={initialBranchData.address1} placeholder="Branch address" onChange={handleBranchChange} />
          </FieldContent>
        </Field>
        <Field className="sm:col-span-2">
          <FieldLabel>Address 2</FieldLabel>
          <FieldContent>
            <Textarea name="address2" value={initialBranchData.address2 ?? ''} placeholder="Branch address" onChange={handleBranchChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Locality</FieldLabel>
          <FieldContent>
            <Input name="locality" value={initialBranchData.locality} placeholder="Kothrud" onChange={handleBranchChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>City</FieldLabel>
          <FieldContent>
            <Input name="city" value={initialBranchData.city} placeholder="Pune" onChange={handleBranchChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>State</FieldLabel>
          <FieldContent>
            <Input name="state" value={initialBranchData.state} placeholder="Maharashtra" onChange={handleBranchChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Country</FieldLabel>
          <FieldContent>
            <Input name="country" value={initialBranchData.country} placeholder="India" onChange={handleBranchChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Phone</FieldLabel>
          <FieldContent>
            <Input name="phone" value={initialBranchData.phone} placeholder="98765 43210" onChange={handleBranchChange} />
          </FieldContent>
        </Field>
        
        <Field>
          <FieldLabel>Pincode</FieldLabel>
          <FieldContent>
            <Input name="pincode" value={initialBranchData.pincode} placeholder="411038" onChange={handleBranchChange} />
          </FieldContent>
        </Field>
      </FormSection>

      {/* Initial Tenant Admin */}
      <FormSection title="Initial Tenant Admin" withSeparator={false}>

        <Field>
          <FieldLabel>First Name</FieldLabel>
          <FieldContent>
            <Input name="firstName" value={initialUserData.firstName} placeholder="Rajesh" onChange={handleUserChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Middle Name</FieldLabel>
          <FieldContent>
            <Input name="middleName" value={initialUserData.middleName} placeholder="Kumar" onChange={handleUserChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Last Name</FieldLabel>
          <FieldContent>
            <Input name="lastName" value={initialUserData.lastName} placeholder="Sharma" onChange={handleUserChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Email *</FieldLabel>
          <FieldContent>
            <Input name="email" value={initialUserData.email} type="email" placeholder="admin@company.com" onChange={handleUserChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Mobile No *</FieldLabel>
          <FieldContent>
            <Input name="mobileNo" value={initialUserData.mobileNo} placeholder="98765 43210" onChange={handleUserChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Password *</FieldLabel>
          <FieldContent>
            <Input name="passwordHash" value={initialUserData.passwordHash} type="password" placeholder="••••••••••" onChange={handleUserChange} />
          </FieldContent>
        </Field>
      </FormSection>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>

        <Button type="submit" disabled={loading} className={cn(`${loading ? 'flex items-center justify-center gap-2 cursor-not-allowed' : 'cursor-pointer'}w-full`)}>
          {loading ? <span className="flex items-center gap-2"><Loader2 className="animate-spin" />Creating...</span> : 'Create Tenant'}
        </Button>
      </div>
    </form>
  );
}