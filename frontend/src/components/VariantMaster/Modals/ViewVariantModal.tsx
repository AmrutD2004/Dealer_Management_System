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
import type { VariantListType } from "@/Types/variantMasterType"
import dayjs from "dayjs"
import { Layers } from "lucide-react"

type props = {
    variant: VariantListType | null
    modelName: string
    open: boolean
    onClose: () => void
}

export function ViewVariantModal({ variant, modelName, open, onClose }: props) {
    if (!variant) return null

    return (
        <Dialog open={open}>
            <DialogContent className="max-w-sm lg:max-w-3xl md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide" showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Layers className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle className="text-lg">Variant Details</DialogTitle>
                            <DialogDescription>
                                Read-only view of the variant record.
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="space-y-4 py-3"><div><div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Details</h3></div><div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Variant ID</Label>
                            <span className="text-xs font-semibold font-mono">{variant.id}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Variant Code</Label>
                            <span className="text-xs font-semibold font-mono">{variant.variantCode}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                            <span>
                                <Badge variant={variant.isActive ? "success" : "destructive"}>
                                    {variant.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                            <Label className="text-xs font-medium text-muted-foreground">Variant Name</Label>
                            <span className="text-xs font-semibold">{variant.variantName}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                            <Label className="text-xs font-medium text-muted-foreground">Model</Label>
                            <span className="text-xs font-medium">{modelName || `#${variant.modelId}`}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Fuel Type</Label>
                            <span className="text-xs font-medium">{variant.fuelType}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Transmission Type</Label>
                            <span className="text-xs font-medium">{variant.transmissionType}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Production From</Label>
                            <span className="text-xs font-medium">
                                {variant.productionFrom ? dayjs(variant.productionFrom).format('DD MMM YYYY') : '—'}
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Production To</Label>
                            <span className="text-xs font-medium">
                                {variant.productionTo ? dayjs(variant.productionTo).format('DD MMM YYYY') : '—'}
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Created At</Label>
                            <span className="text-xs font-medium">{dayjs(variant.createdAt).format('DD MMM YYYY')}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Updated At</Label>
                            <span className="text-xs font-medium">{dayjs(variant.updatedAt).format('DD MMM YYYY')}</span>
                        </div>
                    </div></div></div>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={onClose} variant="outline">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
