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
import type { storageListType } from "@/Types/tenantCreateType"
import { Folder } from "lucide-react"

type props = {
  storage: storageListType | null
  open: boolean
  onClose: () => void
}

export function ViewStorageModal({ storage, open, onClose }: props) {
  if (!storage) return null

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-xl md:max-w-xl lg:max-w-2xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Folder className="h-8 w-8 text-primary" />
            <div>
              <DialogTitle className="text-lg">Storage Details</DialogTitle>
              <DialogDescription>
                Read-only view of the storage record.
              </DialogDescription>
            </div>
          </div>
          <div className="space-y-4 py-3"><div><div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Details</h3></div><div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Storage ID
              </Label>
              <span className="text-xs font-mono font-semibold">
                {storage.id}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Storage Code
              </Label>
              <span className="text-xs font-mono font-semibold">
                {storage.code}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Status
              </Label>
              <span>
                <Badge variant={storage.IsActive ? "success" : "destructive"}>
                  {storage.IsActive ? "Active" : "Inactive"}
                </Badge>
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Branch
              </Label>
              <span className="text-xs font-medium">{storage.branch?.branchName ?? `#${storage.branchId}`}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Main Store
              </Label>
              <span className="text-xs font-medium">{storage.IsMainStore ? "Yes" : "No"}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Blocked
              </Label>
              <span className="text-xs font-medium">{storage.IsBlocked ? "Yes" : "No"}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Description
              </Label>
              <span className="text-xs font-medium">{storage.description || "—"}</span>
            </div>
          </div></div></div>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onClose} variant="outline" >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
