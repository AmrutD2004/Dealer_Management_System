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
import type { labourListType } from "@/Types/tenantCreateType"
import dayjs from "dayjs"
import { Clock, FileText, HardHat, IndianRupee } from "lucide-react"

type props = {
  labour: labourListType | null
  open: boolean
  onClose: () => void
}

export function ViewLabourModal({ labour, open, onClose }: props) {
  if (!labour) return null

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-xl md:max-w-xl lg:max-w-2xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <HardHat className="h-8 w-8 text-primary" />
            <div>
              <DialogTitle className="text-lg">Labour Details</DialogTitle>
              <DialogDescription>
                Read-only view of the labour record.
              </DialogDescription>
            </div>
          </div>
          <FieldGroup className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Labour ID
              </Label>
              <span className="text-md font-mono font-semibold">
                {labour.id}
              </span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Labour Code
              </Label>
              <span className="text-md font-mono font-semibold">
                {labour.labourCode}
              </span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Status
              </Label>
              <span>
                <Badge variant={labour.isActive ? "success" : "destructive"}>
                  {labour.isActive ? "Active" : "Inactive"}
                </Badge>
              </span>
            </Field>
            <Field className="sm:col-span-2 lg:col-span-3">
              <Label className="text-sm font-medium text-muted-foreground">
                Labour Name
              </Label>
              <span className="text-md font-semibold">{labour.labourName}</span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Rate
              </Label>
              <div className="flex items-center gap-1">
                <IndianRupee className="h-4 w-4 text-muted-foreground" />
                <span className="text-md font-medium">{String(labour.rate ?? "—")}</span>
              </div>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Standard Hours
              </Label>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-md font-medium">{String(labour.standardHours ?? "—")}</span>
              </div>
            </Field>
            <Field className="sm:col-span-2 lg:col-span-3">
              <Label className="text-sm font-medium text-muted-foreground">
                Description
              </Label>
              <div className="flex items-start gap-2">
                <FileText className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-md font-medium">
                  {labour.labourDescription || "—"}
                </span>
              </div>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Created At
              </Label>
              <span className="text-md font-medium">
                {dayjs(labour.createdAt).format("DD MMM YYYY")}
              </span>
            </Field>
            <Field>
              <Label className="text-sm font-medium text-muted-foreground">
                Updated At
              </Label>
              <span className="text-md font-medium">
                {dayjs(labour.updatedAt).format("DD MMM YYYY")}
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
