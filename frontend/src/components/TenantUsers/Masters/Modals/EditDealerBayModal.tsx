import { getTenantBranchList, updateDealerBay } from "@/api/endpoints"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldContent, FieldLabel } from "@/components/ui/field"
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
import type { DealerBayCreateType, DealerBayMasterType } from "@/Types/dealerBayType"
import type { Branch } from "@/Types/userInfoType"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface EditDealerBayModalProps {
    bay: DealerBayMasterType | null
    open: boolean
    onClose: () => void
    onUpdated?: () => void
}

export function EditDealerBayModal({ bay, open, onClose, onUpdated }: EditDealerBayModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [branches, setBranches] = useState<Branch[]>([])
    const [formData, setFormData] = useState<DealerBayCreateType>({
        bayCode: bay?.bayCode ?? "",
        bayName: bay?.bayName ?? "",
        branchId: bay?.branchId ? String(bay.branchId) : "",
        description: bay?.description ?? "",
    })

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
        if (!bay) return
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
            const data = await updateDealerBay(payload, bay.id)
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

    if (!bay) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-2xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <DialogTitle>Edit Dealer's Bay</DialogTitle>
                    <DialogDescription>Update the details of this service bay.</DialogDescription>
                </DialogHeader>

                <form id="dealer-bay-edit-form" onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Bay Details</h3>
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                <Field>
                                    <FieldLabel>Bay Code <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input
                                            name='bayCode'
                                            placeholder="e.g. BAY-01"
                                            required
                                            onChange={handleChange}
                                            value={formData.bayCode}
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Bay Name <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input
                                            name='bayName'
                                            placeholder="e.g. General Service Bay"
                                            required
                                            onChange={handleChange}
                                            value={formData.bayName}
                                        />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Branch <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Select
                                            items={branches.map((branch) => ({ value: String(branch.id), label: `${branch.branchName} - ${branch.branchCode}` }))}
                                            value={formData.branchId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, branchId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="w-full">
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
                                    </FieldContent>
                                </Field>
                                <Field className="sm:col-span-2 lg:col-span-3">
                                    <FieldLabel>Description</FieldLabel>
                                    <FieldContent>
                                        <Textarea
                                            name='description'
                                            placeholder="Description of the bay"
                                            onChange={handleChange}
                                            value={formData.description}
                                        />
                                    </FieldContent>
                                </Field>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={onClose} variant="outline" disabled={loading}>Cancel</Button>
                    <Button form="dealer-bay-edit-form" type="submit" disabled={loading}>
                        {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving....</span>}
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
