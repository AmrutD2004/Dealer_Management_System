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
import type { HSNMasterType } from "@/Types/hsnMasterType"
import dayjs from "dayjs"
import { Percent } from "lucide-react"

type props = {
    hsn: HSNMasterType | null
    open: boolean
    onClose: () => void
}

export function ViewHSNModal({ hsn, open, onClose }: props) {
    if (!hsn) return null

    return (
        <Dialog open={open}>
            <DialogContent className="max-w-sm lg:max-w-2xl md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide" showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Percent className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle className="text-lg">HSN Details</DialogTitle>
                            <DialogDescription>
                                Read-only view of the HSN record.
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="space-y-4 py-3"><div><div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Details</h3></div><div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">HSN ID</Label>
                            <span className="text-xs font-medium font-mono">{hsn.id}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">HSN Code</Label>
                            <span className="text-xs font-medium font-mono">{hsn.hsnCode}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                            <span>
                                <Badge variant={hsn.isActive ? "success" : "destructive"}>
                                    {hsn.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                            <Label className="text-xs font-medium text-muted-foreground">Description</Label>
                            <span className="text-xs font-medium">{hsn.description ?? "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Tax Rate</Label>
                            <span className="text-xs font-medium">{hsn.taxRate !== null ? `${Number(hsn.taxRate)}%` : "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Tenant</Label>
                            <span className="text-xs font-medium">{hsn.tenant?.tenantName ?? "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Created At</Label>
                            <span className="text-xs font-medium">{dayjs(hsn.createdAt).format('DD MMM YYYY')}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Updated At</Label>
                            <span className="text-xs font-medium">{dayjs(hsn.updatedAt).format('DD MMM YYYY')}</span>
                        </div>
                    </div></div></div>
                </DialogHeader>
                <DialogFooter>
                    <Button  onClick={onClose} variant="outline" >Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
