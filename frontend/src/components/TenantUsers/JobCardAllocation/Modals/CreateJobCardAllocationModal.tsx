import { allocateJobCard, getDealerBayList, getEmployeeList, getJobCardAllocationList, getJobCardListWithoutPagination } from "@/api/endpoints"
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
import { toast } from "@/components/ui/toast"
import type { DealerBayMasterType } from "@/Types/dealerBayType"
import type { JobCardAllocationCreateType, JobCardAllocationType } from "@/Types/jobCardAllocationType"
import type { employeeListType, jobCardListType } from "@/Types/tenantCreateType"
import dayjs from "dayjs"
import { CalendarClock, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface CreateJobCardAllocationModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    onCreated?: () => void
}

const getInitialFormData = (): JobCardAllocationCreateType => ({
    jobCardId: "",
    bayId: "",
    mechanicId: "",
    bayInDateTime: dayjs().format("YYYY-MM-DDTHH:mm"),
})

export function CreateJobCardAllocationModal({ open, setOpen, onCreated }: CreateJobCardAllocationModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [jobCards, setJobCards] = useState<jobCardListType[]>([])
    const [bays, setBays] = useState<DealerBayMasterType[]>([])
    const [mechanics, setMechanics] = useState<employeeListType[]>([])
    const [allocations, setAllocations] = useState<JobCardAllocationType[]>([])
    const [formData, setFormData] = useState<JobCardAllocationCreateType>(getInitialFormData)

    useEffect(() => {
        const loadOptions = async () => {
            try {
                const [jobCardData, bayData, employeeData, allocationData] = await Promise.all([
                    getJobCardListWithoutPagination(),
                    getDealerBayList(),
                    getEmployeeList(0, 1000),
                    getJobCardAllocationList(),
                ])
                if (jobCardData?.success) {
                    setJobCards(jobCardData?.data ?? [])
                }
                if (bayData?.success) {
                    setBays(bayData?.data ?? [])
                }
                if (employeeData?.success) {
                    setMechanics((employeeData?.data ?? []).filter(
                        (employee: employeeListType) => employee.isActive && employee.role?.roleCode === "MECHANIC"
                    ))
                }
                if (allocationData?.success) {
                    setAllocations(allocationData?.data ?? [])
                }
            } catch (err: unknown) {
                toast.add({
                    type: 'error',
                    description: (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                })
            }
        }
        if (open) loadOptions()
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const activeAllocations = allocations.filter((allocation) => !allocation.bayOutTime)
    const activeJobCardIds = new Set(activeAllocations.map((allocation) => allocation.jobCardId))
    const activeBayIds = new Set(activeAllocations.map((allocation) => allocation.bayId))

    const eligibleJobCards = jobCards.filter(
        (jobCard) => jobCard.status === "OPEN" && !activeJobCardIds.has(jobCard.id)
    )
    const eligibleBays = bays.filter(
        (bay) => bay.isActive && !activeBayIds.has(bay.id)
    )

    const getJobCardLabel = (jobCard: jobCardListType) => {
        if (!jobCard.customer) return jobCard.jobCardNo
        return `${jobCard.jobCardNo} - ${jobCard.customer.firstName} ${jobCard.customer.lastName}`
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.jobCardId || !formData.bayId || !formData.mechanicId || !formData.bayInDateTime) {
            toast.add({
                type: 'error',
                description: 'Job card, bay, mechanic and bay in date/time are required'
            })
            return
        }
        setLoading(true)
        try {
            const payload = {
                jobCardId: Number(formData.jobCardId),
                bayId: Number(formData.bayId),
                mechanicId: Number(formData.mechanicId),
                bayInDateTime: dayjs(formData.bayInDateTime).toISOString(),
            }
            const data = await allocateJobCard(payload)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                setFormData(getInitialFormData())
                onCreated?.()
                setTimeout(() => {
                    setOpen(false)
                }, 2000)
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

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-2xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <CalendarClock className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle>Create Job Card Allocation</DialogTitle>
                            <DialogDescription>
                                Assign an open job card to a dealer bay and mechanic.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form id="job-card-allocation-create-form" onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1">
                                <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Allocation Details</h3>
                            </div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Job Card <span className="text-red-500">*</span></FieldLabel>
                                    <Select
                                        items={eligibleJobCards.map((jobCard) => ({ value: String(jobCard.id), label: getJobCardLabel(jobCard) }))}
                                        value={formData.jobCardId || null}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, jobCardId: value ?? "" }))}
                                        required
                                    >
                                        <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent align="start" alignItemWithTrigger={false}>
                                            {eligibleJobCards.map((jobCard) => (
                                                <SelectItem key={jobCard.id} value={String(jobCard.id)}>
                                                    {getJobCardLabel(jobCard)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Bay <span className="text-red-500">*</span></FieldLabel>
                                    <Select
                                        items={eligibleBays.map((bay) => ({ value: String(bay.id), label: `${bay.bayName} - ${bay.bayCode}` }))}
                                        value={formData.bayId || null}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, bayId: value ?? "" }))}
                                        required
                                    >
                                        <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent align="start" alignItemWithTrigger={false}>
                                            {eligibleBays.map((bay) => (
                                                <SelectItem key={bay.id} value={String(bay.id)}>
                                                    {bay.bayName} - {bay.bayCode}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Mechanic <span className="text-red-500">*</span></FieldLabel>
                                    <Select
                                        items={mechanics.map((mechanic) => ({ value: String(mechanic.id), label: `${mechanic.firstName} ${mechanic.lastName ?? ""} - ${mechanic.employeeCode}` }))}
                                        value={formData.mechanicId || null}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, mechanicId: value ?? "" }))}
                                        required
                                    >
                                        <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent align="start" alignItemWithTrigger={false}>
                                            {mechanics.map((mechanic) => (
                                                <SelectItem key={mechanic.id} value={String(mechanic.id)}>
                                                    {mechanic.firstName} {mechanic.lastName ?? ""} - {mechanic.employeeCode}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Bay In Date/Time <span className="text-red-500">*</span></FieldLabel>
                                    <Input
                                        name='bayInDateTime'
                                        type='datetime-local'
                                        required
                                        onChange={handleChange}
                                        value={formData.bayInDateTime}
                                        className="h-7 rounded-none px-2 text-xs"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={() => setOpen(false)} variant="outline"   disabled={loading}>Cancel</Button>
                    <Button form="job-card-allocation-create-form" type="submit"   disabled={loading}>
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Allocating....</span>}
                        Allocate Job Card
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
