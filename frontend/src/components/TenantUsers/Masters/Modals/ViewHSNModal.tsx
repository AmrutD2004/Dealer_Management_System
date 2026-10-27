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
import type { HSNMasterType } from "@/Types/hsnMasterType"
import dayjs from "dayjs"
import { Percent } from "lucide-react"

type props = {
    hsn: HSNMasterType | null
    open: boolean
    onClose: () => void
}

export function ViewHSNModal({ hsn, open, onClose }: props) {
    if (!hsn) return null

    return (
        <Dialog open={open}>
            <DialogContent className="max-w-sm lg:max-w-3xl md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide" showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Percent className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle className="text-lg">HSN Details</DialogTitle>
                            <DialogDescription>
                                Read-only view of the HSN record.
                            </DialogDescription>
                        </div>
                    </div>
                    <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">HSN ID</Label>
                            <span className="text-md font-semibold font-mono">{hsn.id}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">HSN Code</Label>
                            <span className="text-md font-semibold font-mono">{hsn.hsnCode}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                            <span>
                                <Badge variant={hsn.isActive ? "success" : "destructive"}>
                                    {hsn.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </span>
                        </Field>
                        <Field className="sm:col-span-2 lg:col-span-3">
                            <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                            <span className="text-md font-semibold">{hsn.description ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Tax Rate</Label>
                            <span className="text-md font-medium">{hsn.taxRate !== null ? `${Number(hsn.taxRate)}%` : "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Tenant</Label>
                            <span className="text-md font-medium">{hsn.tenant?.tenantName ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
                            <span className="text-md font-medium">{dayjs(hsn.createdAt).format('DD MMM YYYY')}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Updated At</Label>
                            <span className="text-md font-medium">{dayjs(hsn.updatedAt).format('DD MMM YYYY')}</span>
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
