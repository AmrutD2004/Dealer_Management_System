import { useState } from "react";

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
import { asChoice, emptyTenantForm, isTenantDraftValid } from "./helpers";

import type {
  Branch,
  SubscriptionPlan,
  SubscriptionStatus,
  TenantAdmin,
  TenantDraft,
} from "./types";

const toActiveStatus = (value: string | null): boolean => value === "ACTIVE";

interface TenantCreateFormProps {
  onSubmit: (draft: TenantDraft) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function TenantCreateForm({
  onSubmit,
  onCancel,
  isSubmitting = false,
}: TenantCreateFormProps) {
  const [draft, setDraft] = useState<TenantDraft>(emptyTenantForm);

  const update = <K extends keyof TenantDraft>(
    key: K,
    value: TenantDraft[K],
  ) => {
    setDraft((previous) => ({ ...previous, [key]: value }));
  };

  const updateBranch = <K extends keyof Branch>(key: K, value: Branch[K]) => {
    setDraft((previous) => ({
      ...previous,
      branch: { ...previous.branch, [key]: value },
    }));
  };

  const updateAdmin = <K extends keyof TenantAdmin>(
    key: K,
    value: TenantAdmin[K],
  ) => {
    setDraft((previous) => ({
      ...previous,
      admin: { ...previous.admin, [key]: value },
    }));
  };

  const isValid = isTenantDraftValid(draft);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValid || isSubmitting) {
      return;
    }

    onSubmit(draft);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tenant Details */}

      <FormSection title="Tenant Details" withSeparator={false}>
        <Field label="Tenant Name *" className="sm:col-span-2">
          <Input
            name="tenantName"
            placeholder="ABC Motors Pvt Ltd"
            value={draft.tenantName}
            onChange={(event) => update("tenantName", event.target.value)}
          />
        </Field>

        <Field label="Tenant Code">
          <Input
            name="tenantCode"
            placeholder="TEN-007"
            value={draft.tenantCode}
            onChange={(event) => update("tenantCode", event.target.value)}
          />
        </Field>

        <Field label="Email *">
          <Input
            name="email"
            type="email"
            placeholder="admin@company.com"
            value={draft.email}
            onChange={(event) => update("email", event.target.value)}
          />
        </Field>

        <Field label="Phone">
          <Input
            name="phone"
            placeholder="98765 43210"
            value={draft.phone}
            onChange={(event) => update("phone", event.target.value)}
          />
        </Field>

        <Field label="GST Number *">
          <Input
            name="gstNumber"
            placeholder="27AAECA1234A1Z5"
            value={draft.gstNumber}
            onChange={(event) => update("gstNumber", event.target.value)}
          />
        </Field>

        <Field label="Address" className="sm:col-span-2">
          <Textarea
            name="address"
            placeholder="Business address"
            value={draft.address}
            onChange={(event) => update("address", event.target.value)}
          />
        </Field>

        <Field label="City">
          <Input
            name="city"
            placeholder="Pune"
            value={draft.city}
            onChange={(event) => update("city", event.target.value)}
          />
        </Field>

        <Field label="State">
          <Input
            name="state"
            placeholder="Maharashtra"
            value={draft.state}
            onChange={(event) => update("state", event.target.value)}
          />
        </Field>

        <Field label="Country">
          <Input
            name="country"
            placeholder="India"
            value={draft.country}
            onChange={(event) => update("country", event.target.value)}
          />
        </Field>

        <Field label="Pincode">
          <Input
            name="pincode"
            placeholder="411001"
            value={draft.pincode}
            onChange={(event) => update("pincode", event.target.value)}
          />
        </Field>
      </FormSection>

      {/* Subscription */}

      <FormSection title="Subscription">
        <Field label="Subscription Plan">
          <Select
            value={draft.plan}
            onValueChange={(value) =>
              update("plan", asChoice<SubscriptionPlan>(value, "BASIC"))
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="BASIC">Basic</SelectItem>

              <SelectItem value="PRO">Pro</SelectItem>

              <SelectItem value="PREMIUM">Premium</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field label="Subscription Status">
          <Select
            value={draft.subscriptionStatus}
            onValueChange={(value) =>
              update(
                "subscriptionStatus",
                asChoice<SubscriptionStatus>(value, "TRIAL"),
              )
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
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

        <Field label="Tenant Status">
          <Select
            value={draft.isActive ? "ACTIVE" : "INACTIVE"}
            onValueChange={(value) => update("isActive", toActiveStatus(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>

              <SelectItem value="INACTIVE">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </Field>
      </FormSection>

      {/* Initial Branch */}

      <FormSection title="Initial Branch">
        <Field label="Branch Code *">
          <Input
            name="branchCode"
            placeholder="BR-001"
            value={draft.branch.branchCode}
            onChange={(event) => updateBranch("branchCode", event.target.value)}
          />
        </Field>

        <Field label="Branch Name *">
          <Input
            name="branchName"
            placeholder="Pune Main Branch"
            value={draft.branch.branchName}
            onChange={(event) => updateBranch("branchName", event.target.value)}
          />
        </Field>

        <Field label="Email">
          <Input
            name="branchEmail"
            type="email"
            placeholder="branch@company.com"
            value={draft.branch.email}
            onChange={(event) => updateBranch("email", event.target.value)}
          />
        </Field>

        <Field label="Phone">
          <Input
            name="branchPhone"
            placeholder="98765 43210"
            value={draft.branch.phone}
            onChange={(event) => updateBranch("phone", event.target.value)}
          />
        </Field>

        <Field label="Address" className="sm:col-span-2">
          <Textarea
            name="branchAddress"
            placeholder="Branch address"
            value={draft.branch.address}
            onChange={(event) => updateBranch("address", event.target.value)}
          />
        </Field>

        <Field label="Locality">
          <Input
            name="branchLocality"
            placeholder="Kothrud"
            value={draft.branch.locality}
            onChange={(event) => updateBranch("locality", event.target.value)}
          />
        </Field>

        <Field label="City">
          <Input
            name="branchCity"
            placeholder="Pune"
            value={draft.branch.city}
            onChange={(event) => updateBranch("city", event.target.value)}
          />
        </Field>

        <Field label="State">
          <Input
            name="branchState"
            placeholder="Maharashtra"
            value={draft.branch.state}
            onChange={(event) => updateBranch("state", event.target.value)}
          />
        </Field>

        <Field label="Country">
          <Input
            name="branchCountry"
            placeholder="India"
            value={draft.branch.country}
            onChange={(event) => updateBranch("country", event.target.value)}
          />
        </Field>

        <Field label="Pincode">
          <Input
            name="branchPincode"
            placeholder="411038"
            value={draft.branch.pincode}
            onChange={(event) => updateBranch("pincode", event.target.value)}
          />
        </Field>
      </FormSection>

      {/* Initial Tenant Admin */}

      <FormSection title="Initial Tenant Admin" withSeparator={false}>
        <Field label="Employee Code *">
          <Input
            name="employeeCode"
            placeholder="EMP-001"
            value={draft.admin.employeeCode}
            onChange={(event) =>
              updateAdmin("employeeCode", event.target.value)
            }
          />
        </Field>

        <Field label="First Name">
          <Input
            name="firstName"
            placeholder="Rajesh"
            value={draft.admin.firstName}
            onChange={(event) => updateAdmin("firstName", event.target.value)}
          />
        </Field>

        <Field label="Middle Name">
          <Input
            name="middleName"
            placeholder="Kumar"
            value={draft.admin.middleName}
            onChange={(event) => updateAdmin("middleName", event.target.value)}
          />
        </Field>

        <Field label="Last Name">
          <Input
            name="lastName"
            placeholder="Sharma"
            value={draft.admin.lastName}
            onChange={(event) => updateAdmin("lastName", event.target.value)}
          />
        </Field>

        <Field label="Email *">
          <Input
            name="adminEmail"
            type="email"
            placeholder="admin@company.com"
            value={draft.admin.email}
            onChange={(event) => updateAdmin("email", event.target.value)}
          />
        </Field>

        <Field label="Mobile No *">
          <Input
            name="mobileNo"
            placeholder="98765 43210"
            value={draft.admin.mobileNo}
            onChange={(event) => updateAdmin("mobileNo", event.target.value)}
          />
        </Field>

        <Field label="Password *" className="sm:col-span-2">
          <Input
            name="password"
            type="password"
            placeholder="••••••••••"
            value={draft.admin.password}
            onChange={(event) => updateAdmin("password", event.target.value)}
          />
        </Field>
      </FormSection>

      <div className="flex justify-end gap-3 border-t border-slate-200 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button type="submit" disabled={!isValid || isSubmitting}>
          Create Tenant
        </Button>
      </div>
    </form>
  );
}
