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
import type { binListType } from "@/Types/tenantCreateType"
import { Trash2 } from "lucide-react"

type props = {
  bin: binListType | null
  open: boolean
  onClose: () => void
}

export function ViewBinModal({ bin, open, onClose }: props) {
  if (!bin) return null

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-xl md:max-w-xl lg:max-w-2xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Trash2 className="h-8 w-8 text-primary" />
            <div>
              <DialogTitle className="text-lg">Bin Details</DialogTitle>
              <DialogDescription>
                Read-only view of the bin record.
              </DialogDescription>
            </div>
          </div>
          <div className="space-y-4 py-3"><div><div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Details</h3></div><div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Bin ID
              </Label>
              <span className="text-xs font-mono font-semibold">
                {bin.id}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Bin Code
              </Label>
              <span className="text-xs font-mono font-semibold">
                {bin.binCode}
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Status
              </Label>
              <span>
                <Badge variant={bin.isActive ? "success" : "destructive"}>
                  {bin.isActive ? "Active" : "Inactive"}
                </Badge>
              </span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Bin Name
              </Label>
              <span className="text-xs font-medium">{bin.binName}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Description
              </Label>
              <div className="flex items-start gap-2">
                <Trash2 className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-xs font-medium">
                  {bin.description || "—"}
                </span>
              </div>
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