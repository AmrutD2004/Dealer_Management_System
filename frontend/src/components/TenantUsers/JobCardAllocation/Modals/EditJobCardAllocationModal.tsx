import { getDealerBayList, getEmployeeList, getJobCardAllocationList, getJobCardListWithoutPagination, updateJobCardAllocation } from "@/api/endpoints"
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
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface EditJobCardAllocationModalProps {
    allocation: JobCardAllocationType | null
    open: boolean
    onClose: () => void
    onUpdated?: () => void
}

export function EditJobCardAllocationModal({ allocation, open, onClose, onUpdated }: EditJobCardAllocationModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [jobCards, setJobCards] = useState<jobCardListType[]>([])
    const [bays, setBays] = useState<DealerBayMasterType[]>([])
    const [mechanics, setMechanics] = useState<employeeListType[]>([])
    const [allocations, setAllocations] = useState<JobCardAllocationType[]>([])
    const [formData, setFormData] = useState<JobCardAllocationCreateType>({
        jobCardId: allocation?.jobCardId ? String(allocation.jobCardId) : "",
        bayId: allocation?.bayId ? String(allocation.bayId) : "",
        mechanicId: allocation?.mechanicId ? String(allocation.mechanicId) : "",
        bayInDateTime: allocation?.bayInDateTime ? dayjs(allocation.bayInDateTime).format("YYYY-MM-DDTHH:mm") : dayjs().format("YYYY-MM-DDTHH:mm"),
    })

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
                    setMechanics(employeeData?.data ?? [])
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

    const activeAllocations = allocations.filter(
        (item) => !item.bayOutTime && item.id !== allocation?.id
    )
    const activeJobCardIds = new Set(activeAllocations.map((item) => item.jobCardId))
    const activeBayIds = new Set(activeAllocations.map((item) => item.bayId))

    const eligibleJobCards = jobCards.filter(
        (jobCard) => jobCard.id === allocation?.jobCardId ||
            (jobCard.status === "OPEN" && !activeJobCardIds.has(jobCard.id))
    )
    const eligibleBays = bays.filter(
        (bay) => bay.id === allocation?.bayId ||
            (bay.isActive && !activeBayIds.has(bay.id))
    )
    const eligibleMechanics = mechanics.filter(
        (mechanic) => mechanic.id === allocation?.mechanicId ||
            (mechanic.isActive && mechanic.role?.roleCode === "MECHANIC")
    )

    const getJobCardLabel = (jobCard: jobCardListType) => {
        if (!jobCard.customer) return jobCard.jobCardNo
        return `${jobCard.jobCardNo} - ${jobCard.customer.firstName} ${jobCard.customer.lastName}`
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!allocation) return
        if (!formData.jobCardId || !formData.bayId || !formData.mechanicId || !formData.bayInDateTime) {
            toast.add({
                type: 'error',
                description: 'Job card, bay, mechanic and bay in date/time are required'
            })
            return
        }
        const selectedJobCardId = Number(formData.jobCardId)
        const selectedBayId = Number(formData.bayId)
        if (activeAllocations.some((item) => item.jobCardId === selectedJobCardId)) {
            toast.add({
                type: 'error',
                description: 'This job card already has an active bay allocation'
            })
            return
        }
        if (activeAllocations.some((item) => item.bayId === selectedBayId)) {
            toast.add({
                type: 'error',
                description: 'This bay is already occupied'
            })
            return
        }
        setLoading(true)
        try {
            const payload = {
                jobCardId: selectedJobCardId,
                bayId: selectedBayId,
                mechanicId: Number(formData.mechanicId),
                bayInDateTime: dayjs(formData.bayInDateTime).toISOString(),
            }
            const data = await updateJobCardAllocation(payload, allocation.id)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                onUpdated?.()
                setTimeout(() => {
                    onClose()
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

    if (!allocation) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-2xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Edit Job Card Allocation</DialogTitle>
                    <DialogDescription>Update the bay, mechanic or bay in time for this allocation.</DialogDescription>
                </DialogHeader>

                <form id="job-card-allocation-edit-form" onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Allocation Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Job Card <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={eligibleJobCards.map((jobCard) => ({ value: String(jobCard.id), label: getJobCardLabel(jobCard) }))}
                                            value={formData.jobCardId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, jobCardId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select open job card" />
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
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Bay <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={eligibleBays.map((bay) => ({ value: String(bay.id), label: `${bay.bayName} - ${bay.bayCode}` }))}
                                            value={formData.bayId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, bayId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select available bay" />
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
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Mechanic <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={eligibleMechanics.map((mechanic) => ({ value: String(mechanic.id), label: `${mechanic.firstName} ${mechanic.lastName ?? ""} - ${mechanic.employeeCode}` }))}
                                            value={formData.mechanicId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, mechanicId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select mechanic" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {eligibleMechanics.map((mechanic) => (
                                                    <SelectItem key={mechanic.id} value={String(mechanic.id)}>
                                                        {mechanic.firstName} {mechanic.lastName ?? ""} - {mechanic.employeeCode}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        
                                    </div>
                                    
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Bay In Date/Time <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='bayInDateTime'
                                            type='datetime-local'
                                            required
                                            onChange={handleChange}
                                            value={formData.bayInDateTime}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button size="sm" type="button" onClick={onClose} variant="outline" disabled={loading} className="h-7 px-3 text-xs">Cancel</Button>
                    <Button size="sm" form="job-card-allocation-edit-form" type="submit" disabled={loading} className="h-7 px-3 text-xs">
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Saving....</span>}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
