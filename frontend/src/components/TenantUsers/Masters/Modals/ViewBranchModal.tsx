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
import type { branchListType } from "@/Types/tenantCreateType"
import dayjs from "dayjs"
import { Store, Mail, Phone, MapPin } from "lucide-react"

type props = {
  branch: branchListType | null
  open: boolean
  onClose: () => void
}

export function ViewBranchModal({ branch, open, onClose }: props) {
  if (!branch) return null

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-xl md:max-w-xl lg:max-w-2xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Store className="h-8 w-8 text-primary" />
            <div>
              <DialogTitle className="text-lg">Branch Details</DialogTitle>
              <DialogDescription>
                Read-only view of the branch record.
              </DialogDescription>
            </div>
          </div>
          <FieldGroup className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Branch ID
              </Label>
              <span className="text-md font-mono font-semibold">
                {branch.id}
              </span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Branch Code
              </Label>
              <span className="text-md font-mono font-semibold">
                {branch.branchCode}
              </span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Status
              </Label>
              <span>
                <Badge variant={branch.isActive ? "success" : "destructive"}>
                  {branch.isActive ? "Active" : "Inactive"}
                </Badge>
              </span>
            </Field>
            <Field className="sm:col-span-2 lg:col-span-3">
              <Label className="text-sm font-medium text-muted-foreground">
                Branch Name
              </Label>
              <span className="text-md font-semibold">{branch.branchName}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Email
              </Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-md font-medium">{branch.email}</span>
              </div>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Phone
              </Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-md font-medium">{branch.phone}</span>
              </div>
            </Field>
            <Field className="sm:col-span-2 lg:col-span-3">
              <Label className="text-sm font-medium text-muted-foreground">
                Address Line 1
              </Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-md font-medium">{branch.address1}</span>
              </div>
            </Field>
            {branch.address2 && (
              <Field className="sm:col-span-2 lg:col-span-3">
                <Label className="text-sm font-medium text-muted-foreground">
                  Address Line 2
                </Label>
                <span className="text-md font-medium">{branch.address2}</span>
              </Field>
            )}
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Locality
              </Label>
              <span className="text-md font-medium">{branch.locality}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                City
              </Label>
              <span className="text-md font-medium">{branch.city}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                State
              </Label>
              <span className="text-md font-medium">{branch.state}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Country
              </Label>
              <span className="text-md font-medium">{branch.country}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Pincode
              </Label>
              <span className="text-md font-mono font-medium">
                {branch.pincode}
              </span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Created At
              </Label>
              <span className="text-md font-medium">
                {dayjs(branch.createdAt).format("DD MMM YYYY")}
              </span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Updated At
              </Label>
              <span className="text-md font-medium">
                {dayjs(branch.updatedAt).format("DD MMM YYYY")}
              </span>
            </Field>
          </FieldGroup>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
