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
import type { employeeListType } from "@/Types/tenantCreateType"
import dayjs from "dayjs"
import { Users } from "lucide-react"

type props = {
    employee: employeeListType | null
    open: boolean
    onClose: () => void
}

export function ViewEmployeeModal({ employee, open, onClose }: props) {
    if (!employee) return null

    const fullName = [employee.firstName, employee.middleName, employee.lastName]
        .filter(Boolean)
        .join(" ")

    return (
        <Dialog open={open}>
            <DialogContent
                className="max-w-xl md:max-w-xl lg:max-w-2xl"
                showCloseButton={false}
            >
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Users className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle className="text-lg">Employee Details</DialogTitle>
                            <DialogDescription>
                                Read-only view of the employee record.
                            </DialogDescription>
                        </div>
                    </div>
                    <div className="space-y-4 py-3"><div><div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Details</h3></div><div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Employee ID
                            </Label>
                            <span className="text-xs font-mono font-semibold">{employee.id}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Employee Code
                            </Label>
                            <span className="text-xs font-mono font-semibold">{employee.employeeCode}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Status
                            </Label>
                            <span>
                                <Badge variant={employee.isActive ? "success" : "destructive"}>
                                    {employee.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Name
                            </Label>
                            <span className="text-xs font-medium">{fullName}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Email
                            </Label>
                            <span className="text-xs font-medium break-all">{employee.email}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Mobile No
                            </Label>
                            <span className="text-xs font-medium">{employee.mobileNo}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Branch
                            </Label>
                            <span className="text-xs font-medium">{employee.branch?.branchName || "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Role
                            </Label>
                            <span className="text-xs font-medium">{employee.role?.roleName || "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Designation
                            </Label>
                            <span className="text-xs font-medium">{employee.designation?.name || "—"}</span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Created At
                            </Label>
                            <span className="text-xs font-medium">
                                {dayjs(employee.createdAt).format("DD MMM YYYY")}
                            </span>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <Label className="text-xs font-medium text-muted-foreground">
                                Updated At
                            </Label>
                            <span className="text-xs font-medium">
                                {dayjs(employee.updatedAt).format("DD MMM YYYY")}
                            </span>
                        </div>
                    </div></div></div>
                </DialogHeader>
                <DialogFooter>
                    <Button size="sm" onClick={onClose} variant="outline" className="h-7 px-3 text-xs">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
