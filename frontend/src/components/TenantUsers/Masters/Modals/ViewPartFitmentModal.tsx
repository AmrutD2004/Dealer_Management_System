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
import type { PartFitmentListType } from "@/Types/partFitmentType"
import dayjs from "dayjs"
import { Link2 } from "lucide-react"

type props = {
    fitment: PartFitmentListType | null
    open: boolean
    onClose: () => void
}

export function ViewPartFitmentModal({ fitment, open, onClose }: props) {
    if (!fitment) return null

    const brandName = fitment.brand
        ? `${fitment.brand.brandName} - ${fitment.brand.brandCode}`
        : `#${fitment.brandId}`

    const modelName = fitment.model
        ? `${fitment.model.modelName} - ${fitment.model.modelCode}`
        : `#${fitment.modelId}`

    const variantName = fitment.variant
        ? `${fitment.variant.variantName} - ${fitment.variant.variantCode}`
        : `#${fitment.variantId}`

    return (
        <Dialog open={open}>
            <DialogContent className="max-w-sm lg:max-w-2xl md:max-w-2xl max-h-[90vh] overflow-y-auto scrollbarHide" showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Link2 className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle className="text-lg">Part Fitment Details</DialogTitle>
                            <DialogDescription>
                                Read-only view of the part fitment record.
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="space-y-4 py-3"><div><div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Details</h3></div><div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Fitment ID</Label>
                            <span className="text-xs font-medium font-mono">{fitment.id}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Part Number</Label>
                            <span className="text-xs font-medium font-mono">{fitment.part?.partNo ?? `#${fitment.partId}`}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">OEM Part</Label>
                            <span>
                                <Badge variant={fitment.isOem ? 'success' : 'outline'}>
                                    {fitment.isOem ? 'Yes' : 'No'}
                                </Badge>
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                            <Label className="text-xs font-medium text-muted-foreground">Part Description</Label>
                            <span className="text-xs font-medium">{fitment.part?.partDescription ?? "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Brand</Label>
                            <span className="text-xs font-medium">{brandName}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Model</Label>
                            <span className="text-xs font-medium">{modelName}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Variant</Label>
                            <span className="text-xs font-medium">{variantName}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Position</Label>
                            <span className="text-xs font-medium">{fitment.position ?? "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Quantity</Label>
                            <span className="text-xs font-medium">{Number(fitment.quantity)}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Tenant</Label>
                            <span className="text-xs font-medium">{fitment.tenant?.tenantName ?? "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Valid From</Label>
                            <span className="text-xs font-medium">
                                {fitment.validFrom ? dayjs(fitment.validFrom).format('DD MMM YYYY') : "—"}
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Valid To</Label>
                            <span className="text-xs font-medium">
                                {fitment.validTo ? dayjs(fitment.validTo).format('DD MMM YYYY') : "—"}
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Created At</Label>
                            <span className="text-xs font-medium">{dayjs(fitment.createdAt).format('DD MMM YYYY')}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Updated At</Label>
                            <span className="text-xs font-medium">{dayjs(fitment.updatedAt).format('DD MMM YYYY')}</span>
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
