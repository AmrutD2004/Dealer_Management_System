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
import type { JobCardAllocationType } from "@/Types/jobCardAllocationType"
import dayjs from "dayjs"
import { CalendarClock } from "lucide-react"

type Props = {
    allocation: JobCardAllocationType | null
    open: boolean
    onClose: () => void
}

const formatDateTime = (value: string | null | undefined) => {
    return value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "—"
}

export function ViewJobCardAllocationModal({ allocation, open, onClose }: Props) {
    if (!allocation) return null

    const mechanicName = allocation.mechanic
        ? `${allocation.mechanic.firstName} ${allocation.mechanic.lastName ?? ""}`.trim()
        : "—"

    return (
        <Dialog open={open}>
            <DialogContent className="max-w-sm lg:max-w-3xl md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide" showCloseButton={false}>
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <CalendarClock className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle className="text-lg">Job Card Allocation Details</DialogTitle>
                            <DialogDescription>
                                Read-only view of the allocation record.
                            </DialogDescription>
                        </div>
                    </div>
                    <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-6 gap-4">
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Allocation ID</Label>
                            <span className="text-md font-semibold font-mono">{allocation.id}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Job Card No.</Label>
                            <span className="text-md font-semibold font-mono">{allocation.jobCard?.jobCardNo ?? `#${allocation.jobCardId}`}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Allocation Status</Label>
                            <span>
                                <Badge variant={allocation.bayOutTime ? "outline" : "success"}>
                                    {allocation.bayOutTime ? "Released" : "In Bay"}
                                </Badge>
                            </span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Job Card Status</Label>
                            <span>
                                <Badge variant={allocation.jobCard?.status === "OPEN" ? "success" : "outline"}>
                                    {allocation.jobCard?.status === "OPEN" ? "Open" : "Closed"}
                                </Badge>
                            </span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Vehicle Status</Label>
                            <span className="text-md font-medium">
                                {allocation.jobCard
                                    ? allocation.jobCard.vehicleStatus === "MOBILIZE" ? "Mobilize" : "Immobilize"
                                    : "—"}
                            </span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Current KM Reading</Label>
                            <span className="text-md font-medium">{allocation.jobCard?.currentKmReading ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Bay</Label>
                            <span className="text-md font-medium">{allocation.bay?.bayName ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Bay Code</Label>
                            <span className="text-md font-medium font-mono">{allocation.bay?.bayCode ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Bay In Date/Time</Label>
                            <span className="text-md font-medium">{formatDateTime(allocation.bayInDateTime)}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Bay Out Date/Time</Label>
                            <span className="text-md font-medium">{formatDateTime(allocation.bayOutTime)}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Mechanic</Label>
                            <span className="text-md font-semibold">{mechanicName}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Employee Code</Label>
                            <span className="text-md font-medium font-mono">{allocation.mechanic?.employeeCode ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Mechanic Email</Label>
                            <span className="text-md font-medium">{allocation.mechanic?.email ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Mechanic Mobile</Label>
                            <span className="text-md font-medium">{allocation.mechanic?.mobileNo ?? "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Created At</Label>
                            <span className="text-md font-medium">{formatDateTime(allocation.createdAt)}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">Updated At</Label>
                            <span className="text-md font-medium">{formatDateTime(allocation.updatedAt)}</span>
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
