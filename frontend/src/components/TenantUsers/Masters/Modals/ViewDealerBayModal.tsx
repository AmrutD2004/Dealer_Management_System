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
import type { DealerBayMasterType } from "@/Types/dealerBayType"
import dayjs from "dayjs"
import { Warehouse } from "lucide-react"

type Props = {
    bay: DealerBayMasterType | null
    open: boolean
    onClose: () => void
}

export function ViewDealerBayModal({ bay, open, onClose }: Props) {
    if (!bay) return null

    return (
        <Dialog open={open}>
            <DialogContent className="max-w-sm lg:max-w-3xl md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide" showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Warehouse className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle className="text-lg">Dealer's Bay Details</DialogTitle>
                            <DialogDescription>
                                Read-only view of the bay record.
                            </DialogDescription>
                        </div>
                    </div>
                    <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Bay ID</Label>
                            <span className="text-md font-semibold font-mono">{bay.id}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Bay Code</Label>
                            <span className="text-md font-semibold font-mono">{bay.bayCode}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Bay Name</Label>
                            <span className="text-md font-semibold">{bay.bayName}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                            <span>
                                <Badge variant={bay.isActive ? "success" : "destructive"}>
                                    {bay.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Branch</Label>
                            <span className="text-md font-medium">{bay.branch?.branchName ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Branch Code</Label>
                            <span className="text-md font-medium font-mono">{bay.branch?.branchCode ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Branch City</Label>
                            <span className="text-md font-medium">{bay.branch?.city ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Branch Phone</Label>
                            <span className="text-md font-medium">{bay.branch?.phone ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Tenant</Label>
                            <span className="text-md font-medium">{bay.tenant?.tenantName ?? "—"}</span>
                        </Field>
                        <Field className="sm:col-span-2 lg:col-span-3">
                            <Label className="text-sm font-medium text-muted-foreground">Description</Label>
                            <span className="text-md font-semibold">{bay.description ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
                            <span className="text-md font-medium">{dayjs(bay.createdAt).format('DD MMM YYYY')}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Updated At</Label>
                            <span className="text-md font-medium">{dayjs(bay.updatedAt).format('DD MMM YYYY')}</span>
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
