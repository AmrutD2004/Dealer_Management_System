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
import type { tenantDetailType } from "@/Types/tenantCreateType"
import dayjs from "dayjs"
import { Building2, Mail, Phone, MapPin, CreditCard } from "lucide-react"
import { useContext } from "react"
import { PlatformUserContext } from "@/Contexts/PlatformUserContext.tsx/PlatformUserContext"

type props = {
  tenant: tenantDetailType | null,
  open: boolean,
  onClose: () => void
}

export function ViewTenantModal({ tenant, open, onClose }: props) {
  const { closeAllModals } = useContext(PlatformUserContext)

  const handleClose = () => {
    closeAllModals()
    onClose()
  }

  if (!tenant) return null

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "success"
      case "SUSPENDED":
        return "destructive"
      case "TRIAL":
        return "default"
      case "EXPIRED":
      case "CANCELLED":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm lg:max-w-3xl md:max-w-xl" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-primary" />
            <div>
              <DialogTitle className="text-lg">Tenant Details</DialogTitle>
              <DialogDescription>
                Read-only view of the tenant organization record.
              </DialogDescription>
            </div>
          </div>
          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">Tenant ID</Label>
              <span className="text-md font-semibold font-mono">{tenant.id}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">Tenant Code</Label>
              <span className="text-md font-semibold font-mono">{tenant.tenantCode}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <span>
                <Badge variant={tenant.isActive ? "success" : "destructive"}>
                  {tenant.isActive ? "Active" : "Inactive"}
                </Badge>
              </span>
            </Field>
            <Field className="sm:col-span-2 lg:col-span-3">
              <Label className="text-sm font-medium text-muted-foreground">Tenant Name</Label>
              <span className="text-md font-semibold">{tenant.tenantName}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">Email</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-md font-medium">{tenant.email}</span>
              </div>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-md font-medium">{tenant.phone}</span>
              </div>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">GST Number</Label>
              <span className="text-md font-medium font-mono text-sm">{tenant.gstNumber}</span>
            </Field>
            <Field className="sm:col-span-2 lg:col-span-3">
              <Label className="text-sm font-medium text-muted-foreground">Address</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-md font-medium">
                  {tenant.address}, {tenant.city}, {tenant.state}, {tenant.country} - {tenant.pincode}
                </span>
              </div>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">Subscription Plan</Label>
              <span>
                <Badge variant="outline">
                  <CreditCard className="mr-1 h-3 w-3" />
                  {tenant.subscriptionPlan}
                </Badge>
              </span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">Subscription Status</Label>
              <span>
                <Badge variant={getStatusBadgeVariant(tenant.subscriptionStatus)}>
                  {tenant.subscriptionStatus}
                </Badge>
              </span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
              <span className="text-md font-medium">{dayjs(tenant.createdAt).format('DD MMM YYYY')}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">Updated At</Label>
              <span className="text-md font-medium">{dayjs(tenant.updatedAt).format('DD MMM YYYY')}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">Created By</Label>
              <span className="text-md font-medium">
                {tenant.createdByUser?.email || `User ID: ${tenant.createdBy}`}
              </span>
            </Field>
          </FieldGroup>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={handleClose} variant="outline">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}