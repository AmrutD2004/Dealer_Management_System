import {
  createServiceAppointment,
  findCustomer,
  getEmployeeList,
  getRepairOrderList,
  getServiceAppointmentList,
  getServiceCategoryList,
  getServiceTypeList,
  getVehicleList,
  updateServiceAppointment,
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
import type {
  customerListType,
  employeeListType,
  repairOrderListType,
  serviceCategoryListType,
  serviceTypeListType,
} from "@/Types/tenantCreateType"
import type { serviceAppointmentListType } from "@/Types/serviceAppointmentType"
import { cn } from "@/lib/utils"
import { ChevronsUpDown, Loader2, Plus, Trash2 } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import {
  actionOptions,
  cancleReasonOptions,
  formatDateTimeInput,
  sourceOptions,
  statusOptions,
  toISO,
} from "./appointmentUtils"

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

interface VoiceLine {
  customerVoice: string
}

const emptyVoiceLine: VoiceLine = { customerVoice: "" }

const initialFormData = {
  action: "NEW_REQUIREMENT",
  status: "OPEN",
  source: "INWARD_CALL",
  customerId: "",
  vehicleId: "",
  currentReading: "",
  serviceCategoryId: "",
  serviceTypeId: "",
  repairOrderTypeId: "",
  creId: "",
  serviceAdvisorId: "",
  cancleReason: "",
  estimateCharge: "",
  appointOn: "",
  callDateAndTime: "",
  originalAppointmentId: "",
}

const getInitialFormData = (appointment?: serviceAppointmentListType | null) =>
  appointment
    ? {
      action: appointment.action,
      status: appointment.status,
      source: appointment.source,
      customerId: String(appointment.customerId),
      vehicleId: String(appointment.vehicleId),
      currentReading: appointment.currentReading
        ? String(appointment.currentReading)
        : "",
      serviceCategoryId: String(appointment.serviceCategoryId),
      serviceTypeId: String(appointment.serviceTypeId),
      repairOrderTypeId: String(appointment.repairOrderTypeId),
      creId: String(appointment.creId),
      serviceAdvisorId: String(appointment.serviceAdvisorId),
      cancleReason: appointment.cancleReason ?? "",
      estimateCharge:
        appointment.estimateCharge === null ||
          appointment.estimateCharge === undefined
          ? ""
          : String(appointment.estimateCharge),
      appointOn: formatDateTimeInput(appointment.appointOn),
      callDateAndTime: formatDateTimeInput(appointment.callDateAndTime),
      originalAppointmentId: appointment.originalAppointmentId
        ? String(appointment.originalAppointmentId)
        : "",
    }
    : initialFormData

const getInitialCustomerVoices = (
  appointment?: serviceAppointmentListType | null
) =>
  appointment?.serviceAppointmentCustomerVoice?.length
    ? appointment.serviceAppointmentCustomerVoice.map((voice) => ({
      customerVoice: voice.customerVoice,
    }))
    : [{ ...emptyVoiceLine }]

interface ServiceAppointmentCreateFormProps {
  onCancel: () => void
  onCreated?: (appointment?: serviceAppointmentListType) => void
  onUpdated?: () => void
  appointment?: serviceAppointmentListType | null
}

export function ServiceAppointmentCreateForm({
  onCancel,
  onCreated,
  onUpdated,
  appointment,
}: ServiceAppointmentCreateFormProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState(() => getInitialFormData(appointment))
  const [customerVoices, setCustomerVoices] = useState<VoiceLine[]>(() =>
    getInitialCustomerVoices(appointment)
  )

  const [appointments, setAppointments] = useState<serviceAppointmentListType[]>([])
  const [vehicles, setVehicles] = useState<VehicleOption[]>([])
  const [serviceCategories, setServiceCategories] = useState<
    serviceCategoryListType[]
  >([])
  const [serviceTypes, setServiceTypes] = useState<serviceTypeListType[]>([])
  const [repairOrders, setRepairOrders] = useState<repairOrderListType[]>([])
  const [employees, setEmployees] = useState<employeeListType[]>([])

  const [searchCustomer, setSearchCustomer] = useState<string>("")
  const [customerOpen, setCustomerOpen] = useState<boolean>(false)
  const [findedCustomers, setFindedCustomers] = useState<customerListType[]>([])
  const [selectedCustomer, setSelectedCustomer] =
    useState<customerListType | null>(appointment?.customer ?? null)
  const [originalAppointmentOpen, setOriginalAppointmentOpen] =
    useState<boolean>(false)
  const [searchOriginalAppointment, setSearchOriginalAppointment] =
    useState<string>("")

  useEffect(() => {
    const load = async () => {
      try {
        const [
          vehicleRes,
          categoryRes,
          typeRes,
          repairRes,
          employeeRes,
        ] = await Promise.all([
          getVehicleList(0, 200),
          getServiceCategoryList(),
          getServiceTypeList(0, 200),
          getRepairOrderList(),
          getEmployeeList(0, 200),
        ])
        if (vehicleRes?.success) setVehicles(vehicleRes?.data || [])
        if (categoryRes?.success) setServiceCategories(categoryRes?.data || [])
        if (typeRes?.success) setServiceTypes(typeRes?.data || [])
        if (repairRes?.success) setRepairOrders(repairRes?.data || [])
        if (employeeRes?.success) setEmployees(employeeRes?.data || [])
      } catch (err: unknown) {
        toast.add({
          type: "error",
          description: (err as { response?: { data?: { message?: string } } })
            ?.response?.data?.message,
        })
      }

      try {
        const appointmentRes = await getServiceAppointmentList()
        if (appointmentRes?.success) {
          setAppointments(
            Array.isArray(appointmentRes?.data) ? appointmentRes.data : []
          )
        }
      } catch {
        setAppointments([])
      }
    }
    load()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const updateVoice = (index: number, value: string) => {
    setCustomerVoices((prev) =>
      prev.map((line, i) =>
        i === index ? { ...line, customerVoice: value } : line
      )
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

  const activeEmployees = employees.filter((e) => e.isActive)

  const originalAppointmentOptions = useMemo(
    () =>
      appointments.filter(
        (item) =>
          item.id !== appointment?.id && item.status !== "CANCEL"
      ),
    [appointments, appointment?.id]
  )
  const filteredOriginalAppointmentOptions = useMemo(() => {
    const searchTerm = searchOriginalAppointment.trim().toLowerCase()
    if (!searchTerm) return originalAppointmentOptions
    return originalAppointmentOptions.filter((item) =>
      item.appointmentNo.toLowerCase().includes(searchTerm)
    )
  }, [originalAppointmentOptions, searchOriginalAppointment])
  const selectedOriginalAppointment = appointments.find(
    (item) => String(item.id) === formData.originalAppointmentId
  )

  const showCancelReason =
    formData.status === "CANCEL" || formData.action === "CANCEL"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.customerId ||
      !formData.vehicleId ||
      !formData.serviceCategoryId ||
      !formData.serviceTypeId ||
      !formData.repairOrderTypeId ||
      !formData.creId ||
      !formData.serviceAdvisorId ||
      !formData.appointOn ||
      !formData.callDateAndTime ||
      !formData.source
    ) {
      toast.add({
        type: "error",
        description: "Please fill all the required fields",
      })
      return
    }

    if (formData.action === "RE_SCHEDULE" && !formData.originalAppointmentId) {
      toast.add({
        type: "error",
        description:
          "Original appointment is required for a re-schedule appointment",
      })
      return
    }

    const filledVoices = customerVoices.filter((line) =>
      line.customerVoice.trim()
    )

    setLoading(true)
    try {
      const payload = {
        action: formData.action,
        status: formData.status,
        vehicleId: Number(formData.vehicleId),
        customerId: Number(formData.customerId),
        currentReading: formData.currentReading.trim() || null,
        serviceCategoryId: Number(formData.serviceCategoryId),
        serviceTypeId: Number(formData.serviceTypeId),
        repairOrderTypeId: Number(formData.repairOrderTypeId),
        creId: Number(formData.creId),
        serviceAdvisorId: Number(formData.serviceAdvisorId),
        cancleReason: showCancelReason ? formData.cancleReason || null : null,
        estimateCharge: formData.estimateCharge
          ? Number(formData.estimateCharge)
          : null,
        appointOn: toISO(formData.appointOn),
        callDateAndTime: toISO(formData.callDateAndTime),
        source: formData.source,
        originalAppointmentId:
          formData.action === "RE_SCHEDULE"
            ? Number(formData.originalAppointmentId)
            : null,
        customerVoices: filledVoices.map((line) => ({
          customerVoice: line.customerVoice.trim(),
        })),
      }

      const data = appointment
        ? await updateServiceAppointment(payload, appointment.id)
        : await createServiceAppointment(payload)

      if (data?.success) {
        toast.add({
          type: "success",
          description: data?.message,
        })
        if (appointment) {
          onUpdated?.()
        } else {
          const created =
            (data?.data?.appointment as serviceAppointmentListType | undefined) ??
            (data?.data as serviceAppointmentListType | undefined)
          setFormData(initialFormData)
          setCustomerVoices([{ ...emptyVoiceLine }])
          setTimeout(() => {
            onCreated?.(created)
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
    <form id="service-appointment-form" onSubmit={handleSubmit}>
      <div className="space-y-4 py-3">
        <div>
          <div className="mb-2 bg-muted/40 px-2 py-1">
            <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
              Appointment Details
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <FieldLabel className="text-xs font-medium">
                Action <span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                items={actionOptions}
                value={formData.action || null}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    action: value ?? "NEW_REQUIREMENT",
                  }))
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

            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <FieldLabel className="text-xs font-medium">
                Status <span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                items={statusOptions}
                value={formData.status || null}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value ?? "OPEN" }))
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

            {formData.action === "RE_SCHEDULE" && (
              <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                <FieldLabel className="text-xs font-medium">
                  Original Appointment <span className="text-red-500">*</span>
                </FieldLabel>
                <Popover
                  open={originalAppointmentOpen}
                  onOpenChange={setOriginalAppointmentOpen}
                >
                  <PopoverTrigger className="w-full">
                    <Button
                      type="button"
                      variant="outline"
                      role="combobox"
                      aria-expanded={originalAppointmentOpen}
                      className="h-7 w-full justify-between rounded-none px-2 text-xs font-normal"
                    >
                      {selectedOriginalAppointment?.appointmentNo ?? "Select appointment"}
                      <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="start" className="w-full p-0">
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Enter Appointment No..."
                        value={searchOriginalAppointment}
                        onValueChange={setSearchOriginalAppointment}
                        className="h-8 text-xs"
                      />
                      <CommandList>
                        {filteredOriginalAppointmentOptions.length === 0 ? (
                          <CommandEmpty className="py-3 text-xs">
                            No appointments found.
                          </CommandEmpty>
                        ) : (
                          <CommandGroup>
                            {filteredOriginalAppointmentOptions.map((item) => (
                              <CommandItem
                                key={item.id}
                                value={String(item.id)}
                                onSelect={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    originalAppointmentId: String(item.id),
                                  }))
                                  setOriginalAppointmentOpen(false)
                                  setSearchOriginalAppointment("")
                                }}
                                className="text-xs"
                              >
                                {item.appointmentNo}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        )}
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}

            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <FieldLabel className="text-xs font-medium">
                Source <span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                items={sourceOptions}
                value={formData.source || null}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    source: value ?? "INWARD_CALL",
                  }))
                }
                required
              >
                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false}>
                  {sourceOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <FieldLabel className="text-xs font-medium">
                Appoint On <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                name="appointOn"
                type="datetime-local"
                required
                value={formData.appointOn}
                onChange={handleChange}
                className="h-7 rounded-none px-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <FieldLabel className="text-xs font-medium">
                Call Date & Time <span className="text-red-500">*</span>
              </FieldLabel>
              <Input
                name="callDateAndTime"
                type="datetime-local"
                required
                value={formData.callDateAndTime}
                onChange={handleChange}
                className="h-7 rounded-none px-2 text-xs"
              />
            </div>

            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <FieldLabel className="text-xs font-medium">
                Estimate Charge
              </FieldLabel>
              <Input
                name="estimateCharge"
                type="number"
                min={0}
                placeholder="Estimated charge"
                value={formData.estimateCharge}
                onChange={handleChange}
                className="h-7 rounded-none px-2 text-xs"
              />
            </div>

            {showCancelReason && (
              <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                <FieldLabel className="text-xs font-medium">
                  Cancel Reason
                </FieldLabel>
                <Select
                  items={cancleReasonOptions}
                  value={formData.cancleReason || null}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      cancleReason: value ?? "",
                    }))
                  }
                >
                  <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent align="start" alignItemWithTrigger={false}>
                    {cancleReasonOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="mb-2 bg-muted/40 px-2 py-1">
            <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
              Customer & Vehicle
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
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
                                setSelectedCustomer(c)
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

            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
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

            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <FieldLabel className="text-xs font-medium">
                Current Reading
              </FieldLabel>
              <Input
                name="currentReading"
                type="number"
                placeholder="Current KM reading"
                value={formData.currentReading}
                onChange={handleChange}
                className="h-7 rounded-none px-2 text-xs"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="mb-2 bg-muted/40 px-2 py-1">
            <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
              Service Details
            </h3>
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
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

            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
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

            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
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

            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <FieldLabel className="text-xs font-medium">
                CRE <span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                items={activeEmployees.map((e) => ({
                  value: String(e.id),
                  label: `${e.firstName} ${e.lastName} (${e.employeeCode})`,
                }))}
                value={formData.creId || null}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, creId: value ?? "" }))
                }
                required
              >
                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                  <SelectValue placeholder="Select CRE" />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false}>
                  {activeEmployees.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>
                      {e.firstName} {e.lastName} ({e.employeeCode})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
              <FieldLabel className="text-xs font-medium">
                Service Advisor <span className="text-red-500">*</span>
              </FieldLabel>
              <Select
                items={activeEmployees.map((e) => ({
                  value: String(e.id),
                  label: `${e.firstName} ${e.lastName} (${e.employeeCode})`,
                }))}
                value={formData.serviceAdvisorId || null}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    serviceAdvisorId: value ?? "",
                  }))
                }
                required
              >
                <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                  <SelectValue placeholder="Select service advisor" />
                </SelectTrigger>
                <SelectContent align="start" alignItemWithTrigger={false}>
                  {activeEmployees.map((e) => (
                    <SelectItem key={e.id} value={String(e.id)}>
                      {e.firstName} {e.lastName} ({e.employeeCode})
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
                Customer Voice
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Record the customer reported issues for this appointment.
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
                        onChange={(e) => updateVoice(index, e.target.value)}
                        className="min-h-[48px] rounded-none px-2 py-1 text-xs"
                      />
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
        <Button type="submit" disabled={loading} className={cn("gap-2")}>
          {loading && <Loader2 className="h-3 w-3 animate-spin" />}
          {appointment
            ? "Update Service Appointment"
            : "Create Service Appointment"}
        </Button>
      </div>
    </form>
  )
}
