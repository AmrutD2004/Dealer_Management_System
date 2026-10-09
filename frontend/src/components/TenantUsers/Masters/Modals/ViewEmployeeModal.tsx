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
                    <FieldGroup className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Employee ID
                            </Label>
                            <span className="text-md font-mono font-semibold">{employee.id}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Employee Code
                            </Label>
                            <span className="text-md font-mono font-semibold">{employee.employeeCode}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Status
                            </Label>
                            <span>
                                <Badge variant={employee.isActive ? "success" : "destructive"}>
                                    {employee.isActive ? "Active" : "Inactive"}
                                </Badge>
                            </span>
                        </Field>
                        <Field className="sm:col-span-2 lg:col-span-3">
                            <Label className="text-sm font-medium text-muted-foreground">
                                Name
                            </Label>
                            <span className="text-md font-semibold">{fullName}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Email
                            </Label>
                            <span className="text-md font-medium break-all">{employee.email}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Mobile No
                            </Label>
                            <span className="text-md font-medium">{employee.mobileNo}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Branch
                            </Label>
                            <span className="text-md font-medium">{employee.branch?.branchName || "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Role
                            </Label>
                            <span className="text-md font-medium">{employee.role?.roleName || "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Designation
                            </Label>
                            <span className="text-md font-medium">{employee.designation?.name || "—"}</span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Created At
                            </Label>
                            <span className="text-md font-medium">
                                {dayjs(employee.createdAt).format("DD MMM YYYY")}
                            </span>
                        </Field>
                        <Field>
                            <Label className="text-sm font-medium text-muted-foreground">
                                Updated At
                            </Label>
                            <span className="text-md font-medium">
                                {dayjs(employee.updatedAt).format("DD MMM YYYY")}
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
