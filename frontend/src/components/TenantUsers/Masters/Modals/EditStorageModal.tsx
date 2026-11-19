import { editStorage, getTenantBranchList } from "@/api/endpoints"
import { getErrorMessage } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
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
import { TenantContext } from "@/Contexts/Tenant/TenantContext"
import { AuthContext } from "@/Contexts/AuthContext"
import type { branchListType, storageListType } from "@/Types/tenantCreateType"
import { Loader2, Folder } from "lucide-react"
import { useContext, useEffect, useState } from "react"

interface EditStorageModalProps {
    storage: storageListType | null
    open: boolean
    onClose: () => void
}

const initialFormData = {
    code: "",
    branchId: "",
    description: "",
    isBlocked: false,
    isMainStore: false,
}

export function EditStorageModal({ storage, open, onClose }: EditStorageModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const [branches, setBranches] = useState<branchListType[]>([])
    const [formData, setFormData] = useState(initialFormData)
    const { fetchStorageList, closeAllStorageModals } = useContext(TenantContext)
    const { userInfo } = useContext(AuthContext)

    const userBranchId = userInfo?.branchId
    const availableBranches = branches.filter(branch => branch.id === userBranchId || branch.id === storage?.branchId)

    useEffect(() => {
        if (storage) {
            setFormData({
                code: storage.code ?? "",
                branchId: String(storage.branchId ?? ""),
                description: storage.description ?? "",
                isBlocked: storage.IsBlocked ?? false,
                isMainStore: storage.IsMainStore ?? false,
            })
        }
    }, [storage])

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
                    description: getErrorMessage(err)
                })
            }
        }
        if (open) loadBranches()
    }, [open])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCancel = () => {
        closeAllStorageModals()
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!storage) return
        if (!formData.code.trim() || !formData.branchId || !formData.description.trim()) {
            toast.add({
                type: 'error',
                description: 'Storage code, branch and description are required'
            })
            return
        }
        setLoading(true)
        try {
            const payload = {
                code: formData.code.trim(),
                description: formData.description.trim(),
                branchId: Number(formData.branchId),
                isBlocked: formData.isBlocked,
                isMainStore: formData.isMainStore,
            }
            const data = await editStorage(payload, storage.id)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchStorageList()
                setTimeout(() => {
                    handleCancel()
                }, 10)
            } else {
                toast.add({
                    type: 'error',
                    description: data?.message
                })
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: getErrorMessage(err)
            })
        } finally {
            setLoading(false)
        }
    }

    if (!storage) return null

    return (
        <Dialog open={open}>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-2xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <Folder className="h-8 w-8 text-primary" />
                        <div>
                            <DialogTitle>Edit Storage</DialogTitle>
                            <DialogDescription>Update the storage code, branch or description.</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form id="storage-edit-form" onSubmit={handleSubmit}>
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Storage Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Storage Code <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='code' placeholder="e.g. STOR001" required onChange={handleChange} value={formData.code} className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Branch <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Select
                                            items={availableBranches.map((branch) => ({ value: String(branch.id), label: `${branch.branchName} - ${branch.branchCode}` }))}
                                            value={formData.branchId || null}
                                            onValueChange={(value) => setFormData(prev => ({ ...prev, branchId: value ?? "" }))}
                                            required
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs">
                                                <SelectValue placeholder="Select branch" />
                                            </SelectTrigger>
                                            <SelectContent align="start" alignItemWithTrigger={false}>
                                                {availableBranches.map((branch) => (
                                                    <SelectItem key={branch.id} value={String(branch.id)}>
                                                        {branch.branchName} - {branch.branchCode}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                                    <FieldLabel className="text-xs font-medium">Description <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Textarea name='description' placeholder="Description of the storage location" required onChange={handleChange} value={formData.description} className="min-h-[48px] rounded-none px-2 py-1 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Main Store</FieldLabel>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id="isMainStore"
                                            checked={formData.isMainStore}
                                            onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isMainStore: checked }))}
                                        />
                                        <span className="text-sm text-muted-foreground">{formData.isMainStore ? "Yes" : "No"}</span>
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Blocked</FieldLabel>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id="isBlocked"
                                            checked={formData.isBlocked}
                                            onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isBlocked: checked }))}
                                        />
                                        <span className="text-sm text-muted-foreground">{formData.isBlocked ? "Yes" : "No"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                <DialogFooter>
                    <Button type="button" onClick={handleCancel} variant="outline" disabled={loading}>Cancel</Button>
                    <Button form="storage-edit-form" type="submit" disabled={loading}>
                        {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                        Update Storage
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
