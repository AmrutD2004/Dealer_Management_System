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
            <DialogContent className="max-w-sm lg:max-w-4xl md:max-w-2xl max-h-[90vh] overflow-y-auto scrollbarHide" showCloseButton={false}>
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
                    <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Part ID</Label>
                            <span className="text-md font-semibold font-mono">{part.id}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Part Number</Label>
                            <span className="text-md font-semibold font-mono">{part.partNo}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Part Status</Label>
                            <span>
                                <Badge variant={getPartStatusVariant(part.status)}>
                                    {getPartStatusLabel(part.status)}
                                </Badge>
                            </span>
                        </Field>
                        <Field className="sm:col-span-2 lg:col-span-3">
                            <Label className="text-sm font-medium text-muted-foreground">Part Description</Label>
                            <span className="text-md font-semibold">{part.partDescription}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Part Category</Label>
                            <span className="text-md font-medium">{categoryName}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">HSN Code</Label>
                            <span className="text-md font-medium">{hsnName}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">HSN Tax Rate</Label>
                            <span className="text-md font-medium">{part.hsn?.taxRate ? `${part.hsn.taxRate}%` : "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Selling Price</Label>
                            <span className="text-md font-semibold">{formatPartCurrency(part.sellingPrice)}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Tax Rate</Label>
                            <span className="text-md font-medium">{Number(part.taxRate)}%</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Unit of Measure</Label>
                            <span className="text-md font-medium">{getPartUnitLabel(part.unitOfMeasure)}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Reorder Level</Label>
                            <span className="text-md font-medium">{part.reorderLevel ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Fast Moving</Label>
                            <span className="text-md font-medium">{part.isFastMoving ? "Yes" : "No"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Valid From</Label>
                            <span className="text-md font-medium">
                                {part.validFrom ? dayjs(part.validFrom).format('DD MMM YYYY') : "—"}
                            </span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Valid To</Label>
                            <span className="text-md font-medium">
                                {part.validTo ? dayjs(part.validTo).format('DD MMM YYYY') : "—"}
                            </span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Tenant</Label>
                            <span className="text-md font-medium">{part.tenant?.tenantName ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
                            <span className="text-md font-medium">{dayjs(part.createdAt).format('DD MMM YYYY')}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Updated At</Label>
                            <span className="text-md font-medium">{dayjs(part.updatedAt).format('DD MMM YYYY')}</span>
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
