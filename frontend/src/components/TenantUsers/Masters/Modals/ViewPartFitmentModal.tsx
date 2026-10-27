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
            <DialogContent className="max-w-sm lg:max-w-3xl md:max-w-2xl max-h-[90vh] overflow-y-auto scrollbarHide" showCloseButton={false}>
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
                    <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Fitment ID</Label>
                            <span className="text-md font-semibold font-mono">{fitment.id}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Part Number</Label>
                            <span className="text-md font-semibold font-mono">{fitment.part?.partNo ?? `#${fitment.partId}`}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">OEM Part</Label>
                            <span>
                                <Badge variant={fitment.isOem ? 'success' : 'outline'}>
                                    {fitment.isOem ? 'Yes' : 'No'}
                                </Badge>
                            </span>
                        </Field>
                        <Field className="sm:col-span-2 lg:col-span-3">
                            <Label className="text-sm font-medium text-muted-foreground">Part Description</Label>
                            <span className="text-md font-semibold">{fitment.part?.partDescription ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Brand</Label>
                            <span className="text-md font-medium">{brandName}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Model</Label>
                            <span className="text-md font-medium">{modelName}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Variant</Label>
                            <span className="text-md font-medium">{variantName}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Position</Label>
                            <span className="text-md font-medium">{fitment.position ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Quantity</Label>
                            <span className="text-md font-medium">{Number(fitment.quantity)}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Tenant</Label>
                            <span className="text-md font-medium">{fitment.tenant?.tenantName ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Valid From</Label>
                            <span className="text-md font-medium">
                                {fitment.validFrom ? dayjs(fitment.validFrom).format('DD MMM YYYY') : "—"}
                            </span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Valid To</Label>
                            <span className="text-md font-medium">
                                {fitment.validTo ? dayjs(fitment.validTo).format('DD MMM YYYY') : "—"}
                            </span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
                            <span className="text-md font-medium">{dayjs(fitment.createdAt).format('DD MMM YYYY')}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Updated At</Label>
                            <span className="text-md font-medium">{dayjs(fitment.updatedAt).format('DD MMM YYYY')}</span>
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
