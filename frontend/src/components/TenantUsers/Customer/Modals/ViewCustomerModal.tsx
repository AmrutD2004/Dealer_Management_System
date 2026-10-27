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
          <div className="space-y-4 py-3"><div><div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Details</h3></div><div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Customer ID
              </Label>
              <span className="text-xs font-medium font-mono">
                {customer.id}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Customer Code
              </Label>
              <span className="text-xs font-medium font-mono">
                {customer.customerCode}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Status
              </Label>
              <span>
                <Badge variant={customer.isActive ? "success" : "destructive"}>
                  {customer.isActive ? "Active" : "Inactive"}
                </Badge>
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Name
              </Label>
              <span className="text-xs font-medium">
                {customer.title ? `${customer.title} ` : ""}{fullName(customer)}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Email
              </Label>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm font-medium">{customer.email || "-"}</span>
              </div>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Mobile No
              </Label>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 shrink-0 text-muted-foreground" />
                <span className="text-xs font-medium">{customer.mobileNo}</span>
              </div>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Alternate Mobile No
              </Label>
              <span className="text-xs font-medium">{customer.alternateMobileNo || "-"}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Date of Birth
              </Label>
              <span className="text-xs font-medium">
                {customer.dateOfBirth ? dayjs(customer.dateOfBirth).format("DD MMM YYYY") : "-"}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Labour Discount %
              </Label>
              <span className="text-xs font-medium">{customer.laborDiscountPercent}%</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Part Discount %
              </Label>
              <span className="text-xs font-medium">{customer.partDiscountPercent}%</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Address Line 1
              </Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 shrink-0 text-muted-foreground" />
                <span className="text-xs font-medium">{customer.address1 || "-"}</span>
              </div>
            </div>
            {customer.address2 && (
              <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Address Line 2
                </Label>
                <span className="text-xs font-medium">{customer.address2}</span>
              </div>
            )}
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                City
              </Label>
              <span className="text-xs font-medium">{customer.city || "-"}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                State
              </Label>
              <span className="text-xs font-medium">{customer.state || "-"}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Country
              </Label>
              <span className="text-xs font-medium">{customer.country || "-"}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Pincode
              </Label>
              <span className="text-sm font-mono font-medium">
                {customer.pincode || "-"}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Created By
              </Label>
              <span className="text-xs font-medium">
                {customer.authorizedByUser
                  ? `${customer.authorizedByUser.firstName} ${customer.authorizedByUser.lastName}`
                  : "-"}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Created At
              </Label>
              <span className="text-xs font-medium">
                {dayjs(customer.createdAt).format("DD MMM YYYY")}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Updated At
              </Label>
              <span className="text-xs font-medium">
                {dayjs(customer.updatedAt).format("DD MMM YYYY")}
              </span>
            </div>
          </div></div></div>
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