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
import { Field, FieldGroup } from "@/components/ui/field"
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
                    <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Variant ID</Label>
                            <span className="text-md font-semibold font-mono">{variant.id}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Variant Code</Label>
                            <span className="text-md font-semibold font-mono">{variant.variantCode}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                            <span>
                                <Badge variant={variant.isActive ? "success" : "destructive"}>
                                    {variant.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </span>
                        </Field>
                        <Field className="sm:col-span-2 lg:col-span-3">
                            <Label className="text-sm font-medium text-muted-foreground">Variant Name</Label>
                            <span className="text-md font-semibold">{variant.variantName}</span>
                        </Field>
                        <Field className="sm:col-span-2 lg:col-span-3">
                            <Label className="text-sm font-medium text-muted-foreground">Model</Label>
                            <span className="text-md font-medium">{modelName || `#${variant.modelId}`}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Fuel Type</Label>
                            <span className="text-md font-medium">{variant.fuelType}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Transmission Type</Label>
                            <span className="text-md font-medium">{variant.transmissionType}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Production From</Label>
                            <span className="text-md font-medium">
                                {variant.productionFrom ? dayjs(variant.productionFrom).format('DD MMM YYYY') : '—'}
                            </span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Production To</Label>
                            <span className="text-md font-medium">
                                {variant.productionTo ? dayjs(variant.productionTo).format('DD MMM YYYY') : '—'}
                            </span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
                            <span className="text-md font-medium">{dayjs(variant.createdAt).format('DD MMM YYYY')}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Updated At</Label>
                            <span className="text-md font-medium">{dayjs(variant.updatedAt).format('DD MMM YYYY')}</span>
                        </Field>
                    </FieldGroup>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={onClose} variant="outline">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
