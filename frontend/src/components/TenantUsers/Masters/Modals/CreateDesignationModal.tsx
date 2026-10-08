import { createDesignation } from "@/api/endpoints"
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
import { Loader2 } from "lucide-react"
import { useContext, useState } from "react"

interface CreateDesignationModalProps {
    open: boolean
    setOpen: (open: boolean) => void
}

const initialFormData = {
    code: "",
    name: "",
    description: "",
    isMechanic: false,
}

export function CreateDesignationModal({ open, setOpen }: CreateDesignationModalProps) {
    const [loading, setLoading] = useState<boolean>(false)
    const { fetchDesignationList, designationSkip, designationTake } = useContext(TenantContext)
    const [formData, setFormData] = useState(initialFormData)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const payload = {
                code: formData.code,
                name: formData.name,
                description: formData.description,
                isMechanic: formData.isMechanic
            }
            const data = await createDesignation(payload)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                setFormData(initialFormData)
                fetchDesignationList(designationSkip, designationTake)
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
                description: (err as any)?.response?.data?.message
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open}>
            <form>
                <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl max-h-[90vh] overflow-y-auto scrollbarHide">
                    <DialogHeader>
                        <DialogTitle>Create New Designation</DialogTitle>
                        <DialogDescription>Add a new employee designation to the tenant.</DialogDescription>
                    </DialogHeader>

                    <form id="designation-form" onSubmit={handleSubmit}>
                        <div className="space-y-6 py-4">
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">Designation Details</h3>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel>Designation Code <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input name='code' placeholder="e.g. SRV001" required onChange={handleChange} value={formData.code} />
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
                                                id="isMechanic"
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
                        <Button type="button" onClick={() => setOpen(false)} variant="outline">Cancel</Button>
                        <Button form="designation-form" type="submit" disabled={loading}>
                            {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Creating....</span>}
                            Create Designation
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
