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
import type { rolePermissionMappingType } from "@/Types/tenantCreateType"
import dayjs from "dayjs"
import { KeyRound, ShieldCheck } from "lucide-react"

type props = {
    mapping: rolePermissionMappingType | null
    open: boolean
    onClose: () => void
}

const ViewAssignedPermissionModal = ({ mapping, open, onClose }: props) => {
    if (!mapping) return null

    return (
        <Dialog open={open}>
            <DialogContent
                className="max-w-xl md:max-w-xl lg:max-w-2xl"
                showCloseButton={false}
            >
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle className="text-lg">Assign Permission Details</DialogTitle>
                            <DialogDescription>
                                Read-only view of the assigned permission record.
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="space-y-4 py-3"><div><div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Details</h3></div><div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Mapping ID
                            </Label>
                            <span className="text-xs font-mono font-semibold">
                                {mapping.id}
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Role Code
                            </Label>
                            <span className="text-xs font-mono font-semibold">
                                {mapping?.role?.roleCode}
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Role Name
                            </Label>
                            <span className="text-xs font-medium">{mapping?.role?.roleName}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Permission Code
                            </Label>
                            <span className="text-xs font-mono font-semibold">
                                {mapping?.permission?.permissionCode}
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Permission Name
                            </Label>
                            <span className="text-xs font-medium">{mapping?.permission?.permissionName}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Status
                            </Label>
                            <span>
                                <Badge variant={mapping?.permission?.isActive ? "success" : "destructive"}>
                                    {mapping?.permission?.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Permission Description
                            </Label>
                            <div className="flex items-start gap-2">
                                <KeyRound className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="text-xs font-medium">
                                    {mapping?.permission?.description || "—"}
                                </span>
                            </div>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Assigned At
                            </Label>
                            <span className="text-xs font-medium">
                                {dayjs(mapping.createdAt).format("DD MMM YYYY")}
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Updated At
                            </Label>
                            <span className="text-xs font-medium">
                                {dayjs(mapping.updatedAt).format("DD MMM YYYY")}
                            </span>
                        </div>
                    </div></div></div>
                </DialogHeader>
                <DialogFooter>
                    <Button  onClick={onClose} variant="outline" >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ViewAssignedPermissionModal
