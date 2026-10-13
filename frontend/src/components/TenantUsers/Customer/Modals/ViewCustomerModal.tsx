import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import type { customerListType } from "@/Types/tenantCreateType"
import dayjs from "dayjs"
import { UserRound, Mail, Phone, MapPin } from "lucide-react"

type props = {
  customer: customerListType | null
  open: boolean
  onClose: () => void
}

const fullName = (customer: customerListType) =>
  [customer.firstName, customer.middleName, customer.lastName].filter(Boolean).join(" ")

export function ViewCustomerModal({ customer, open, onClose }: props) {
  if (!customer) return null

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-xl md:max-w-xl lg:max-w-2xl py-5"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <UserRound className="h-6 w-6 text-primary" />
            <div>
              <DialogTitle className="text-base">Customer Details</DialogTitle>
              <DialogDescription>
                Read-only customer record.
              </DialogDescription>
            </div>
          </div>
          <FieldGroup className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            <Field>
              <Label className="text-xs text-muted-foreground">
                Customer ID
              </Label>
              <span className="text-sm font-mono font-semibold">
                {customer.id}
              </span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Customer Code
              </Label>
              <span className="text-sm font-mono font-semibold">
                {customer.customerCode}
              </span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Status
              </Label>
              <span>
                <Badge variant={customer.isActive ? "success" : "destructive"}>
                  {customer.isActive ? "Active" : "Inactive"}
                </Badge>
              </span>
            </Field>
            <Field className="sm:col-span-2 lg:col-span-3">
              <Label className="text-xs text-muted-foreground">
                Name
              </Label>
              <span className="text-sm font-semibold">
                {customer.title ? `${customer.title} ` : ""}{fullName(customer)}
              </span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Email
              </Label>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm font-medium">{customer.email || "-"}</span>
              </div>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Mobile No
              </Label>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">{customer.mobileNo}</span>
              </div>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Alternate Mobile No
              </Label>
              <span className="text-sm font-medium">{customer.alternateMobileNo || "-"}</span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Date of Birth
              </Label>
              <span className="text-sm font-medium">
                {customer.dateOfBirth ? dayjs(customer.dateOfBirth).format("DD MMM YYYY") : "-"}
              </span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Labour Discount %
              </Label>
              <span className="text-sm font-medium">{customer.laborDiscountPercent}%</span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Part Discount %
              </Label>
              <span className="text-sm font-medium">{customer.partDiscountPercent}%</span>
            </Field>
            <Field className="sm:col-span-2 lg:col-span-3">
              <Label className="text-xs text-muted-foreground">
                Address Line 1
              </Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="text-sm font-medium">{customer.address1 || "-"}</span>
              </div>
            </Field>
            {customer.address2 && (
              <Field className="sm:col-span-2 lg:col-span-3">
                <Label className="text-xs text-muted-foreground">
                  Address Line 2
                </Label>
                <span className="text-sm font-medium">{customer.address2}</span>
              </Field>
            )}
            <Field>
              <Label className="text-xs text-muted-foreground">
                City
              </Label>
              <span className="text-sm font-medium">{customer.city || "-"}</span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                State
              </Label>
              <span className="text-sm font-medium">{customer.state || "-"}</span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Country
              </Label>
              <span className="text-sm font-medium">{customer.country || "-"}</span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Pincode
              </Label>
              <span className="text-sm font-mono font-medium">
                {customer.pincode || "-"}
              </span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Created By
              </Label>
              <span className="text-sm font-medium">
                {customer.authorizedByUser
                  ? `${customer.authorizedByUser.firstName} ${customer.authorizedByUser.lastName}`
                  : "-"}
              </span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Created At
              </Label>
              <span className="text-sm font-medium">
                {dayjs(customer.createdAt).format("DD MMM YYYY")}
              </span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Updated At
              </Label>
              <span className="text-sm font-medium">
                {dayjs(customer.updatedAt).format("DD MMM YYYY")}
              </span>
            </Field>
          </FieldGroup>
        </DialogHeader>
        <DialogFooter className="mt-0">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}