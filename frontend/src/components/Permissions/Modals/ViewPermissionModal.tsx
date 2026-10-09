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
import type { PermissionListType } from "@/Types/permissionType"
import dayjs from "dayjs"
import { KeyRound } from "lucide-react"
import { useContext } from "react"
import { PlatformUserContext } from "@/Contexts/PlatformUserContext.tsx/PlatformUserContext"

type props = {
  permission: PermissionListType | null,
  open: boolean,
  onClose: () => void
}

export function ViewPermissionModal({ permission, open, onClose }: props) {
  const { closeAllPermissionModals } = useContext(PlatformUserContext)

  const handleClose = () => {
    closeAllPermissionModals()
    onClose()
  }

  if (!permission) return null

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm lg:max-w-3xl md:max-w-xl" showCloseButton={false}>
        <DialogHeader>
          <div className="flex items-center gap-3">
            <KeyRound className="h-8 w-8 text-primary" />
            <div>
              <DialogTitle className="text-lg">Permission Details</DialogTitle>
              <DialogDescription>
                Read-only view of the permission record.
              </DialogDescription>
            </div>
          </div>
          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">Permission ID</Label>
              <span className="text-md font-semibold font-mono">{permission.id}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">Permission Code</Label>
              <span className="text-md font-semibold font-mono">{permission.permissionCode}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">Status</Label>
              <span>
                <Badge variant={permission.isActive ? "success" : "destructive"}>
                  {permission.isActive ? "Active" : "Inactive"}
                </Badge>
              </span>
            </Field>
            <Field className="sm:col-span-2 lg:col-span-3">
              <Label className="text-sm font-medium text-muted-foreground">Permission Name</Label>
              <span className="text-md font-semibold">{permission.permissionName}</span>
            </Field>
            <Field className="sm:col-span-2 lg:col-span-3">
              <Label className="text-sm font-medium text-muted-foreground">Description</Label>
              <span className="text-md font-medium">{permission.description || "—"}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
              <span className="text-md font-medium">{dayjs(permission.createdAt).format('DD MMM YYYY')}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">Updated At</Label>
              <span className="text-md font-medium">{dayjs(permission.updatedAt).format('DD MMM YYYY')}</span>
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
