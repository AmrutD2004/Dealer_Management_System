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
                    <FieldGroup className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Mapping ID
                            </Label>
                            <span className="text-md font-mono font-semibold">
                                {mapping.id}
                            </span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Role Code
                            </Label>
                            <span className="text-md font-mono font-semibold">
                                {mapping?.role?.roleCode}
                            </span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Role Name
                            </Label>
                            <span className="text-md font-semibold">{mapping?.role?.roleName}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Permission Code
                            </Label>
                            <span className="text-md font-mono font-semibold">
                                {mapping?.permission?.permissionCode}
                            </span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Permission Name
                            </Label>
                            <span className="text-md font-semibold">{mapping?.permission?.permissionName}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Status
                            </Label>
                            <span>
                                <Badge variant={mapping?.permission?.isActive ? "success" : "destructive"}>
                                    {mapping?.permission?.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </span>
                        </Field>
                        <Field className="sm:col-span-2 lg:col-span-3">
                            <Label className="text-sm font-medium text-muted-foreground">
                                Permission Description
                            </Label>
                            <div className="flex items-start gap-2">
                                <KeyRound className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="text-md font-medium">
                                    {mapping?.permission?.description || "—"}
                                </span>
                            </div>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Assigned At
                            </Label>
                            <span className="text-md font-medium">
                                {dayjs(mapping.createdAt).format("DD MMM YYYY")}
                            </span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Updated At
                            </Label>
                            <span className="text-md font-medium">
                                {dayjs(mapping.updatedAt).format("DD MMM YYYY")}
                            </span>
                        </Field>
                    </FieldGroup>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={onClose} variant="outline">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ViewAssignedPermissionModal
