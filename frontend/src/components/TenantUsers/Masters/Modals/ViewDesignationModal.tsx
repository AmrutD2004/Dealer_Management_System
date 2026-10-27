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
import type { designationListType } from "@/Types/tenantCreateType"
import dayjs from "dayjs"
import { Briefcase, FileText } from "lucide-react"

type props = {
  designation: designationListType | null
  open: boolean
  onClose: () => void
}

export function ViewDesignationModal({ designation, open, onClose }: props) {
  if (!designation) return null

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-xl md:max-w-xl lg:max-w-2xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Briefcase className="h-8 w-8 text-primary" />
            <div>
              <DialogTitle className="text-lg">Designation Details</DialogTitle>
              <DialogDescription>
                Read-only view of the designation record.
              </DialogDescription>
            </div>
          </div>
          <div className="space-y-4 py-3"><div><div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Details</h3></div><div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Designation ID
              </Label>
              <span className="text-xs font-mono font-semibold">
                {designation.id}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Designation Code
              </Label>
              <span className="text-xs font-mono font-semibold">
                {designation.code}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Status
              </Label>
              <span>
                <Badge variant={designation.isActive ? "success" : "destructive"}>
                  {designation.isActive ? "Active" : "Inactive"}
                </Badge>
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Designation Name
              </Label>
              <span className="text-xs font-medium">{designation.name}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Description
              </Label>
              <div className="flex items-start gap-2">
                <FileText className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-xs font-medium">
                  {designation.description || "—"}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Mechanic Designation
              </Label>
              <span>
                <Badge variant={designation.isMechanic ? "default" : "outline"}>
                  {designation.isMechanic ? "Yes" : "No"}
                </Badge>
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Created At
              </Label>
              <span className="text-xs font-medium">
                {dayjs(designation.createdAt).format("DD MMM YYYY")}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Updated At
              </Label>
              <span className="text-xs font-medium">
                {dayjs(designation.updatedAt).format("DD MMM YYYY")}
              </span>
            </div>
          </div></div></div>
        </DialogHeader>
        <DialogFooter>
          <Button size="sm" onClick={onClose} variant="outline" className="h-7 px-3 text-xs">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
