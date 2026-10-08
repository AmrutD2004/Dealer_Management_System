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
    <form className="space-y-4 py-5" onSubmit={handleSubmit} >
      {/* Tenant Details */}
      <FormSection title="Tenant Details"  withSeparator={false}>
        <Field>
          <FieldLabel>Tenant Name <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="tenantName" value={tenantData.tenantName} required placeholder="ABC Motors Pvt Ltd" onChange={handleTenantChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Email <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="email" value={tenantData.email} type="email" required placeholder="admin@company.com" onChange={handleTenantChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Phone <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="phone" value={tenantData.phone} required placeholder="98765 43210" onChange={handleTenantChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>GST Number <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input className="uppercase" name="gstNumber" value={tenantData.gstNumber} 
            required placeholder="27AAECA1234A1Z5" onChange={handleTenantChange} />
          </FieldContent>
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel>Address <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Textarea name="address" value={tenantData.address} required placeholder="Business address" onChange={handleTenantChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>City <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="city" value={tenantData.city} required placeholder="Pune" onChange={handleTenantChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>State <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="state" value={tenantData.state} required placeholder="Maharashtra" onChange={handleTenantChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Country <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="country" value={tenantData.country} required placeholder="India" onChange={handleTenantChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Pincode <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="pincode" value={tenantData.pincode} required placeholder="411001" onChange={handleTenantChange} />
          </FieldContent>
        </Field>
      </FormSection>

      {/* Subscription */}
      <FormSection title="Subscription">
        <Field>
          <FieldLabel>Subscription Plan <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Select name="subscriptionPlan" required value={tenantData.subscriptionPlan || null} onValueChange={(value) => setTenantData((prev: any) => ({ ...prev, subscriptionPlan: value }))}>
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
          <FieldLabel>Subscription Status <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Select name="subscriptionStatus" required value={tenantData.subscriptionStatus || null} onValueChange={(value) => setTenantData((prev: any) => ({ ...prev, subscriptionStatus: value }))}>
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
          <FieldLabel>Branch Name <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="branchName" value={initialBranchData.branchName} required placeholder="Pune Main Branch" onChange={handleBranchChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Email <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="email" value={initialBranchData.email} type="email" required placeholder="branch@company.com" onChange={handleBranchChange} />
          </FieldContent>
        </Field>

        <Field className="sm:col-span-2">
          <FieldLabel>Address 1 <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Textarea name="address1" value={initialBranchData.address1} required placeholder="Branch address" onChange={handleBranchChange} />
          </FieldContent>
        </Field>
        <Field className="sm:col-span-2">
          <FieldLabel>Address 2</FieldLabel>
          <FieldContent>
            <Textarea name="address2" value={initialBranchData.address2 ?? ''} placeholder="Branch address" onChange={handleBranchChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Locality <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="locality" value={initialBranchData.locality} required placeholder="Kothrud" onChange={handleBranchChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>City <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="city" value={initialBranchData.city} required placeholder="Pune" onChange={handleBranchChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>State <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="state" value={initialBranchData.state} required placeholder="Maharashtra" onChange={handleBranchChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Country <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="country" value={initialBranchData.country} required placeholder="India" onChange={handleBranchChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Phone <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="phone" value={initialBranchData.phone} required placeholder="98765 43210" onChange={handleBranchChange} />
          </FieldContent>
        </Field>
        
        <Field>
          <FieldLabel>Pincode <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="pincode" value={initialBranchData.pincode} required placeholder="411038" onChange={handleBranchChange} />
          </FieldContent>
        </Field>
      </FormSection>

      {/* Initial Tenant Admin */}
      <FormSection title="Initial Tenant Admin" withSeparator={false}>

        <Field>
          <FieldLabel>First Name <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="firstName" value={initialUserData.firstName} required placeholder="Rajesh" onChange={handleUserChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Middle Name <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="middleName" value={initialUserData.middleName} required placeholder="Kumar" onChange={handleUserChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Last Name <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="lastName" value={initialUserData.lastName} required placeholder="Sharma" onChange={handleUserChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Email <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="email" value={initialUserData.email} type="email" required placeholder="admin@company.com" onChange={handleUserChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Mobile No <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="mobileNo" value={initialUserData.mobileNo} required placeholder="98765 43210" onChange={handleUserChange} />
          </FieldContent>
        </Field>

        <Field>
          <FieldLabel>Password <span className="text-red-500">*</span></FieldLabel>
          <FieldContent>
            <Input name="passwordHash" value={initialUserData.passwordHash} type="password" required placeholder="••••••••••" onChange={handleUserChange} />
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