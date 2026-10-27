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
import type { PartCategoryListType } from "@/Types/partCategoryType"
import dayjs from "dayjs"
import { Package } from "lucide-react"

type props = {
    category: PartCategoryListType | null
    open: boolean
    onClose: () => void
}

export function ViewPartCategoryModal({ category, open, onClose }: props) {
    if (!category) return null

    const parentName = category.parent
        ? `${category.parent.code} - ${category.parent.name}`
        : category.parentId
            ? `#${category.parentId}`
            : "—"

    return (
        <Dialog open={open}>
            <DialogContent className="max-w-sm lg:max-w-3xl md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide" showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Package className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle className="text-lg">Part Category Details</DialogTitle>
                            <DialogDescription>
                                Read-only view of the part category record.
                            </DialogDescription>
                        </div>
                    </div>
                    <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Category ID</Label>
                            <span className="text-md font-semibold font-mono">{category.id}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Category Code</Label>
                            <span className="text-md font-semibold font-mono">{category.code}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                            <span>
                                <Badge variant={category.isActive ? "success" : "destructive"}>
                                    {category.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </span>
                        </Field>
                        <Field className="sm:col-span-2 lg:col-span-3">
                            <Label className="text-sm font-medium text-muted-foreground">Category Name</Label>
                            <span className="text-md font-semibold">{category.name}</span>
                        </Field>
                        <Field className="sm:col-span-2 lg:col-span-3">
                            <Label className="text-sm font-medium text-muted-foreground">Parent Category</Label>
                            <span className="text-md font-medium">{parentName}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Tenant</Label>
                            <span className="text-md font-medium">{category.tenant?.tenantName ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
                            <span className="text-md font-medium">{dayjs(category.createdAt).format('DD MMM YYYY')}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Updated At</Label>
                            <span className="text-md font-medium">{dayjs(category.updatedAt).format('DD MMM YYYY')}</span>
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
