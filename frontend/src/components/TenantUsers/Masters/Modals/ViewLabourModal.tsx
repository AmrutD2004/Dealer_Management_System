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
          <div className="space-y-4 py-3"><div><div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Details</h3></div><div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Labour ID
              </Label>
              <span className="text-xs font-mono font-semibold">
                {labour.id}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Labour Code
              </Label>
              <span className="text-xs font-mono font-semibold">
                {labour.labourCode}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Status
              </Label>
              <span>
                <Badge variant={labour.isActive ? "success" : "destructive"}>
                  {labour.isActive ? "Active" : "Inactive"}
                </Badge>
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Labour Name
              </Label>
              <span className="text-xs font-medium">{labour.labourName}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Rate
              </Label>
              <div className="flex items-center gap-1">
                <IndianRupee className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium">{String(labour.rate ?? "—")}</span>
              </div>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Standard Hours
              </Label>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium">{String(labour.standardHours ?? "—")}</span>
              </div>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Description
              </Label>
              <div className="flex items-start gap-2">
                <FileText className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-xs font-medium">
                  {labour.labourDescription || "—"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Created At
              </Label>
              <span className="text-xs font-medium">
                {dayjs(labour.createdAt).format("DD MMM YYYY")}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Updated At
              </Label>
              <span className="text-xs font-medium">
                {dayjs(labour.updatedAt).format("DD MMM YYYY")}
              </span>
            </div>
          </div></div></div>
        </DialogHeader>
        <DialogFooter>
          <Button  onClick={onClose} variant="outline" >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
