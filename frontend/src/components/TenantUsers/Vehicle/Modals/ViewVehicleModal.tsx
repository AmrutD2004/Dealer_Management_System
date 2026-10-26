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
          <FieldGroup className="mt-3 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
            <Field>
              <Label className="text-xs text-muted-foreground">
                Vehicle ID
              </Label>
              <span className="text-sm font-mono font-semibold">
                {vehicle.id}
              </span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Vehicle Number
              </Label>
              <span className="text-sm font-semibold">
                {vehicle.vehicleNumber}
              </span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Status
              </Label>
              <span>
                <Badge variant={vehicle.isActive ? "success" : "destructive"}>
                  {vehicle.isActive ? "Active" : "Inactive"}
                </Badge>
              </span>
            </Field>
            <Field className="sm:col-span-2 lg:col-span-3">
              <Label className="text-xs text-muted-foreground">
                Customer
              </Label>
              <div className="flex items-center gap-2">
                <UserRound className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <span className="text-sm font-semibold">
                  {vehicle.customer ? `${vehicle.customer.firstName} ${vehicle.customer.lastName}` : '-'}
                </span>
              </div>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Chassis Number
              </Label>
              <span className="text-sm font-medium">{vehicle.chassisNumber}</span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Engine Number
              </Label>
              <span className="text-sm font-medium">{vehicle.engineNumber}</span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Manufacturer
              </Label>
              <span className="text-sm font-medium">{vehicle.brand.brandName || '-'}</span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Model
              </Label>
              <span className="text-sm font-medium">{vehicle.model.modelName || '-'}</span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Variant
              </Label>
              <span className="text-sm font-medium">{vehicle.variant.variantName || '-'}</span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Color
              </Label>
              <span className="text-sm font-medium">{vehicle.color || '-'}</span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Fuel Type
              </Label>
              <span className="text-sm font-medium">{vehicle.variant.fuelType ||  '-'}</span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Transmission Type
              </Label>
              <span className="text-sm font-medium">{vehicle.variant.transmissionType || '-'}</span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Manufacturing Year
              </Label>
              <span className="text-sm font-medium">{vehicle.manufacturingYear || '-'}</span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Registration Date
              </Label>
              <span className="text-sm font-medium">
                {vehicle.registrationDate ? dayjs(vehicle.registrationDate).format("DD MMM YYYY") : "-"}
              </span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Purchase Date
              </Label>
              <span className="text-sm font-medium">
                {vehicle.purchaseDate ? dayjs(vehicle.purchaseDate).format("DD MMM YYYY") : "-"}
              </span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Current Odometer Reading
              </Label>
              <span className="text-sm font-medium">{vehicle.currentOdometerReading ?? '-'}</span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Created By
              </Label>
              <span className="text-sm font-medium">
                {vehicle.authorizedByUser ? `${vehicle.authorizedByUser.firstName} ${vehicle.authorizedByUser.lastName}` : "-"}
              </span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Created At
              </Label>
              <span className="text-sm font-medium">
                {dayjs(vehicle.createdAt).format("DD MMM YYYY")}
              </span>
            </Field>
            <Field>
              <Label className="text-xs text-muted-foreground">
                Updated At
              </Label>
              <span className="text-sm font-medium">
                {dayjs(vehicle.updatedAt).format("DD MMM YYYY")}
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