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

import { FieldLabel } from "@/components/ui/field";
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
        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Tenant Name <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="tenantName" value={tenantData.tenantName} required placeholder="ABC Motors Pvt Ltd" onChange={handleTenantChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Email <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="email" value={tenantData.email} type="email" required placeholder="admin@company.com" onChange={handleTenantChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Phone <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="phone" value={tenantData.phone} required placeholder="98765 43210" onChange={handleTenantChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">GST Number <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input className="h-7 rounded-none px-2 text-xs uppercase" name="gstNumber" value={tenantData.gstNumber} 
            required placeholder="27AAECA1234A1Z5" onChange={handleTenantChange} />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="w-[110px] shrink-0 text-xs font-medium">Address <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0 flex-1 max-w-sm">
            <Textarea name="address" value={tenantData.address} required placeholder="Business address" onChange={handleTenantChange} className="min-h-[48px] rounded-none px-2 py-1 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">City <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="city" value={tenantData.city} required placeholder="Pune" onChange={handleTenantChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">State <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="state" value={tenantData.state} required placeholder="Maharashtra" onChange={handleTenantChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Country <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="country" value={tenantData.country} required placeholder="India" onChange={handleTenantChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Pincode <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="pincode" value={tenantData.pincode} required placeholder="411001" onChange={handleTenantChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>
      </FormSection>

      {/* Subscription */}
      <FormSection title="Subscription">
        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Subscription Plan <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Select name="subscriptionPlan" required value={tenantData.subscriptionPlan || null} onValueChange={(value) => setTenantData((prev: any) => ({ ...prev, subscriptionPlan: value }))}>
              <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                <SelectValue placeholder="Select Plan" />
              </SelectTrigger>
              <SelectContent>

                <SelectItem value="Basic">Basic</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Subscription Status<span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Select name="subscriptionStatus" required value={tenantData.subscriptionStatus || null} onValueChange={(value) => setTenantData((prev: any) => ({ ...prev, subscriptionStatus: value }))}>
              <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
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
          </div>
        </div>
      </FormSection>

      {/* Initial Branch */}
      <FormSection title="Initial Branch">

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Branch Name <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="branchName" value={initialBranchData.branchName} required placeholder="Pune Main Branch" onChange={handleBranchChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Email <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="email" value={initialBranchData.email} type="email" required placeholder="branch@company.com" onChange={handleBranchChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="w-[110px] shrink-0 text-xs font-medium">Address 1 <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0 flex-1">
            <Textarea name="address1" value={initialBranchData.address1} required placeholder="Branch address" onChange={handleBranchChange} className="min-h-[48px] rounded-none px-2 py-1 text-xs" />
          </div>
          
        </div>
        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="w-[80px] shrink-0 text-xs font-medium">Address 2</FieldLabel>
          <div className="min-w-0 flex-1">
            <Textarea name="address2" value={initialBranchData.address2 ?? ''} placeholder="Branch address" onChange={handleBranchChange} className="min-h-[48px] rounded-none px-2 py-1 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Locality <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="locality" value={initialBranchData.locality} required placeholder="Kothrud" onChange={handleBranchChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">City <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="city" value={initialBranchData.city} required placeholder="Pune" onChange={handleBranchChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">State <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="state" value={initialBranchData.state} required placeholder="Maharashtra" onChange={handleBranchChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Country <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="country" value={initialBranchData.country} required placeholder="India" onChange={handleBranchChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Phone <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="phone" value={initialBranchData.phone} required placeholder="98765 43210" onChange={handleBranchChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>
        
        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Pincode <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="pincode" value={initialBranchData.pincode} required placeholder="411038" onChange={handleBranchChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>
      </FormSection>

      {/* Initial Tenant Admin */}
      <FormSection title="Initial Tenant Admin" withSeparator={false}>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">First Name <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="firstName" value={initialUserData.firstName} required placeholder="Rajesh" onChange={handleUserChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Middle Name <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="middleName" value={initialUserData.middleName} required placeholder="Kumar" onChange={handleUserChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Last Name <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="lastName" value={initialUserData.lastName} required placeholder="Sharma" onChange={handleUserChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Email <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="email" value={initialUserData.email} type="email" required placeholder="admin@company.com" onChange={handleUserChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Mobile No <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="mobileNo" value={initialUserData.mobileNo} required placeholder="98765 43210" onChange={handleUserChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
          <FieldLabel className="text-xs font-medium">Password <span className="text-red-500">*</span></FieldLabel>
          <div className="min-w-0">
            <Input name="passwordHash" value={initialUserData.passwordHash} type="password" required placeholder="••••••••••" onChange={handleUserChange} className="h-7 rounded-none px-2 text-xs" />
          </div>
        </div>
      </FormSection>

      <div className="flex justify-end gap-2 border-t border-slate-200 pt-4">
        <Button type="button" variant="outline" size="sm" className="h-7 px-3 text-xs" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>

        <Button type="submit" size="sm" disabled={loading} className={cn(`h-7 px-3 text-xs ${loading ? 'flex items-center justify-center gap-2 cursor-not-allowed' : 'cursor-pointer'}`)}>
          {loading ? <span className="flex items-center gap-2"><Loader2 className="h-3 w-3 animate-spin" />Creating...</span> : 'Create Tenant'}
        </Button>
      </div>
    </form>
  );
}