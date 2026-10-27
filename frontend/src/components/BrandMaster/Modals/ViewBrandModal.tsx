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
import type { BrandListType } from "@/Types/brandMasterType"
import dayjs from "dayjs"
import { Tag } from "lucide-react"

type props = {
    brand: BrandListType | null
    open: boolean
    onClose: () => void
}

export function ViewBrandModal({ brand, open, onClose }: props) {
    if (!brand) return null

    return (
        <Dialog open={open}>
            <DialogContent className="max-w-sm lg:max-w-3xl md:max-w-xl" showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Tag className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle className="text-lg">Brand Details</DialogTitle>
                            <DialogDescription>
                                Read-only view of the brand record.
                            </DialogDescription>
                        </div>
                    </div>
                    <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Brand ID</Label>
                            <span className="text-md font-semibold font-mono">{brand.id}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Brand Code</Label>
                            <span className="text-md font-semibold font-mono">{brand.brandCode}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                            <span>
                                <Badge variant={brand.isActive ? "success" : "destructive"}>
                                    {brand.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </span>
                        </Field>
                        <Field className="sm:col-span-2 lg:col-span-3">
                            <Label className="text-sm font-medium text-muted-foreground">Brand Name</Label>
                            <span className="text-md font-semibold">{brand.brandName}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
                            <span className="text-md font-medium">{dayjs(brand.createdAt).format('DD MMM YYYY')}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Updated At</Label>
                            <span className="text-md font-medium">{dayjs(brand.updatedAt).format('DD MMM YYYY')}</span>
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
