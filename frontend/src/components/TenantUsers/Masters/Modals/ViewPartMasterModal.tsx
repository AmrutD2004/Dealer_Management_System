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
import type { PartMasterListType } from "@/Types/partMasterType"
import dayjs from "dayjs"
import { PackageSearch } from "lucide-react"
import { formatPartCurrency, getPartStatusLabel, getPartStatusVariant, getPartUnitLabel } from "../PartMaster/partOptions"

type props = {
    part: PartMasterListType | null
    open: boolean
    onClose: () => void
}

export function ViewPartMasterModal({ part, open, onClose }: props) {
    if (!part) return null

    const categoryName = part.category
        ? `${part.category.code} - ${part.category.name}`
        : part.partCategoryId
            ? `#${part.partCategoryId}`
            : "—"

    const hsnName = part.hsn
        ? `${part.hsn.hsnCode}${part.hsn.description ? ` - ${part.hsn.description}` : ""}`
        : part.hsnId
            ? `#${part.hsnId}`
            : "—"

    return (
        <Dialog open={open}>
            <DialogContent className="max-w-sm lg:max-w-2xl md:max-w-2xl max-h-[90vh] overflow-y-auto scrollbarHide" showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <PackageSearch className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle className="text-lg">Part Details</DialogTitle>
                            <DialogDescription>
                                Read-only view of the part record.
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="space-y-4 py-3"><div><div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Details</h3></div><div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Part ID</Label>
                            <span className="text-xs font-medium font-mono">{part.id}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Part Number</Label>
                            <span className="text-xs font-medium font-mono">{part.partNo}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Part Status</Label>
                            <span>
                                <Badge variant={getPartStatusVariant(part.status)}>
                                    {getPartStatusLabel(part.status)}
                                </Badge>
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                            <Label className="text-xs font-medium text-muted-foreground">Part Description</Label>
                            <span className="text-xs font-medium">{part.partDescription}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Part Category</Label>
                            <span className="text-xs font-medium">{categoryName}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">HSN Code</Label>
                            <span className="text-xs font-medium">{hsnName}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">HSN Tax Rate</Label>
                            <span className="text-xs font-medium">{part.hsn?.taxRate ? `${part.hsn.taxRate}%` : "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Selling Price</Label>
                            <span className="text-xs font-medium">{formatPartCurrency(part.sellingPrice)}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Tax Rate</Label>
                            <span className="text-xs font-medium">{Number(part.taxRate)}%</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Unit of Measure</Label>
                            <span className="text-xs font-medium">{getPartUnitLabel(part.unitOfMeasure)}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Reorder Level</Label>
                            <span className="text-xs font-medium">{part.reorderLevel ?? "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Fast Moving</Label>
                            <span className="text-xs font-medium">{part.isFastMoving ? "Yes" : "No"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Valid From</Label>
                            <span className="text-xs font-medium">
                                {part.validFrom ? dayjs(part.validFrom).format('DD MMM YYYY') : "—"}
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Valid To</Label>
                            <span className="text-xs font-medium">
                                {part.validTo ? dayjs(part.validTo).format('DD MMM YYYY') : "—"}
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Tenant</Label>
                            <span className="text-xs font-medium">{part.tenant?.tenantName ?? "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Created At</Label>
                            <span className="text-xs font-medium">{dayjs(part.createdAt).format('DD MMM YYYY')}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Updated At</Label>
                            <span className="text-xs font-medium">{dayjs(part.updatedAt).format('DD MMM YYYY')}</span>
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
