import {
    getCustomerList,
    getEmployeeList,
    getRepairOrderList,
    getServiceCategoryList,
    getServiceTypeList,
    getTenantBranchList,
    getVehicleList,
    updateJobCard,
} from "@/api/endpoints"
import type { jobCardListType } from "@/Types/tenantCreateType"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldContent } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/toast"
import dayjs from "dayjs"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface EditJobCardModalProps {
    jobCard: jobCardListType | null
    open: boolean
    onClose: () => void
    onUpdated?: () => void
}

const vehicleStatusOptions = [
    { value: "MOBILIZE", label: "Mobilize" },
    { value: "IMMOBILIZE", label: "Immobilize" },
]

const toISO = (value: string) => (value ? dayjs(value).toISOString() : null)

const toInputDateTime = (value?: string | null) =>
    value ? dayjs(value).format("YYYY-MM-DDTHH:mm") : ""

const initialFormData = {
    branchId: "",
    customerId: "",
    vehicleId: "",
    serviceCategoryId: "",
    serviceTypeId: "",
    repairOrderTypeId: "",
    vehicleStatus: "",
    currentKmReading: "",
    previousKmReading: "",
    estimateCloseJobcardAt: "",
    supervisorId: "",
    technicianId: "",
    driverName: "",
    driverMobileNo: "",
    isRevisit: false,
    isBreakDown: false,
    breakdownPersonAttended: "",
    breakdownDateTime: "",
    breakdownStartDateTime: "",
    breakdownEndDateTime: "",
    dealerVanStartKm: "",
    dealerVanEndKm: "",
}

export function EditJobCardModal({ jobCard, open, onClose, onUpdated }: EditJobCardModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState(initialFormData)
    const [prevJobCard, setPrevJobCard] = useState<jobCardListType | null>(null)
    const [branches, setBranches] = useState<any[]>([])
    const [customers, setCustomers] = useState<any[]>([])
    const [vehicles, setVehicles] = useState<any[]>([])
    const [serviceCategories, setServiceCategories] = useState<any[]>([])
    const [serviceTypes, setServiceTypes] = useState<any[]>([])
    const [repairOrders, setRepairOrders] = useState<any[]>([])
    const [employees, setEmployees] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [branchRes, customerRes, vehicleRes, categoryRes, typeRes, repairRes, employeeRes] = await Promise.all([
                    getTenantBranchList(0, 100),
                    getCustomerList(0, 100),
                    getVehicleList(0, 100),
                    getServiceCategoryList(),
                    getServiceTypeList(0, 100),
                    getRepairOrderList(),
                    getEmployeeList(0, 100),
                ])
                if (branchRes?.success) setBranches(branchRes?.data || [])
                if (customerRes?.success) setCustomers(customerRes?.data || [])
                if (vehicleRes?.success) setVehicles(vehicleRes?.data || [])
                if (categoryRes?.success) setServiceCategories(categoryRes?.data || [])
                if (typeRes?.success) setServiceTypes(typeRes?.data || [])
                if (repairRes?.success) setRepairOrders(repairRes?.data || [])
                if (employeeRes?.success) setEmployees(employeeRes?.data || [])
            } catch {
                // ignore
            }
        }
        if (open) fetchData()
    }, [open])

    if (jobCard && jobCard !== prevJobCard) {
        setPrevJobCard(jobCard)
        setFormData({
            branchId: jobCard.branchId?.toString() ?? "",
            customerId: jobCard.customerId?.toString() ?? "",
            vehicleId: jobCard.vehicleId?.toString() ?? "",
            serviceCategoryId: jobCard.serviceCategoryId?.toString() ?? "",
            serviceTypeId: jobCard.serviceTypeId?.toString() ?? "",
            repairOrderTypeId: jobCard.repairOrderTypeId?.toString() ?? "",
            vehicleStatus: jobCard.vehicleStatus ?? "",
            currentKmReading: jobCard.currentKmReading?.toString() ?? "",
            previousKmReading: jobCard.previousKmReading?.toString() ?? "",
            estimateCloseJobcardAt: toInputDateTime(jobCard.estimateCloseAt),
            supervisorId: jobCard.supervisorId?.toString() ?? "",
            technicianId: jobCard.technicianId?.toString() ?? "",
            driverName: jobCard.driverName ?? "",
            driverMobileNo: jobCard.driverMobileNo ?? "",
            isRevisit: jobCard.isRevisit ?? false,
            isBreakDown: jobCard.isBreakdown ?? false,
            breakdownPersonAttended: jobCard.breakdownPersonAttended ?? "",
            breakdownDateTime: toInputDateTime(jobCard.breakdownDateTime),
            breakdownStartDateTime: toInputDateTime(jobCard.breakdownStartDateTime),
            breakdownEndDateTime: toInputDateTime(jobCard.breakdownEndDateTime),
            dealerVanStartKm: jobCard.dealerVanStartKm?.toString() ?? "",
            dealerVanEndKm: jobCard.dealerVanEndKm?.toString() ?? "",
        })
    }

    if (!jobCard) {
        if (prevJobCard !== null) setPrevJobCard(null)
        return null
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!jobCard) return
        if (!formData.branchId || !formData.customerId || !formData.vehicleId || !formData.serviceCategoryId || !formData.serviceTypeId || !formData.repairOrderTypeId || !formData.vehicleStatus || !formData.currentKmReading || !formData.estimateCloseJobcardAt) {
            toast.add({
                type: 'error',
                description: 'Please fill all the required fields'
            })
            return
        }
        setLoading(true)
        try {
            const payload = {
                branchId: Number(formData.branchId),
                customerId: Number(formData.customerId),
                vehicleId: Number(formData.vehicleId),
                serviceCategoryId: Number(formData.serviceCategoryId),
                serviceTypeId: Number(formData.serviceTypeId),
                repairOrderTypeId: Number(formData.repairOrderTypeId),
                vehicleStatus: formData.vehicleStatus,
                currentKmReading: Number(formData.currentKmReading),
                previousKmReading: formData.previousKmReading ? Number(formData.previousKmReading) : null,
                estimateCloseJobcardAt: toISO(formData.estimateCloseJobcardAt),
                supervisorId: formData.supervisorId ? Number(formData.supervisorId) : null,
                technicianId: formData.technicianId ? Number(formData.technicianId) : null,
                driverName: formData.driverName || null,
                driverMobileNo: formData.driverMobileNo || null,
                isRevisit: formData.isRevisit,
                isBreakDown: formData.isBreakDown,
                breakdownPersonAttended: formData.breakdownPersonAttended || null,
                breakdownDateTime: toISO(formData.breakdownDateTime),
                breakdownStartDateTime: toISO(formData.breakdownStartDateTime),
                breakdownEndDateTime: toISO(formData.breakdownEndDateTime),
                dealerVanStartKm: formData.dealerVanStartKm ? Number(formData.dealerVanStartKm) : null,
                dealerVanEndKm: formData.dealerVanEndKm ? Number(formData.dealerVanEndKm) : null,
                revisedEstimateCloseAt: null,
            }
            const data = await updateJobCard(payload, jobCard.id)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                onUpdated?.()
                setTimeout(() => {
                    onClose()
                }, 1500)
            }
            if (!data?.success) {
                toast.add({
                    type: 'error',
                    description: data?.message
                })
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            })
        } finally {
            setLoading(false)
        }
    }

    const filteredVehicles = formData.customerId
        ? vehicles.filter((v) => String(v.customerId) === formData.customerId)
        : vehicles

    const filteredServiceTypes = formData.serviceCategoryId
        ? serviceTypes.filter((s) => String(s.serviceCategoryMasterId) === formData.serviceCategoryId)
        : serviceTypes

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Edit Job Card</DialogTitle>
                    <DialogDescription>Update details of {jobCard.jobCardNo}.</DialogDescription>
                </DialogHeader>

                <form id="job-card-edit-form" onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Customer & Vehicle</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel>Branch <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={branches.map(b => ({ value: String(b.id), label: b.branchName }))}
                                            value={formData.branchId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, branchId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select branch" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {branches.map((b) => (
                                                    <SelectItem key={b.id} value={String(b.id)}>
                                                        {b.branchName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Customer <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={customers.map(c => ({ value: String(c.id), label: `${c.firstName} ${c.lastName} - ${c.mobileNo}` }))}
                                            value={formData.customerId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value ?? "", vehicleId: "" }))}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select customer" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {customers.map((c) => (
                                                    <SelectItem key={c.id} value={String(c.id)}>
                                                        {c.firstName} {c.lastName} - {c.mobileNo}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field className="sm:col-span-2">
                                    <FieldLabel>Vehicle <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={filteredVehicles.map(v => ({ value: String(v.id), label: `${v.vehicleNumber || v.chassisNumber} - ${v.manufacturer} ${v.model}` }))}
                                            value={formData.vehicleId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select vehicle" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {filteredVehicles.map((v) => (
                                                    <SelectItem key={v.id} value={String(v.id)}>
                                                        {v.vehicleNumber || v.chassisNumber} - {v.manufacturer} {v.model}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Current KM Reading <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='currentKmReading' type='number' placeholder="Current KM reading" required onChange={handleChange} value={formData.currentKmReading} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Previous KM Reading</FieldLabel>
                                    <FieldContent>
                                        <Input name='previousKmReading' type='number' placeholder="Previous KM reading" onChange={handleChange} value={formData.previousKmReading} />
                                    </FieldContent>
                                </Field>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Service Details</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel>Service Category <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={serviceCategories.map(s => ({ value: String(s.id), label: s.name }))}
                                            value={formData.serviceCategoryId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, serviceCategoryId: value ?? "", serviceTypeId: "" }))}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select service category" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {serviceCategories.map((s) => (
                                                    <SelectItem key={s.id} value={String(s.id)}>
                                                        {s.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Service Type <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={filteredServiceTypes.map(s => ({ value: String(s.id), label: s.name }))}
                                            value={formData.serviceTypeId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, serviceTypeId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select service type" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {filteredServiceTypes.map((s) => (
                                                    <SelectItem key={s.id} value={String(s.id)}>
                                                        {s.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Repair Order Type <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={repairOrders.map(r => ({ value: String(r.id), label: r.name }))}
                                            value={formData.repairOrderTypeId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, repairOrderTypeId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select repair order type" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {repairOrders.map((r) => (
                                                    <SelectItem key={r.id} value={String(r.id)}>
                                                        {r.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Vehicle Status <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={vehicleStatusOptions}
                                            value={formData.vehicleStatus || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleStatus: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select vehicle status" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {vehicleStatusOptions.map((v) => (
                                                    <SelectItem key={v.value} value={v.value}>
                                                        {v.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Estimate Close At <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='estimateCloseJobcardAt' type='datetime-local' required onChange={handleChange} value={formData.estimateCloseJobcardAt} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Supervisor</FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={employees.map(e => ({ value: String(e.id), label: `${e.firstName} ${e.lastName}` }))}
                                            value={formData.supervisorId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, supervisorId: value ?? "" }))}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select supervisor" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {employees.map((e) => (
                                                    <SelectItem key={e.id} value={String(e.id)}>
                                                        {e.firstName} {e.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Technician</FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={employees.map(e => ({ value: String(e.id), label: `${e.firstName} ${e.lastName}` }))}
                                            value={formData.technicianId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, technicianId: value ?? "" }))}
                                        >
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select technician" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {employees.map((e) => (
                                                    <SelectItem key={e.id} value={String(e.id)}>
                                                        {e.firstName} {e.lastName}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Is Revisit</FieldLabel>
                                    <FieldContent>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="edit-isRevisit"
                                                checked={formData.isRevisit}
                                                onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isRevisit: checked }))}
                                            />
                                            <span className="text-sm text-muted-foreground">{formData.isRevisit ? "Yes" : "No"}</span>
                                        </div>
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Is Breakdown</FieldLabel>
                                    <FieldContent>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="edit-isBreakDown"
                                                checked={formData.isBreakDown}
                                                onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isBreakDown: checked }))}
                                            />
                                            <span className="text-sm text-muted-foreground">{formData.isBreakDown ? "Yes" : "No"}</span>
                                        </div>
                                    </FieldContent>
                                </Field>
                            </div>
                        </div>

                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Driver Details</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel>Driver Name</FieldLabel>
                                    <FieldContent>
                                        <Input name='driverName' placeholder="Driver name" onChange={handleChange} value={formData.driverName} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Driver Mobile No.</FieldLabel>
                                    <FieldContent>
                                        <Input name='driverMobileNo' placeholder="Driver mobile number" onChange={handleChange} value={formData.driverMobileNo} />
                                    </FieldContent>
                                </Field>
                            </div>
                        </div>

                        {formData.isBreakDown && (
                            <div>
                                <h3 className="mb-4 text-sm font-semibold text-foreground">Breakdown Details</h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field>
                                        <FieldLabel>Breakdown Person Attended</FieldLabel>
                                        <FieldContent>
                                            <Input name='breakdownPersonAttended' placeholder="Person attended" onChange={handleChange} value={formData.breakdownPersonAttended} />
                                        </FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Breakdown Date & Time</FieldLabel>
                                        <FieldContent>
                                            <Input name='breakdownDateTime' type='datetime-local' onChange={handleChange} value={formData.breakdownDateTime} />
                                        </FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Breakdown Start</FieldLabel>
                                        <FieldContent>
                                            <Input name='breakdownStartDateTime' type='datetime-local' onChange={handleChange} value={formData.breakdownStartDateTime} />
                                        </FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Breakdown End</FieldLabel>
                                        <FieldContent>
                                            <Input name='breakdownEndDateTime' type='datetime-local' onChange={handleChange} value={formData.breakdownEndDateTime} />
                                        </FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Dealer Van Start KM</FieldLabel>
                                        <FieldContent>
                                            <Input name='dealerVanStartKm' type='number' placeholder="Dealer van start KM" onChange={handleChange} value={formData.dealerVanStartKm} />
                                        </FieldContent>
                                    </Field>
                                    <Field>
                                        <FieldLabel>Dealer Van End KM</FieldLabel>
                                        <FieldContent>
                                            <Input name='dealerVanEndKm' type='number' placeholder="Dealer van end KM" onChange={handleChange} value={formData.dealerVanEndKm} />
                                        </FieldContent>
                                    </Field>
                                </div>
                            </div>
                        )}
                    </div>
                </form>

                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="job-card-edit-form" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Update Job Card
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
