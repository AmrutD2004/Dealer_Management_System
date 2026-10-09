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
import type { roleListType } from "@/Types/tenantCreateType"
import dayjs from "dayjs"
import { FileText, ShieldCheck } from "lucide-react"

type props = {
  role: roleListType | null
  open: boolean
  onClose: () => void
}

export function ViewRoleModal({ role, open, onClose }: props) {
  if (!role) return null

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-xl md:max-w-xl lg:max-w-2xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-8 w-8 text-primary" />
            <div>
              <DialogTitle className="text-lg">Role Details</DialogTitle>
              <DialogDescription>
                Read-only view of the role record.
              </DialogDescription>
            </div>
          </div>
          <FieldGroup className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Role ID
              </Label>
              <span className="text-md font-mono font-semibold">
                {role.id}
              </span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Role Code
              </Label>
              <span className="text-md font-mono font-semibold">
                {role.roleCode}
              </span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Status
              </Label>
              <span>
                <Badge variant={role.isActive ? "success" : "destructive"}>
                  {role.isActive ? "Active" : "Inactive"}
                </Badge>
              </span>
            </Field>
            <Field className="sm:col-span-2 lg:col-span-3">
              <Label className="text-sm font-medium text-muted-foreground">
                Role Name
              </Label>
              <span className="text-md font-semibold">{role.roleName}</span>
            </Field>
            <Field className="sm:col-span-2 lg:col-span-3">
              <Label className="text-sm font-medium text-muted-foreground">
                Description
              </Label>
              <div className="flex items-start gap-2">
                <FileText className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-md font-medium">
                  {role.roleDescription || "—"}
                </span>
              </div>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                System Role
              </Label>
              <span>
                <Badge variant={role.isSystemRole ? "default" : "outline"}>
                  {role.isSystemRole ? "Yes" : "No"}
                </Badge>
              </span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Created At
              </Label>
              <span className="text-md font-medium">
                {dayjs(role.createdAt).format("DD MMM YYYY")}
              </span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Updated At
              </Label>
              <span className="text-md font-medium">
                {dayjs(role.updatedAt).format("DD MMM YYYY")}
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
