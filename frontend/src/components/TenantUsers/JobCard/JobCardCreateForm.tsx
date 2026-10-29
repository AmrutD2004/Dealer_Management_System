import {
    createJobCard,
    findCustomer,
    getCustomerList,
    getEmployeeList,
    getLabourList,
    getRepairOrderList,
    getServiceCategoryList,
    getServiceTypeList,
    getTenantBranchList,
    getVehicleList,
} from "@/api/endpoints"
import { Button } from "@/components/ui/button"
import { FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover";

import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command";

import { ChevronsUpDown } from "lucide-react";
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { type customerListType, type labourListType } from "@/Types/tenantCreateType"
import dayjs from "dayjs"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

const toISO = (value: string) => (value ? dayjs(value).toISOString() : null)

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

interface JobCardCreateFormProps {
    onCancel: () => void
    onCreated?: () => void
}

const vehicleStatusOptions = [
    { value: "MOBILIZE", label: "Mobilize" },
    { value: "IMMOBILIZE", label: "Immobilize" },
]

const initialFormData = {
    branchId: "",
    customerId: "",
    vehicleId: "",
    vehicleInTime: "",
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

export function JobCardCreateForm({ onCancel, onCreated }: JobCardCreateFormProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [formData, setFormData] = useState(initialFormData)
    const [branches, setBranches] = useState<any[]>([])
    const [vehicles, setVehicles] = useState<any[]>([])
    const [serviceCategories, setServiceCategories] = useState<any[]>([])
    const [serviceTypes, setServiceTypes] = useState<any[]>([])
    const [repairOrders, setRepairOrders] = useState<any[]>([])
    const [employees, setEmployees] = useState<any[]>([])
    const [labours, setLabours] = useState<labourListType[]>([])
    const [customerVoices, setCustomerVoices] = useState<CustomerVoiceForm[]>([{ ...emptyCustomerVoice }])
    const [searchCustomer, setSearchCustomer] = useState<string>('')
    const [customerOpen, setCustomerOpen] = useState<boolean>(false)
    const [findedCustomers, setFindedCustomers] = useState<customerListType[]>([])
    const [searchingCustomers, setSearchingCustomers] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [branchRes, vehicleRes, categoryRes, typeRes, repairRes, employeeRes, labourRes] = await Promise.all([
                    getTenantBranchList(0, 100),
                    getVehicleList(0, 100),
                    getServiceCategoryList(),
                    getServiceTypeList(0, 100),
                    getRepairOrderList(),
                    getEmployeeList(0, 100),
                    getLabourList(0, 100),
                ])
                if (branchRes?.success) setBranches(branchRes?.data || [])
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
        fetchData()
    }, [])

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
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
                vehicleInTime: formData.vehicleInTime,
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
                customerVoices: filledVoices.map((voice) => ({
                    labourId: Number(voice.labourId),
                    customerVoiceDescription: voice.customerVoiceDescription,
                    observation: voice.observation || "",
                })),
            }
            const data = await createJobCard(payload)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                setFormData(initialFormData)
                setCustomerVoices([{ ...emptyCustomerVoice }])
                setTimeout(() => {
                    onCreated?.()
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
        ? vehicles.filter(
            (v) =>
                String(v.customerId) === formData.customerId &&
                v.isActive === true
        )
        : vehicles.filter((v) => v.isActive === true)

    const filteredServiceTypes = formData.serviceCategoryId
        ? serviceTypes.filter((s) => String(s.serviceCategoryMasterId) === formData.serviceCategoryId)
        : serviceTypes

   const handleSearch = async (query: string) => {
    const searchTerm = query.trim();

    if (!searchTerm) {
        setFindedCustomers([]);
        setSearchingCustomers(false);
        return;
    }

    setSearchingCustomers(true);

    try {
        const response = await findCustomer(searchTerm);

        if (response?.success) {
            setFindedCustomers(response.data ?? []);
        } else {
            setFindedCustomers([]);
        }
    } catch (err: any) {
        setFindedCustomers([]);
    } finally {
        setSearchingCustomers(false);
    }
};
    useEffect(() => {
        const timer = setTimeout(() => {
            handleSearch(searchCustomer);
        }, 800);

        return () => clearTimeout(timer);
    }, [searchCustomer])
    return (
        <form id="job-card-form" onSubmit={handleSubmit}>
            <div className="space-y-4 py-3">
                <div>
                    <div className="mb-2 bg-muted/40 px-2 py-1">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Customer & Vehicle</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Branch <span className="text-red-500">*</span></FieldLabel>
                            <Select
                                items={branches.map((b) => ({ value: String(b.id), label: b.branchName }))}
                                value={formData.branchId || null}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, branchId: value ?? "" }))}
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
                            <FieldLabel className="text-xs font-medium">
                                Customer <span className="text-red-500">*</span>
                            </FieldLabel>

                            <Popover open={customerOpen} onOpenChange={setCustomerOpen} >
                                <PopoverTrigger>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={customerOpen}
                                        className="h-7 w-full justify-between rounded-none px-2 text-xs font-normal"
                                    >
                                        {findedCustomers.find(
                                            (c) => String(c.id) === formData.customerId
                                        )
                                            ? (() => {
                                                const c = findedCustomers.find(
                                                    (c) => String(c.id) === formData.customerId
                                                )!;
                                                return `${c.firstName} ${c.lastName} - ${c.mobileNo}`;
                                            })()
                                            : "Select customer"}

                                        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>

                                <PopoverContent
                                    align="center"
                                    className="p-0 lg:w-117 md:w-md"
                                >
                                    <Command shouldFilter={false} className="w-">
                                        <CommandInput
                                            placeholder="Enter customer name or mobile..."
                                            value={searchCustomer}
                                            onValueChange={(setSearchCustomer)}
                                            className="h-8 text-xs"
                                        />

                                        <CommandList>
                                            {findedCustomers.length === 0 ? (
                                                <CommandEmpty className="py-3 text-xs">
                                                    No customers found.
                                                </CommandEmpty>
                                            ) : (
                                                <CommandGroup>
                                                    {findedCustomers.map((c) => (
                                                        <CommandItem
                                                            key={c.id}
                                                            value={String(c.id)}
                                                            onSelect={() => {
                                                                setFormData((prev) => ({
                                                                    ...prev,
                                                                    customerId: String(c.id),
                                                                }));
                                                                setCustomerOpen(false);
                                                                setSearchCustomer("");
                                                            }}
                                                            className="text-xs"
                                                        >
                                                            {c.firstName} {c.lastName} - {c.mobileNo}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            )}
                                        </CommandList>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Vehicle <span className="text-red-500">*</span></FieldLabel>
                            <Select
                                disabled={!formData.customerId}
                                items={filteredVehicles.map(v => ({ value: String(v.id), label: `${v.vehicleNumber || v.chassisNumber} - ${v.brand?.brandName} ${v.model?.modelName} ${v.variant?.variantName} ${v.variant?.fuelType}` }))}
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
                                            {v.vehicleNumber || v.chassisNumber} - {v.brand?.brandName} {v.model?.modelName} {v.variant?.variantName} {v.variant?.fuelType}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Vehicle In Time<span className="text-red-500">*</span></FieldLabel>
                            <Input required name="vehicleInTime" type="datetime-local" value={formData.vehicleInTime} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Service Category <span className="text-red-500">*</span></FieldLabel>
                            <Select
                                items={serviceCategories.map(s => ({ value: String(s.id), label: s.name }))}
                                value={formData.serviceCategoryId || null}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, serviceCategoryId: value ?? "", serviceTypeId: "" }))}
                                required
                            >
                                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                    <SelectValue placeholder="Select" />
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
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Service Type <span className="text-red-500">*</span></FieldLabel>
                            <Select
                                disabled={!formData.serviceCategoryId}
                                items={filteredServiceTypes.map(s => ({ value: String(s.id), label: s.name }))}
                                value={formData.serviceTypeId || null}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, serviceTypeId: value ?? "" }))}
                                required
                            >
                                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                    <SelectValue placeholder="Select" />
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
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Repair Order Type <span className="text-red-500">*</span></FieldLabel>
                            <Select
                                items={repairOrders.map(r => ({ value: String(r.id), label: r.name }))}
                                value={formData.repairOrderTypeId || null}
                                onValueChange={(value) => setFormData(prev => ({ ...prev, repairOrderTypeId: value ?? "" }))}
                                required
                            >
                                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                    <SelectValue placeholder="Select" />
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
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Vehicle Status <span className="text-red-500">*</span></FieldLabel>
                            <Select
                                items={vehicleStatusOptions.map((vs) => ({ value: vs.value, label: vs.label }))}
                                value={formData.vehicleStatus || null}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, vehicleStatus: value ?? "" }))}
                                required
                            >
                                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent align="start" alignItemWithTrigger={false}>
                                    {vehicleStatusOptions.map((vs) => (
                                        <SelectItem key={vs.value} value={vs.value}>
                                            {vs.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Current KM <span className="text-red-500">*</span></FieldLabel>
                            <Input name="currentKmReading" type="number" placeholder="Current KM" required value={formData.currentKmReading} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Previous KM</FieldLabel>
                            <Input name="previousKmReading" type="number" placeholder="Previous KM" value={formData.previousKmReading} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 lg:col-span-2 xl:col-span-1">
                            <FieldLabel className="text-xs font-medium">Est. Job Card Close <span className="text-red-500">*</span></FieldLabel>
                            <Input name="estimateCloseJobcardAt" type="datetime-local" required value={formData.estimateCloseJobcardAt} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="mb-2 bg-muted/40 px-2 py-1">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Assignment</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Supervisor</FieldLabel>
                            <Select
                                items={employees.map((e) => ({ value: String(e.id), label: `${e.firstName} ${e.lastName}` }))}
                                value={formData.supervisorId || null}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, supervisorId: value ?? "" }))}
                            >
                                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent align="start" alignItemWithTrigger={false}>
                                    {employees.filter((f) => f.role.roleCode === 'SUPERVISOR').map((e) => (
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
                                items={employees.map((e) => ({ value: String(e.id), label: `${e.firstName} ${e.lastName}` }))}
                                value={formData.technicianId || null}
                                onValueChange={(value) => setFormData((prev) => ({ ...prev, technicianId: value ?? "" }))}
                            >
                                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                    <SelectValue placeholder="Select" />
                                </SelectTrigger>
                                <SelectContent align="start" alignItemWithTrigger={false}>
                                    {employees.filter((f) => f.role.roleCode === 'TECHNICIAN').map((e) => (
                                        <SelectItem key={e.id} value={String(e.id)}>
                                            {e.firstName} {e.lastName}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Driver Name</FieldLabel>
                            <Input name="driverName" placeholder="Driver Name" value={formData.driverName} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                        </div>
                        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                            <FieldLabel className="text-xs font-medium">Driver Mobile</FieldLabel>
                            <Input name="driverMobileNo" placeholder="Driver Mobile No" value={formData.driverMobileNo} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="mb-2 bg-muted/40 px-2 py-1">
                        <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Additional Details</h3>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between rounded border p-2">
                            <div>
                                <p className="text-xs font-medium">Revisit</p>
                                <p className="text-xs text-muted-foreground">Mark if this is a revisit job card</p>
                            </div>
                            <Switch checked={formData.isRevisit} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isRevisit: checked }))} />
                        </div>
                        <div className="flex items-center justify-between rounded border p-2">
                            <div>
                                <p className="text-xs font-medium">Breakdown</p>
                                <p className="text-xs text-muted-foreground">Mark if this is a breakdown case</p>
                            </div>
                            <Switch checked={formData.isBreakDown} onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isBreakDown: checked }))} />
                        </div>
                    </div>
                    {formData.isBreakDown && (
                        <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                <FieldLabel className="text-xs font-medium">Person Attended</FieldLabel>
                                <Input name="breakdownPersonAttended" placeholder="Person Attended" value={formData.breakdownPersonAttended} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                <FieldLabel className="text-xs font-medium">Breakdown Date & Time</FieldLabel>
                                <Input name="breakdownDateTime" type="datetime-local" value={formData.breakdownDateTime} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                <FieldLabel className="text-xs font-medium">Breakdown Start</FieldLabel>
                                <Input name="breakdownStartDateTime" type="datetime-local" value={formData.breakdownStartDateTime} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                <FieldLabel className="text-xs font-medium">Breakdown End</FieldLabel>
                                <Input name="breakdownEndDateTime" type="datetime-local" value={formData.breakdownEndDateTime} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                <FieldLabel className="text-xs font-medium">Van Start KM</FieldLabel>
                                <Input name="dealerVanStartKm" type="number" placeholder="Start KM" value={formData.dealerVanStartKm} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                <FieldLabel className="text-xs font-medium">Van End KM</FieldLabel>
                                <Input name="dealerVanEndKm" type="number" placeholder="End KM" value={formData.dealerVanEndKm} onChange={handleChange} className="h-7 rounded-none px-2 text-xs" />
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <div className="mb-2 flex items-center justify-between bg-muted/40 px-2 py-1">
                        <div>
                            <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Customer Voice</h3>
                            <p className="text-[11px] text-muted-foreground">Record customer reported issues with observation/action.</p>
                        </div>
                        <Button type="button" variant="outline" className="h-6 gap-1 px-2 text-xs" onClick={addCustomerVoice}>
                            <Plus className="h-3 w-3" />
                            Add Voice
                        </Button>
                    </div>
                    <div className="rounded border">
                        <Table className="[&_th]:border-r [&_th]:border-slate-200 [&_th]:h-7 [&_th]:px-2 [&_th]:text-xs [&_th:last-child]:border-r-0 [&_td]:border-r [&_td]:border-slate-200 [&_td]:px-2 [&_td]:py-1 [&_td:last-child]:border-r-0">
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Action To Be Taken <span className="text-red-500">*</span></TableHead>
                                    <TableHead>Customer Voice Description <span className="text-red-500">*</span></TableHead>
                                    <TableHead>Observation</TableHead>
                                    <TableHead className="w-[60px] text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {customerVoices.map((voice, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="align-top">
                                            <Select
                                                items={labours.map((l) => ({ value: String(l.id), label: l.labourName }))}
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
                                                className="min-h-[48px] rounded-none px-2 py-1 text-xs"
                                            />
                                        </TableCell>
                                        <TableCell className="align-top">
                                            <Textarea
                                                placeholder="Observation noted"
                                                value={voice.observation}
                                                onChange={(e) => handleCustomerVoiceChange(index, "observation", e.target.value)}
                                                className="min-h-[48px] rounded-none px-2 py-1 text-xs"
                                            />
                                        </TableCell>
                                        <TableCell className="align-top text-right">
                                            {customerVoices.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 text-destructive"
                                                    aria-label={`Remove voice ${index + 1}`}
                                                    onClick={() => removeCustomerVoice(index)}
                                                >
                                                    <Trash2 className="h-3 w-3" />
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
            <div className="flex justify-end gap-2 border-t border-slate-200 pt-4 m-5">
                <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                    Create Job Card
                </Button>
            </div>
        </form>
    )
}
