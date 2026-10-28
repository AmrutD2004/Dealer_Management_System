import {
    getCustomerList,
    getEmployeeList,
    getLabourList,
    getRepairOrderList,
    getServiceCategoryList,
    getServiceTypeList,
    getTenantBranchList,
    getVehicleList,
    updateJobCard,
} from "@/api/endpoints"
import type { jobCardListType, labourListType } from "@/Types/tenantCreateType"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import dayjs from "dayjs"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

interface CustomerVoiceForm {
    id?: number
    labourId: string
    customerVoiceDescription: string
    observation: string
}

const emptyCustomerVoice: CustomerVoiceForm = {
    labourId: "",
    customerVoiceDescription: "",
    observation: "",
}

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
    const [labours, setLabours] = useState<labourListType[]>([])
    const [customerVoices, setCustomerVoices] = useState<CustomerVoiceForm[]>([{ ...emptyCustomerVoice }])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [branchRes, customerRes, vehicleRes, categoryRes, typeRes, repairRes, employeeRes, labourRes] = await Promise.all([
                    getTenantBranchList(0, 100),
                    getCustomerList(0, 100),
                    getVehicleList(0, 100),
                    getServiceCategoryList(),
                    getServiceTypeList(0, 100),
                    getRepairOrderList(),
                    getEmployeeList(0, 100),
                    getLabourList(0, 100),
                ])
                if (branchRes?.success) setBranches(branchRes?.data || [])
                if (customerRes?.success) setCustomers(customerRes?.data || [])
                if (vehicleRes?.success) setVehicles(vehicleRes?.data || [])
                if (categoryRes?.success) setServiceCategories(categoryRes?.data || [])
                if (typeRes?.success) setServiceTypes(typeRes?.data || [])
                if (repairRes?.success) setRepairOrders(repairRes?.data || [])
                if (employeeRes?.success) setEmployees(employeeRes?.data || [])
                if (labourRes?.success) setLabours(labourRes?.data || [])
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
        const voices = jobCard.jobCardCustomerVoices ?? []
        setCustomerVoices(
            voices.length > 0
                ? voices.map((voice) => ({
                    id: voice.id,
                    labourId: voice.labour?.id?.toString() ?? "",
                    customerVoiceDescription: voice.customerVoiceDescription ?? "",
                    observation: voice.observation ?? "",
                }))
                : [{ ...emptyCustomerVoice }]
        )
    }

    if (!jobCard) {
        if (prevJobCard !== null) setPrevJobCard(null)
        return null
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCustomerVoiceChange = (
        index: number,
        field: keyof CustomerVoiceForm,
        value: string
    ) => {
        setCustomerVoices((prev) =>
            prev.map((voice, i) => (i === index ? { ...voice, [field]: value } : voice))
        )
    }

    const addCustomerVoice = () => {
        setCustomerVoices((prev) => [...prev, { ...emptyCustomerVoice }])
    }

    const removeCustomerVoice = (index: number) => {
        setCustomerVoices((prev) => prev.filter((_, i) => i !== index))
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
        const filledVoices = customerVoices.filter(
            (voice) => voice.labourId || voice.customerVoiceDescription || voice.observation
        )
        const invalidVoice = filledVoices.some(
            (voice) => !voice.labourId || !voice.customerVoiceDescription
        )
        if (invalidVoice) {
            toast.add({
                type: 'error',
                description: 'Please select an action to be taken and enter the customer voice description'
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
                customerVoices: filledVoices.map((voice) => ({
                    labourId: Number(voice.labourId),
                    customerVoiceDescription: voice.customerVoiceDescription,
                    observation: voice.observation || "",
                })),
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
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-6xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Edit Job Card</DialogTitle>
                    <DialogDescription>Update details of {jobCard.jobCardNo}.</DialogDescription>
                </DialogHeader>

                <form id="job-card-edit-form" onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1">
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Customer & Vehicle</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Branch <span className="text-red-500">*</span></FieldLabel>
                                    <Select
                                        items={branches.map(b => ({ value: String(b.id), label: b.branchName }))}
                                        value={formData.branchId || null}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, branchId: value ?? "" }))}
                                        required
                                    >
                                        <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
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
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Customer <span className="text-red-500">*</span></FieldLabel>
                                    <Select
                                        items={customers.map(c => ({ value: String(c.id), label: `${c.firstName} ${c.lastName} - ${c.mobileNo}` }))}
                                        value={formData.customerId || null}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, customerId: value ?? "", vehicleId: "" }))}
                                        required
                                    >
                                        <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
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
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Vehicle <span className="text-red-500">*</span></FieldLabel>
                                    <Select
                                        items={filteredVehicles.map(v => ({ value: String(v.id), label: `${v.vehicleNumber || v.chassisNumber} - ${v.brand?.brandName || v.manufacturer} ${v.model?.modelName || v.model}` }))}
                                        value={formData.vehicleId || null}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleId: value ?? "" }))}
                                        required
                                    >
                                        <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                            <SelectValue placeholder="Select vehicle" />
                                        </SelectTrigger>
                                        <SelectContent align="start" alignItemWithTrigger={false}>
                                            {filteredVehicles.map((v) => (
                                                <SelectItem key={v.id} value={String(v.id)}>
                                                    {v.vehicleNumber || v.chassisNumber} - {v.brand?.brandName || v.manufacturer} {v.model?.modelName || v.model}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Current KM Reading <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='currentKmReading' type='number' placeholder="Current KM reading" required onChange={handleChange} value={formData.currentKmReading} className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Previous KM Reading</FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='previousKmReading' type='number' placeholder="Previous KM reading" onChange={handleChange} value={formData.previousKmReading} className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Service Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Service Category <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={serviceCategories.map(s => ({ value: String(s.id), label: s.name }))}
                                            value={formData.serviceCategoryId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, serviceCategoryId: value ?? "", serviceTypeId: "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
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
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Service Type <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={filteredServiceTypes.map(s => ({ value: String(s.id), label: s.name }))}
                                            value={formData.serviceTypeId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, serviceTypeId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
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
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Repair Order Type <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={repairOrders.map(r => ({ value: String(r.id), label: r.name }))}
                                            value={formData.repairOrderTypeId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, repairOrderTypeId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
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
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Vehicle Status <span className="text-red-500">*</span></FieldLabel>
                                    <Select
                                        items={vehicleStatusOptions}
                                        value={formData.vehicleStatus || null}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleStatus: value ?? "" }))}
                                        required
                                    >
                                        <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent align="start" alignItemWithTrigger={false}>
                                            {vehicleStatusOptions.map((v) => (
                                                <SelectItem key={v.value} value={v.value}>
                                                    {v.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Est. Close At <span className="text-red-500">*</span></FieldLabel>
                                    <Input name='estimateCloseJobcardAt' type='datetime-local' required onChange={handleChange} value={formData.estimateCloseJobcardAt} className="h-7 rounded-none px-2 text-xs" />
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Supervisor</FieldLabel>
                                    <Select
                                        items={employees.map(e => ({ value: String(e.id), label: `${e.firstName} ${e.lastName}` }))}
                                        value={formData.supervisorId || null}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, supervisorId: value ?? "" }))}
                                    >
                                        <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent align="start" alignItemWithTrigger={false}>
                                            {employees.map((e) => (
                                                <SelectItem key={e.id} value={String(e.id)}>
                                                    {e.firstName} {e.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Technician</FieldLabel>
                                    <Select
                                        items={employees.map(e => ({ value: String(e.id), label: `${e.firstName} ${e.lastName}` }))}
                                        value={formData.technicianId || null}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, technicianId: value ?? "" }))}
                                    >
                                        <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent align="start" alignItemWithTrigger={false}>
                                            {employees.map((e) => (
                                                <SelectItem key={e.id} value={String(e.id)}>
                                                    {e.firstName} {e.lastName}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Is Revisit</FieldLabel>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="edit-isRevisit"
                                                checked={formData.isRevisit}
                                                onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isRevisit: checked }))}
                                            />
                                            <span className="text-sm text-muted-foreground">{formData.isRevisit ? "Yes" : "No"}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Is Breakdown</FieldLabel>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="edit-isBreakDown"
                                                checked={formData.isBreakDown}
                                                onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isBreakDown: checked }))}
                                            />
                                            <span className="text-sm text-muted-foreground">{formData.isBreakDown ? "Yes" : "No"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Driver Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Driver Name</FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='driverName' placeholder="Driver name" onChange={handleChange} value={formData.driverName} className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Driver Mobile No.</FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='driverMobileNo' placeholder="Driver mobile number" onChange={handleChange} value={formData.driverMobileNo} className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {formData.isBreakDown && (
                            <div>
                                <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Breakdown Details</h3></div>
                                <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Breakdown Person Attended</FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='breakdownPersonAttended' placeholder="Person attended" onChange={handleChange} value={formData.breakdownPersonAttended} className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Breakdown Date & Time</FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='breakdownDateTime' type='datetime-local' onChange={handleChange} value={formData.breakdownDateTime} className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Breakdown Start</FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='breakdownStartDateTime' type='datetime-local' onChange={handleChange} value={formData.breakdownStartDateTime} className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Breakdown End</FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='breakdownEndDateTime' type='datetime-local' onChange={handleChange} value={formData.breakdownEndDateTime} className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Dealer Van Start KM</FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='dealerVanStartKm' type='number' placeholder="Dealer van start KM" onChange={handleChange} value={formData.dealerVanStartKm} className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Dealer Van End KM</FieldLabel>
                                        <div className="min-w-0">
                                            <Input name='dealerVanEndKm' type='number' placeholder="Dealer van end KM" onChange={handleChange} value={formData.dealerVanEndKm} className="h-7 rounded-none px-2 text-xs" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="mb-2 flex items-center justify-between bg-muted/40 px-2 py-1">
                                <div>
                                    <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Customer Voice</h3>
                                    <p className="text-[11px] text-muted-foreground">Record what the customer reported along with the observation and action to be taken.</p>
                                </div>
                                <Button type="button" variant="outline"  className="h-6 gap-1 px-2 text-xs" onClick={addCustomerVoice}>
                                    <Plus className="h-3 w-3" />
                                    Add Voice
                                </Button>
                            </div>
                            <div className="rounded border">
                                <Table className="[&_th]:border-r [&_th]:border-slate-200 [&_th:last-child]:border-r-0 [&_td]:border-r [&_td]:border-slate-200 [&_td:last-child]:border-r-0">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[220px]">Action To Be Taken <span className="text-red-500">*</span></TableHead>
                                            <TableHead>Customer Voice Description <span className="text-red-500">*</span></TableHead>
                                            <TableHead>Observation</TableHead>
                                            <TableHead className="w-[80px] text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customerVoices.map((voice, index) => (
                                            <TableRow key={index}>
                                                <TableCell className="align-top">
                                                    <Select
                                                        items={labours.map(l => ({ value: String(l.id), label: l.labourName }))}
                                                        value={voice.labourId || null}
                                                        onValueChange={(value) => handleCustomerVoiceChange(index, "labourId", value ?? "")}
                                                    >
                                                        <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                            <SelectValue placeholder="Select labour" />
                                                        </SelectTrigger>
                                                        <SelectContent align="start" alignItemWithTrigger={false}>
                                                            {labours.map((l) => (
                                                                <SelectItem key={l.id} value={String(l.id)}>
                                                                    {l.labourName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <Textarea
                                                        placeholder="Describe what the customer reported"
                                                        value={voice.customerVoiceDescription}
                                                        onChange={(e) => handleCustomerVoiceChange(index, "customerVoiceDescription", e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <Textarea
                                                        placeholder="Observation noted"
                                                        value={voice.observation}
                                                        onChange={(e) => handleCustomerVoiceChange(index, "observation", e.target.value)}
                                                    />
                                                </TableCell>
                                                <TableCell className="align-top text-right">
                                                    {customerVoices.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive"
                                                            aria-label={`Remove voice ${index + 1}`}
                                                            onClick={() => removeCustomerVoice(index)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter className="gap-2">
                    <Button type="button" variant="outline"   onClick={onClose}>
                        Cancel
                    </Button>
                    <Button type="submit" form="job-card-edit-form"   disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        Update Job Card
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
