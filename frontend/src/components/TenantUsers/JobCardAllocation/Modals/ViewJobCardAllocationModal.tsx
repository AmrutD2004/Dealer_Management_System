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
            <DialogContent className="max-w-sm lg:max-w-2xl md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide" showCloseButton={false}>
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
                    <div className="space-y-4 py-3"><div><div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Details</h3></div><div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Allocation ID</Label>
                            <span className="text-xs font-medium font-mono">{allocation.id}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Job Card No.</Label>
                            <span className="text-xs font-medium font-mono">{allocation.jobCard?.jobCardNo ?? `#${allocation.jobCardId}`}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Allocation Status</Label>
                            <span>
                                <Badge variant={allocation.bayOutTime ? "outline" : "success"}>
                                    {allocation.bayOutTime ? "Released" : "In Bay"}
                                </Badge>
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Job Card Status</Label>
                            <span>
                                <Badge variant={allocation.jobCard?.status === "OPEN" ? "success" : "outline"}>
                                    {allocation.jobCard?.status === "OPEN" ? "Open" : "Closed"}
                                </Badge>
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Vehicle Status</Label>
                            <span className="text-xs font-medium">
                                {allocation.jobCard
                                    ? allocation.jobCard.vehicleStatus === "MOBILIZE" ? "Mobilize" : "Immobilize"
                                    : "—"}
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Current KM Reading</Label>
                            <span className="text-xs font-medium">{allocation.jobCard?.currentKmReading ?? "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Bay</Label>
                            <span className="text-xs font-medium">{allocation.bay?.bayName ?? "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Bay Code</Label>
                            <span className="text-xs font-medium font-mono">{allocation.bay?.bayCode ?? "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Bay In Date/Time</Label>
                            <span className="text-xs font-medium">{formatDateTime(allocation.bayInDateTime)}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Bay Out Date/Time</Label>
                            <span className="text-xs font-medium">{formatDateTime(allocation.bayOutTime)}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Mechanic</Label>
                            <span className="text-xs font-medium">{mechanicName}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Employee Code</Label>
                            <span className="text-xs font-medium font-mono">{allocation.mechanic?.employeeCode ?? "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Mechanic Email</Label>
                            <span className="text-xs font-medium">{allocation.mechanic?.email ?? "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Mechanic Mobile</Label>
                            <span className="text-xs font-medium">{allocation.mechanic?.mobileNo ?? "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Created At</Label>
                            <span className="text-xs font-medium">{formatDateTime(allocation.createdAt)}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">Updated At</Label>
                            <span className="text-xs font-medium">{formatDateTime(allocation.updatedAt)}</span>
                        </div>
                    </div></div></div>
                </DialogHeader>
                <DialogFooter>
                    <Button size="sm" onClick={onClose} variant="outline" className="h-7 px-3 text-xs">Close</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
