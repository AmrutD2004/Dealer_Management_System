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
            <DialogContent className="max-w-sm lg:max-w-2xl md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide" showCloseButton={false}>
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
                    <div className="space-y-4 py-3"><div><div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Details</h3></div><div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Category ID</Label>
                            <span className="text-xs font-medium font-mono">{category.id}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Category Code</Label>
                            <span className="text-xs font-medium font-mono">{category.code}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Status</Label>
                            <span>
                                <Badge variant={category.isActive ? "success" : "destructive"}>
                                    {category.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                            <Label className="text-xs font-medium text-muted-foreground">Category Name</Label>
                            <span className="text-xs font-medium">{category.name}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                            <Label className="text-xs font-medium text-muted-foreground">Parent Category</Label>
                            <span className="text-xs font-medium">{parentName}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Tenant</Label>
                            <span className="text-xs font-medium">{category.tenant?.tenantName ?? "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Created At</Label>
                            <span className="text-xs font-medium">{dayjs(category.createdAt).format('DD MMM YYYY')}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Updated At</Label>
                            <span className="text-xs font-medium">{dayjs(category.updatedAt).format('DD MMM YYYY')}</span>
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
