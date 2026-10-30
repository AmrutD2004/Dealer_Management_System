import {
  createServiceQuotation,
  findCustomer,
  getLabourList,
  getPartMasterList,
  getRepairOrderList,
  getServiceCategoryList,
  getServiceTypeList,
  getVehicleList,
  updateServiceQuotation,
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
} from "@/components/ui/popover"
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import type { PartMasterListType } from "@/Types/partMasterType"
import type {
  labourListType,
  serviceCategoryListType,
  serviceTypeListType,
} from "@/Types/tenantCreateType"
import type { repairOrderListType } from "@/Types/tenantCreateType"
import type { customerListType } from "@/Types/tenantCreateType"
import type { serviceQuotationListType } from "@/Types/serviceQuotationType"
import { ChevronsUpDown, Loader2, Plus, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

interface VehicleOption {
  id: number
  customerId: number
  vehicleNumber?: string | null
  chassisNumber?: string | null
  currentOdometerReading: number
  isActive: boolean
  brand?: { brandName: string } | null
  model?: { modelName: string } | null
  variant?: { variantName: string; fuelType?: string } | null
}

type DiscountType = "PERCENTAGE" | "AMOUNT"

interface PartLine {
  partId: string
  quantity: string
  discountType: DiscountType
  discountRate: string
}

interface LabourLine {
  labourId: string
  discountType: DiscountType
  discountRate: string
}

interface VoiceLine {
  customerVoice: string
  source: string
}

const actionOptions = [
  { value: "NEW", label: "New" },
  { value: "SUPPLEMENT", label: "Supplement" },
]

const statusOptions = [
  { value: "DRAFT", label: "Draft" },
  { value: "INPROGRESS", label: "In Progress" },
  { value: "APPROVED", label: "Approved" },
  { value: "COMPLETED", label: "Completed" },
  { value: "GENERATED", label: "Generated" },
  { value: "REJECTED", label: "Rejected" },
]

const discountTypeOptions = [
  { value: "PERCENTAGE", label: "Percentage" },
  { value: "AMOUNT", label: "Amount" },
]

const sourceOptions = [
  { value: "CUSTOMER", label: "Customer" },
  { value: "SERVICE_SUPERVISOR", label: "Service Supervisor" },
  { value: "FORM_PREVIOUS_JOB_CARD", label: "From Previous Job Card" },
  { value: "TEST_DRIVE", label: "Test Drive" },
]


const emptyPartLine: PartLine = {
  partId: "",
  quantity: "1",
  discountType: "PERCENTAGE",
  discountRate: "0",
}
const emptyLabourLine: LabourLine = {
  labourId: "",
  discountType: "PERCENTAGE",
  discountRate: "0",
}
const emptyVoiceLine: VoiceLine = { customerVoice: "", source: "CUSTOMER" }

const initialFormData = {
  action: "NEW",
  status: "DRAFT",
  customerId: "",
  vehicleId: "",
  currentReading: "",
  serviceCategoryId: "",
  serviceTypeId: "",
  repairOrderTypeId: "",
  insurancePartyName: "",
  originalQuotationId: "",
}

interface ServiceQuotationCreateFormProps {
  onCancel: () => void
  onCreated?: () => void
  onUpdated?: () => void
  quotation?: serviceQuotationListType | null
}

const getInitialFormData = (quotation?: serviceQuotationListType | null) =>
  quotation
    ? {
        action: quotation.action,
        status: quotation.status,
        customerId: String(quotation.customerId),
        vehicleId: String(quotation.vehicleId),
        currentReading: String(quotation.currentReading),
        serviceCategoryId: String(quotation.serviceCategoryId),
        serviceTypeId: String(quotation.serviceTypeId),
        repairOrderTypeId: String(quotation.repairOrderTypeId),
        insurancePartyName: quotation.insurancePartyName ?? "",
        originalQuotationId: quotation.originalQuotationId
          ? String(quotation.originalQuotationId)
          : "",
      }
    : initialFormData

const getInitialParts = (quotation?: serviceQuotationListType | null) =>
  quotation?.serviceQuotationParts?.length
    ? quotation.serviceQuotationParts.map((part) => ({
        partId: String(part.partId),
        quantity: String(part.quantity),
        discountType: part.discountType,
        discountRate: String(part.discountRate),
      }))
    : [{ ...emptyPartLine }]

const getInitialLabours = (quotation?: serviceQuotationListType | null) =>
  quotation?.serviceQuotationLabours?.length
    ? quotation.serviceQuotationLabours.map((labour) => ({
        labourId: String(labour.labourId),
        discountType: labour.discountType,
        discountRate: String(labour.discountRate),
      }))
    : [{ ...emptyLabourLine }]

const getInitialCustomerVoices = (
  quotation?: serviceQuotationListType | null
) =>
  quotation?.serviceQuotationCustomerVoices?.length
    ? quotation.serviceQuotationCustomerVoices.map((voice) => ({
        customerVoice: voice.customerVoice,
        source: voice.source,
      }))
    : [{ ...emptyVoiceLine }]

export function ServiceQuotationCreateForm({
  onCancel,
  onCreated,
  onUpdated,
  quotation,
}: ServiceQuotationCreateFormProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState(() =>
    getInitialFormData(quotation)
  )
  const [parts, setParts] = useState<PartLine[]>(() =>
    getInitialParts(quotation)
  )
  const [labours, setLabours] = useState<LabourLine[]>(() =>
    getInitialLabours(quotation)
  )
  const [customerVoices, setCustomerVoices] = useState<VoiceLine[]>(() =>
    getInitialCustomerVoices(quotation)
  )

  const [vehicles, setVehicles] = useState<VehicleOption[]>([])
  const [serviceCategories, setServiceCategories] = useState<
    serviceCategoryListType[]
  >([])
  const [serviceTypes, setServiceTypes] = useState<serviceTypeListType[]>([])
  const [repairOrders, setRepairOrders] = useState<repairOrderListType[]>([])
  const [partsMaster, setPartsMaster] = useState<PartMasterListType[]>([])
  const [laboursMaster, setLaboursMaster] = useState<labourListType[]>([])

  const [searchCustomer, setSearchCustomer] = useState<string>("")
  const [customerOpen, setCustomerOpen] = useState<boolean>(false)
  const [findedCustomers, setFindedCustomers] = useState<customerListType[]>([])
  const [selectedCustomer, setSelectedCustomer] =
    useState<customerListType | null>(quotation?.customer ?? null)

  useEffect(() => {
    const load = async () => {
      try {
        const [
          vehicleRes,
          categoryRes,
          typeRes,
          repairRes,
          partRes,
          labourRes,
        ] = await Promise.all([
          getVehicleList(0, 200),
          getServiceCategoryList(),
          getServiceTypeList(0, 200),
          getRepairOrderList(),
          getPartMasterList(),
          getLabourList(0, 200),
        ])
        if (vehicleRes?.success) setVehicles(vehicleRes?.data || [])
        if (categoryRes?.success) setServiceCategories(categoryRes?.data || [])
        if (typeRes?.success) setServiceTypes(typeRes?.data || [])
        if (repairRes?.success) setRepairOrders(repairRes?.data || [])
        if (partRes?.success) setPartsMaster(partRes?.data || [])
        if (labourRes?.success) setLaboursMaster(labourRes?.data || [])
      } catch (err: unknown) {
        toast.add({
          type: "error",
          description: (err as { response?: { data?: { message?: string } } })
            ?.response?.data?.message,
        })
      }
    }
    load()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const updatePart = (index: number, field: keyof PartLine, value: string) => {
    setParts((prev) =>
      prev.map((line, i) => (i === index ? { ...line, [field]: value } : line))
    )
  }

  const updateLabour = (
    index: number,
    field: keyof LabourLine,
    value: string
  ) => {
    setLabours((prev) =>
      prev.map((line, i) => (i === index ? { ...line, [field]: value } : line))
    )
  }

  const updateVoice = (
    index: number,
    field: keyof VoiceLine,
    value: string
  ) => {
    setCustomerVoices((prev) =>
      prev.map((line, i) => (i === index ? { ...line, [field]: value } : line))
    )
  }

  useEffect(() => {
    const handleSearch = async (query: string) => {
      const searchTerm = query.trim()
      if (!searchTerm) {
        setFindedCustomers([])
        return
      }
      try {
        const response = await findCustomer(searchTerm)
        setFindedCustomers(response?.success ? (response.data ?? []) : [])
      } catch {
        setFindedCustomers([])
      }
    }

    const timer = setTimeout(() => {
      handleSearch(searchCustomer)
    }, 800)

    return () => clearTimeout(timer)
  }, [searchCustomer])

  const filteredVehicles = formData.customerId
    ? vehicles.filter(
        (v) =>
          String(v.customerId) === formData.customerId && v.isActive === true
      )
    : vehicles.filter((v) => v.isActive === true)

  const filteredServiceTypes = formData.serviceCategoryId
    ? serviceTypes.filter(
        (s) => String(s.serviceCategoryMasterId) === formData.serviceCategoryId
      )
    : serviceTypes

  const activeParts = partsMaster.filter((p) => p.status === "ACTIVE")
  const activeLabours = laboursMaster.filter((l) => l.isActive)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.customerId ||
      !formData.vehicleId ||
      !formData.currentReading ||
      !formData.serviceCategoryId ||
      !formData.serviceTypeId ||
      !formData.repairOrderTypeId
    ) {
      toast.add({
        type: "error",
        description: "Please fill all the required fields",
      })
      return
    }

    if (formData.action === "SUPPLEMENT" && !formData.originalQuotationId) {
      toast.add({
        type: "error",
        description:
          "Original quotation id is required for a supplement quotation",
      })
      return
    }

    const filledParts = parts.filter(
      (line) => line.partId || line.discountRate !== "0"
    )
    if (
      filledParts.some((line) => !line.partId || Number(line.quantity) <= 0)
    ) {
      toast.add({
        type: "error",
        description:
          "Each part line needs a part and a quantity greater than zero",
      })
      return
    }

    const filledLabours = labours.filter(
      (line) => line.labourId || line.discountRate !== "0"
    )
    if (filledLabours.some((line) => !line.labourId)) {
      toast.add({
        type: "error",
        description: "Each labour line needs a labour",
      })
      return
    }

    const filledVoices = customerVoices.filter((line) =>
      line.customerVoice.trim()
    )
    if (filledVoices.some((line) => !line.source)) {
      toast.add({
        type: "error",
        description: "Each customer voice needs a source",
      })
      return
    }

    setLoading(true)
    try {
      const payload = {
        action: formData.action,
        status: formData.status,
        vehicleId: Number(formData.vehicleId),
        customerId: Number(formData.customerId),
        currentReading: Number(formData.currentReading),
        serviceCategoryId: Number(formData.serviceCategoryId),
        serviceTypeId: Number(formData.serviceTypeId),
        repairOrderTypeId: Number(formData.repairOrderTypeId),
        insurancePartyName: formData.insurancePartyName.trim() || null,
        originalQuotationId:
          formData.action === "SUPPLEMENT"
            ? Number(formData.originalQuotationId)
            : null,
        parts: filledParts.map((line) => ({
          partId: Number(line.partId),
          quantity: Number(line.quantity),
          discountType: line.discountType,
          discountRate: Number(line.discountRate || 0),
        })),
        labours: filledLabours.map((line) => ({
          labourId: Number(line.labourId),
          discountType: line.discountType,
          discountRate: Number(line.discountRate || 0),
        })),
        customerVoices: filledVoices.map((line) => ({
          customerVoice: line.customerVoice.trim(),
          source: line.source,
        })),
      }

      const data = quotation
        ? await updateServiceQuotation(payload, quotation.id)
        : await createServiceQuotation(payload)
      if (data?.success) {
        toast.add({
          type: "success",
          description: data?.message,
        })
        if (quotation) {
          setTimeout(() => {
            onUpdated?.()
          }, 1000)
        } else {
          setFormData(initialFormData)
          setParts([{ ...emptyPartLine }])
          setLabours([{ ...emptyLabourLine }])
          setCustomerVoices([{ ...emptyVoiceLine }])
          setTimeout(() => {
            onCreated?.()
          }, 1500)
        }
      }
      if (!data?.success) {
        toast.add({
          type: "error",
          description: data?.message,
        })
      }
    } catch (err: unknown) {
      toast.add({
        type: "error",
        description: (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form id="service-quotation-form" onSubmit={handleSubmit}>
      <div className="space-y-4 py-3">
        <div>
          <div className="mb-2 bg-muted/40 px-2 py-1">
            <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
              Quotation Details
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <FieldLabel className="text-xs font-medium">
                Action <span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                items={actionOptions}
                value={formData.action || null}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, action: value ?? "NEW" }))
                }
                required
              >
                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false}>
                  {actionOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <FieldLabel className="text-xs font-medium">
                Status <span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                items={statusOptions}
                value={formData.status || null}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value ?? "DRAFT" }))
                }
                required
              >
                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false}>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {formData.action === "SUPPLEMENT" && (
              <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                <FieldLabel className="text-xs font-medium">
                  Original Quotation <span className="text-red-500">*</span>
                </FieldLabel>
                <Input
                  name="originalQuotationId"
                  type="number"
                  placeholder="Original quotation id"
                  required
                  value={formData.originalQuotationId}
                  onChange={handleChange}
                  className="h-7 rounded-none px-2 text-xs"
                />
              </div>
            )}
            
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 lg:col-span-2">
              <FieldLabel className="text-xs font-medium">
                Insurance Party
              </FieldLabel>
              <Input
                name="insurancePartyName"
                placeholder="Insurance party name"
                value={formData.insurancePartyName}
                onChange={handleChange}
                className="h-7 rounded-none px-2 text-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 bg-muted/40 px-2 py-1">
            <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
              Customer & Vehicle
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <FieldLabel className="text-xs font-medium">
                Customer <span className="text-red-500">*</span>
              </FieldLabel>
              <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                <PopoverTrigger>
                  <Button
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={customerOpen}
                    className="h-7 w-full justify-between rounded-none px-2 text-xs font-normal"
                  >
                    {selectedCustomer
                      ? `${selectedCustomer.firstName} ${selectedCustomer.lastName} - ${selectedCustomer.mobileNo}`
                      : "Select customer"}
                    <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="center" className="p-0 md:w-md lg:w-117">
                  <Command shouldFilter={false}>
                    <CommandInput
                      placeholder="Enter customer name or mobile..."
                      value={searchCustomer}
                      onValueChange={setSearchCustomer}
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
                                  vehicleId: "",
                                  currentReading: "",
                                }))
                                setCustomerOpen(false)
                                setSearchCustomer("")
                                setSelectedCustomer(c);
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
              <FieldLabel className="text-xs font-medium">
                Vehicle <span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                disabled={!formData.customerId}
                items={filteredVehicles.map((v) => ({
                  value: String(v.id),
                  label: `${v.vehicleNumber || v.chassisNumber} - ${v.brand?.brandName ?? ""} ${v.model?.modelName ?? ""} ${v.variant?.variantName ?? ""}`,
                }))}
                value={formData.vehicleId || null}
                onValueChange={(value) => {
                  const selectedVehicle = filteredVehicles.find(
                    (v) => String(v.id) === value
                  )
                  setFormData((prev) => ({
                    ...prev,
                    vehicleId: value ?? "",
                    currentReading: selectedVehicle
                      ? String(selectedVehicle.currentOdometerReading)
                      : "",
                  }))
                }}
                required
              >
                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false}>
                  {filteredVehicles.map((v) => (
                    <SelectItem key={v.id} value={String(v.id)}>
                      {v.vehicleNumber || v.chassisNumber} -{" "}
                      {v.brand?.brandName} {v.model?.modelName}{" "}
                      {v.variant?.variantName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <FieldLabel className="text-xs font-medium">
                Current Reading <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                name="currentReading"
                type="number"
                placeholder="Current KM reading"
                required
                value={formData.currentReading}
                onChange={handleChange}
                className="h-7 rounded-none px-2 text-xs"
              />
            </div>
            <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <FieldLabel className="text-xs font-medium">
                Service Category <span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                items={serviceCategories.map((s) => ({
                  value: String(s.id),
                  label: s.name,
                }))}
                value={formData.serviceCategoryId || null}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    serviceCategoryId: value ?? "",
                    serviceTypeId: "",
                  }))
                }
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
              <FieldLabel className="text-xs font-medium">
                Service Type <span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                disabled={!formData.serviceCategoryId}
                items={filteredServiceTypes.map((s) => ({
                  value: String(s.id),
                  label: s.name,
                }))}
                value={formData.serviceTypeId || null}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    serviceTypeId: value ?? "",
                  }))
                }
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
              <FieldLabel className="text-xs font-medium">
                Repair Order Type <span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                items={repairOrders.map((r) => ({
                  value: String(r.id),
                  label: r.name,
                }))}
                value={formData.repairOrderTypeId || null}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    repairOrderTypeId: value ?? "",
                  }))
                }
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
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between bg-muted/40 px-2 py-1">
            <div>
              <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
                Parts
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Rates and taxes are resolved from the part master.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-6 gap-1 px-2 text-xs"
              onClick={() =>
                setParts((prev) => [...prev, { ...emptyPartLine }])
              }
            >
              <Plus className="h-3 w-3" />
              Add Part
            </Button>
          </div>
          <div className="rounded border">
            <Table className="[&_td]:border-r [&_td]:border-slate-200 [&_td]:px-2 [&_td]:py-1 [&_td:last-child]:border-r-0 [&_th]:h-7 [&_th]:border-r [&_th]:border-slate-200 [&_th]:px-2 [&_th]:text-xs [&_th:last-child]:border-r-0">
              <TableHeader>
                <TableRow>
                  <TableHead>Part</TableHead>
                  <TableHead className="w-[200px]">Quantity</TableHead>
                  <TableHead className="w-[200px]">Discount Type</TableHead>
                  <TableHead className="w-[200px]">Discount</TableHead>
                  <TableHead className="w-[60px] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {parts.map((line, index) => (
                  <TableRow key={index}>
                    <TableCell className="align-top">
                      <Select
                        items={activeParts.map((p) => ({
                          value: String(p.id),
                          label: `${p.partNo} - ${p.partDescription}`,
                        }))}
                        value={line.partId || null}
                        onValueChange={(value) =>
                          updatePart(index, "partId", value ?? "")
                        }
                      >
                        <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                          <SelectValue placeholder="Select part" />
                        </SelectTrigger>
                        <SelectContent
                          align="start"
                          alignItemWithTrigger={false}
                        >
                          {activeParts.map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.partNo} - {p.partDescription}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        type="number"
                        min={1}
                        value={line.quantity}
                        onChange={(e) =>
                          updatePart(index, "quantity", e.target.value)
                        }
                        className="h-7 rounded-none px-2 text-xs"
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Select
                        items={discountTypeOptions}
                        value={line.discountType || null}
                        onValueChange={(value) =>
                          updatePart(
                            index,
                            "discountType",
                            value ?? "PERCENTAGE"
                          )
                        }
                      >
                        <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent
                          align="start"
                          alignItemWithTrigger={false}
                        >
                          {discountTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        type="number"
                        min={0}
                        value={line.discountRate}
                        onChange={(e) =>
                          updatePart(index, "discountRate", e.target.value)
                        }
                        className="h-7 rounded-none px-2 text-xs"
                      />
                    </TableCell>
                    <TableCell className="text-right align-top">
                      {parts.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          aria-label={`Remove part ${index + 1}`}
                          onClick={() =>
                            setParts((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
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

        <div>
          <div className="mb-2 flex items-center justify-between bg-muted/40 px-2 py-1">
            <div>
              <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
                Labours
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Hours and rates are resolved from the labour master.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-6 gap-1 px-2 text-xs"
              onClick={() =>
                setLabours((prev) => [...prev, { ...emptyLabourLine }])
              }
            >
              <Plus className="h-3 w-3" />
              Add Labour
            </Button>
          </div>
          <div className="rounded border">
            <Table className="[&_td]:border-r [&_td]:border-slate-200 [&_td]:px-2 [&_td]:py-1 [&_td:last-child]:border-r-0 [&_th]:h-7 [&_th]:border-r [&_th]:border-slate-200 [&_th]:px-2 [&_th]:text-xs [&_th:last-child]:border-r-0">
              <TableHeader>
                <TableRow>
                  <TableHead>Labour</TableHead>
                  <TableHead className="w-[400px]">Discount Type</TableHead>
                  <TableHead className="w-[200px]">Discount</TableHead>
                  <TableHead className="w-[60px] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {labours.map((line, index) => (
                  <TableRow key={index}>
                    <TableCell className="align-top">
                      <Select
                        items={activeLabours.map((l) => ({
                          value: String(l.id),
                          label: `${l.labourCode} - ${l.labourName}`,
                        }))}
                        value={line.labourId || null}
                        onValueChange={(value) =>
                          updateLabour(index, "labourId", value ?? "")
                        }
                      >
                        <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                          <SelectValue placeholder="Select labour" />
                        </SelectTrigger>
                        <SelectContent
                          align="start"
                          alignItemWithTrigger={false}
                        >
                          {activeLabours.map((l) => (
                            <SelectItem key={l.id} value={String(l.id)}>
                              {l.labourCode} - {l.labourName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="align-top">
                      <Select
                        items={discountTypeOptions}
                        value={line.discountType || null}
                        onValueChange={(value) =>
                          updateLabour(
                            index,
                            "discountType",
                            value ?? "PERCENTAGE"
                          )
                        }
                      >
                        <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent
                          align="start"
                          alignItemWithTrigger={false}
                        >
                          {discountTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="align-top">
                      <Input
                        type="number"
                        min={0}
                        value={line.discountRate}
                        onChange={(e) =>
                          updateLabour(index, "discountRate", e.target.value)
                        }
                        className="h-7 rounded-none px-2 text-xs"
                      />
                    </TableCell>
                    <TableCell className="text-right align-top">
                      {labours.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          aria-label={`Remove labour ${index + 1}`}
                          onClick={() =>
                            setLabours((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
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

        <div>
          <div className="mb-2 flex items-center justify-between bg-muted/40 px-2 py-1">
            <div>
              <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
                Customer Voice
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Record the customer reported issues and their source.
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              className="h-6 gap-1 px-2 text-xs"
              onClick={() =>
                setCustomerVoices((prev) => [...prev, { ...emptyVoiceLine }])
              }
            >
              <Plus className="h-3 w-3" />
              Add Voice
            </Button>
          </div>
          <div className="rounded border">
            <Table className="[&_td]:border-r [&_td]:border-slate-200 [&_td]:px-2 [&_td]:py-1 [&_td:last-child]:border-r-0 [&_th]:h-7 [&_th]:border-r [&_th]:border-slate-200 [&_th]:px-2 [&_th]:text-xs [&_th:last-child]:border-r-0">
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Voice</TableHead>
                  <TableHead className="w-[200px]">Source</TableHead>
                  <TableHead className="w-[60px] text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerVoices.map((line, index) => (
                  <TableRow key={index}>
                    <TableCell className="align-top">
                      <Textarea
                        placeholder="Describe what the customer reported"
                        value={line.customerVoice}
                        onChange={(e) =>
                          updateVoice(index, "customerVoice", e.target.value)
                        }
                        className="min-h-[48px] rounded-none px-2 py-1 text-xs"
                      />
                    </TableCell>
                    <TableCell className="align-top">
                      <Select
                        items={sourceOptions}
                        value={line.source || null}
                        onValueChange={(value) =>
                          updateVoice(index, "source", value ?? "CUSTOMER")
                        }
                      >
                        <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent
                          align="start"
                          alignItemWithTrigger={false}
                        >
                          {sourceOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right align-top">
                      {customerVoices.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-destructive"
                          aria-label={`Remove voice ${index + 1}`}
                          onClick={() =>
                            setCustomerVoices((prev) =>
                              prev.filter((_, i) => i !== index)
                            )
                          }
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

      <div className="m-5 flex justify-end gap-2 border-t border-slate-200 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
          {quotation ? "Update Service Quotation" : "Create Service Quotation"}
        </Button>
      </div>
    </form>
  )
}
