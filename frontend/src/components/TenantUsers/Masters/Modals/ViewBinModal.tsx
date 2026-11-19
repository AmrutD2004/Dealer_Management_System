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
import { Archive } from "lucide-react"

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
            <Archive className="h-8 w-8 text-primary" />
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
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Storage ID
              </Label>
              <span className="text-xs font-mono font-semibold">{bin.storeId}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Storage
              </Label>
              <span className="text-xs font-medium">{bin.store?.code ?? `Storage #${bin.storeId}`}</span>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Description
              </Label>
              <span className="text-xs font-medium">{bin.binDescription || "—"}</span>
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
