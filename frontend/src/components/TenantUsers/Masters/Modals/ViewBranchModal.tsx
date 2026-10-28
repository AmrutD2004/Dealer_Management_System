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
          <div className="space-y-4 py-3"><div><div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Details</h3></div><div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Branch ID
              </Label>
              <span className="text-xs font-mono font-semibold">
                {branch.id}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Branch Code
              </Label>
              <span className="text-xs font-mono font-semibold">
                {branch.branchCode}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Status
              </Label>
              <span>
                <Badge variant={branch.isActive ? "success" : "destructive"}>
                  {branch.isActive ? "Active" : "Inactive"}
                </Badge>
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Branch Name
              </Label>
              <span className="text-xs font-medium">{branch.branchName}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Email
              </Label>
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium">{branch.email}</span>
              </div>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Phone
              </Label>
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium">{branch.phone}</span>
              </div>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Address Line 1
              </Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs font-medium">{branch.address1}</span>
              </div>
            </div>
            {branch.address2 && (
              <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                <Label className="text-xs font-medium text-muted-foreground">
                  Address Line 2
                </Label>
                <span className="text-xs font-medium">{branch.address2}</span>
              </div>
            )}
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Locality
              </Label>
              <span className="text-xs font-medium">{branch.locality}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                City
              </Label>
              <span className="text-xs font-medium">{branch.city}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                State
              </Label>
              <span className="text-xs font-medium">{branch.state}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Country
              </Label>
              <span className="text-xs font-medium">{branch.country}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Pincode
              </Label>
              <span className="text-xs font-mono font-medium">
                {branch.pincode}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Created At
              </Label>
              <span className="text-xs font-medium">
                {dayjs(branch.createdAt).format("DD MMM YYYY")}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Updated At
              </Label>
              <span className="text-xs font-medium">
                {dayjs(branch.updatedAt).format("DD MMM YYYY")}
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
