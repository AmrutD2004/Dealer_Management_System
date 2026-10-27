import { editDesignation } from "@/api/endpoints"
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
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { TenantContext } from "@/Contexts/Tenant/TenantContext"
import type { designationListType } from "@/Types/tenantCreateType"
import { Loader2 } from "lucide-react"
import { useContext, useEffect, useState } from "react"

interface EditDesignationModalProps {
    designation: designationListType | null,
    open: boolean,
    onClose: () => void
}

const initialFormData = {
    code: "",
    name: "",
    description: "",
    isMechanic: false,
}

export function EditDesignationModal({ designation, open, onClose }: EditDesignationModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const { fetchDesignationList, designationSkip, designationTake, closeAllDesignationModals } = useContext(TenantContext)
    const [formData, setFormData] = useState(initialFormData)

    useEffect(() => {
        if (designation) {
            setFormData({
                code: designation.code ?? "",
                name: designation.name ?? "",
                description: designation.description ?? "",
                isMechanic: designation.isMechanic ?? false,
            })
        }
    }, [designation])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleCancel = () => {
        closeAllDesignationModals()
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        if (!designation) return
        try {
            const payload = {
                code: formData.code,
                name: formData.name,
                description: formData.description,
                isMechanic: formData.isMechanic
            }
            const data = await editDesignation(payload, designation.id)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                fetchDesignationList(designationSkip, designationTake)
                setTimeout(() => {
                    handleCancel()
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
                description: (err as any)?.response?.data?.message
            })
        } finally {
            setLoading(false)
        }
    }

    if (!designation) return null

    return (
        <Dialog open={open}>
            <form>
                <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-2xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                    <DialogHeader>
                        <DialogTitle>Edit Designation</DialogTitle>
                        <DialogDescription>Update the designation details.</DialogDescription>
                    </DialogHeader>

                    <form id="designation-edit-form" onSubmit={handleSubmit}>
                        <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Designation Details</h3></div>
                            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Designation Code</FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='code' value={formData.code} onChange={handleChange}  className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Designation Name <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input name='name' placeholder="e.g. Senior Technician" required onChange={handleChange} value={formData.name}  className="h-7 rounded-none px-2 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                                    <FieldLabel className="text-xs font-medium">Description <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Textarea name='description' placeholder="Role responsibilities and scope" required onChange={handleChange} value={formData.description}  className="min-h-[48px] rounded-none px-2 py-1 text-xs" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                                    <FieldLabel className="text-xs font-medium">Mechanic Designation</FieldLabel>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                id="edit-isMechanic"
                                                checked={formData.isMechanic}
                                                onCheckedChange={(checked: boolean) => setFormData(prev => ({ ...prev, isMechanic: checked }))}
                                            />
                                            <span className="text-sm text-muted-foreground">
                                                {formData.isMechanic ? "Yes" : "No"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </form>

                    <DialogFooter>
                        <Button size="sm" type="button" onClick={handleCancel} variant="outline" className="h-7 px-3 text-xs">Cancel</Button>
                        <Button size="sm" form="designation-edit-form" type="submit" disabled={loading} className="h-7 px-3 text-xs">
                            {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" />Saving....</span>}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
