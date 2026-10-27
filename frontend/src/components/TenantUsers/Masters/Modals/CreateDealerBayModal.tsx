import { createDealerBay, getTenantBranchList } from "@/api/endpoints"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import type { DealerBayCreateType } from "@/Types/dealerBayType"
import type { Branch } from "@/Types/userInfoType"
import { Loader2, Warehouse } from "lucide-react"
import { useEffect, useState } from "react"

interface CreateDealerBayModalProps {
    open: boolean
    setOpen: (open: boolean) => void
    onCreated?: () => void
}

const getInitialFormData = (): DealerBayCreateType => ({
    bayCode: "",
    bayName: "",
    branchId: "",
    description: "",
})

export function CreateDealerBayModal({ open, setOpen, onCreated }: CreateDealerBayModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [branches, setBranches] = useState<Branch[]>([])
    const [formData, setFormData] = useState<DealerBayCreateType>(getInitialFormData)

    useEffect(() => {
        const loadBranches = async () => {
            try {
                const data = await getTenantBranchList(0, 1000)
                if (data?.success) {
                    setBranches(data?.data ?? [])
                }
            } catch (err: unknown) {
                toast.add({
                    type: 'error',
                    description: (err as { response?: { data?: { message?: string } } })?.response?.data?.message
                })
            }
        }
        if (open) loadBranches()
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!formData.bayCode.trim() || !formData.bayName.trim() || !formData.branchId) {
            toast.add({
                type: 'error',
                description: 'Bay code, bay name and branch are required'
            })
            return
        }
        setLoading(true)
        try {
            const payload = {
                bayCode: formData.bayCode.trim(),
                bayName: formData.bayName.trim(),
                branchId: Number(formData.branchId),
                description: formData.description.trim() || null,
            }
            const data = await createDealerBay(payload)
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
                        <Warehouse className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle>Create Dealer's Bay</DialogTitle>
                            <DialogDescription>
                                Add a service bay to one of the tenant branches.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form id="dealer-bay-create-form" onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Bay Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Bay Code <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='bayCode'
                                            placeholder="e.g. BAY-01"
                                            required
                                            onChange={handleChange}
                                            value={formData.bayCode}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Bay Name <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='bayName'
                                            placeholder="e.g. General Service Bay"
                                            required
                                            onChange={handleChange}
                                            value={formData.bayName}
                                         className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Branch <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={branches.map((branch) => ({ value: String(branch.id), label: `${branch.branchName} - ${branch.branchCode}` }))}
                                            value={formData.branchId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, branchId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select branch" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {branches.map((branch) => (
                                                    <SelectItem key={branch.id} value={String(branch.id)}>
                                                        {branch.branchName} - {branch.branchCode}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                                    <FieldLabel className="text-xs font-medium">Description</FieldLabel>
                                    <div className="min-w-0">
                                        <Textarea
                                            name='description'
                                            placeholder="Description of the bay"
                                            onChange={handleChange}
                                            value={formData.description}
                                         className="min-h-[48px] rounded-none px-2 py-1 text-xs" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={() => setOpen(false)} variant="outline" disabled={loading}>Cancel</Button>
                    <Button size="sm" form="dealer-bay-create-form" type="submit" disabled={loading} className="h-7 px-3 text-xs">
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Creating....</span>}
                        Create Bay
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
