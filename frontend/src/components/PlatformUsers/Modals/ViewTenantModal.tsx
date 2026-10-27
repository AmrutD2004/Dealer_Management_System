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

const Detail = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
    <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
    <span className="text-xs font-medium">{value}</span>
  </div>
)

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
        </DialogHeader>
        <div className="space-y-4 py-3">
          <div>
            <div className="mb-2 bg-muted/40 px-2 py-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Tenant Identity</h3>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
              <Detail label="Tenant ID" value={<span className="font-mono">{tenant.id}</span>} />
              <Detail label="Tenant Code" value={<span className="font-mono">{tenant.tenantCode}</span>} />
              <Detail label="Status" value={<Badge variant={tenant.isActive ? "success" : "destructive"}>{tenant.isActive ? "Active" : "Inactive"}</Badge>} />
              <Detail label="Tenant Name" value={tenant.tenantName} />
            </div>
          </div>

          <div>
            <div className="mb-2 bg-muted/40 px-2 py-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Contact Information</h3>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
              <Detail label="Email" value={<span className="flex items-center gap-2"><Mail className="h-3 w-3 text-muted-foreground" />{tenant.email}</span>} />
              <Detail label="Phone" value={<span className="flex items-center gap-2"><Phone className="h-3 w-3 text-muted-foreground" />{tenant.phone}</span>} />
              <Detail label="GST Number" value={<span className="font-mono">{tenant.gstNumber}</span>} />
              <Detail label="Address" value={<span className="flex items-center gap-2"><MapPin className="h-3 w-3 text-muted-foreground" />{tenant.address}, {tenant.city}, {tenant.state}, {tenant.country} - {tenant.pincode}</span>} />
            </div>
          </div>

          <div>
            <div className="mb-2 bg-muted/40 px-2 py-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Subscription</h3>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
              <Detail label="Plan" value={<Badge variant="outline"><CreditCard className="mr-1 h-3 w-3" />{tenant.subscriptionPlan}</Badge>} />
              <Detail label="Status" value={<Badge variant={getStatusBadgeVariant(tenant.subscriptionStatus)}>{tenant.subscriptionStatus}</Badge>} />
              <Detail label="Created At" value={dayjs(tenant.createdAt).format('DD MMM YYYY')} />
              <Detail label="Updated At" value={dayjs(tenant.updatedAt).format('DD MMM YYYY')} />
              <Detail label="Created By" value={tenant.createdByUser?.email || `User ID: ${tenant.createdBy}`} />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleClose} variant="outline" size="sm" className="h-7 px-3 text-xs">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}