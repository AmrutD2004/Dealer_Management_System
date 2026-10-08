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
import { Field, FieldLabel, FieldContent } from "@/components/ui/field"
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
                <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                    <DialogHeader>
                        <DialogTitle>Edit Designation</DialogTitle>
                        <DialogDescription>Update the designation details.</DialogDescription>
                    </DialogHeader>

                    <form id="designation-edit-form" onSubmit={handleSubmit}>
                        <div className="space-y-6 py-4">
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Designation Details</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel>Designation Code</FieldLabel>
                                    <FieldContent>
                                        <Input name='code' value={formData.code} onChange={handleChange} />
                                    </FieldContent>
                                </Field>
                                <Field>
                                    <FieldLabel>Designation Name <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='name' placeholder="e.g. Senior Technician" required onChange={handleChange} value={formData.name} />
                                    </FieldContent>
                                </Field>
                                <Field className="sm:col-span-2">
                                    <FieldLabel>Description <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Textarea name='description' placeholder="Role responsibilities and scope" required onChange={handleChange} value={formData.description} />
                                    </FieldContent>
                                </Field>
                                <Field className="sm:col-span-2">
                                    <FieldLabel>Mechanic Designation</FieldLabel>
                                    <FieldContent>
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
                                    </FieldContent>
                                </Field>
                            </div>
                        </div>
                        </div>
                    </form>

                    <DialogFooter>
                        <Button type="button" onClick={handleCancel} variant="outline">Cancel</Button>
                        <Button form="designation-edit-form" type="submit" disabled={loading}>
                            {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving....</span>}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
