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
import dayjs from "dayjs"
import { Car, UserRound } from "lucide-react"

type props = {
  vehicle: any | null
  open: boolean
  onClose: () => void
}

export function ViewVehicleModal({ vehicle, open, onClose }: props) {
  if (!vehicle) return null

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-xl md:max-w-xl lg:max-w-2xl py-5"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Car className="h-6 w-6 text-primary" />
            <div>
              <DialogTitle className="text-base">Vehicle Details</DialogTitle>
              <DialogDescription>
                Read-only vehicle record.
              </DialogDescription>
            </div>
          </div>
          <div className="space-y-4 py-3"><div><div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Details</h3></div><div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Vehicle ID
              </Label>
              <span className="text-xs font-medium font-mono">
                {vehicle.id}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Vehicle Number
              </Label>
              <span className="text-xs font-medium">
                {vehicle.vehicleNumber}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Status
              </Label>
              <span>
                <Badge variant={vehicle.isActive ? "success" : "destructive"}>
                  {vehicle.isActive ? "Active" : "Inactive"}
                </Badge>
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Customer
              </Label>
              <div className="flex items-center gap-2">
                <UserRound className="h-3 w-3 shrink-0 text-muted-foreground" />
                <span className="text-xs font-medium">
                  {vehicle.customer ? `${vehicle.customer.firstName} ${vehicle.customer.lastName}` : '-'}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Chassis Number
              </Label>
              <span className="text-xs font-medium">{vehicle.chassisNumber}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Engine Number
              </Label>
              <span className="text-xs font-medium">{vehicle.engineNumber}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Manufacturer
              </Label>
              <span className="text-xs font-medium">{vehicle.brand.brandName || '-'}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Model
              </Label>
              <span className="text-xs font-medium">{vehicle.model.modelName || '-'}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Variant
              </Label>
              <span className="text-xs font-medium">{vehicle.variant.variantName || '-'}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Color
              </Label>
              <span className="text-xs font-medium">{vehicle.color || '-'}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Fuel Type
              </Label>
              <span className="text-xs font-medium">{vehicle.variant.fuelType ||  '-'}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Transmission Type
              </Label>
              <span className="text-xs font-medium">{vehicle.variant.transmissionType || '-'}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Manufacturing Year
              </Label>
              <span className="text-xs font-medium">{vehicle.manufacturingYear || '-'}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Registration Date
              </Label>
              <span className="text-xs font-medium">
                {vehicle.registrationDate ? dayjs(vehicle.registrationDate).format("DD MMM YYYY") : "-"}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Purchase Date
              </Label>
              <span className="text-xs font-medium">
                {vehicle.purchaseDate ? dayjs(vehicle.purchaseDate).format("DD MMM YYYY") : "-"}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Current Odometer Reading
              </Label>
              <span className="text-xs font-medium">{vehicle.currentOdometerReading ?? '-'}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Created By
              </Label>
              <span className="text-xs font-medium">
                {vehicle.authorizedByUser ? `${vehicle.authorizedByUser.firstName} ${vehicle.authorizedByUser.lastName}` : "-"}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Created At
              </Label>
              <span className="text-xs font-medium">
                {dayjs(vehicle.createdAt).format("DD MMM YYYY")}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Updated At
              </Label>
              <span className="text-xs font-medium">
                {dayjs(vehicle.updatedAt).format("DD MMM YYYY")}
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