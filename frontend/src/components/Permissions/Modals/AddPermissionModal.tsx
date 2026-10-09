import { createPermission } from "@/api/endpoints"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"
import { PlatformUserContext } from "@/Contexts/PlatformUserContext.tsx/PlatformUserContext"
import type { PermissionCreateType } from "@/Types/permissionType"
import { cn } from "cn"
import { Loader2, Plus } from "lucide-react"
import { useContext, useState } from "react"

export function AddPermissionModal() {
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const { fetchPermissionsList, permissionSkip, permissionTake } = useContext(PlatformUserContext)
    const [formData, setFormData] = useState<PermissionCreateType>({
        permissionCode: "",
        permissionName: "",
        permissionDescription: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        try {
            const payload = {
                permissionCode: formData.permissionCode,
                permissionName: formData.permissionName,
                permissionDescription: formData.permissionDescription
            }
            const data = await createPermission(payload)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                setFormData({
                    permissionCode: "",
                    permissionName: "",
                    permissionDescription: "",
                })
                fetchPermissionsList(permissionSkip, permissionTake)
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
        } catch (err: any) {
            toast.add({
                type: 'error',
                description: err?.response?.data?.message
            })
            setLoading(false)
        } finally {
            setLoading(false)
        }
    }
    return (
        <Dialog open={open}>
            <Button onClick={() => setOpen(true)} className={cn('flex items-center gap-2 shadow')}>
                <Plus /> Create Permission
            </Button>
            <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Create Permission</DialogTitle>

                    <DialogDescription>
                        Create a new permission that can be assigned to platform roles.
                    </DialogDescription>
                </DialogHeader>

                <form id="permission-create-form" onSubmit={handleSubmit}>
                    <div className="space-y-6 py-4">
                        <div>
                            <h3 className="mb-4 text-sm font-semibold text-foreground">
                                Permission Details
                            </h3>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field>
                                    <FieldLabel>Permission Code <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input
                                            name='permissionCode'
                                            type='text'
                                            placeholder="USER_VIEW"
                                            required
                                            onChange={handleChange}
                                            value={formData.permissionCode}
                                        />
                                    </FieldContent>
                                </Field>

                                <Field>
                                    <FieldLabel>Permission Name <span className="text-red-500">*</span></FieldLabel>
                                    <FieldContent>
                                        <Input
                                            name='permissionName'
                                            type='text'
                                            placeholder="View Users"
                                            required
                                            onChange={handleChange}
                                            value={formData.permissionName}
                                        />
                                    </FieldContent>
                                </Field>

                                <Field className="sm:col-span-2">
                                    <FieldLabel>Description</FieldLabel>
                                    <FieldContent>
                                        <Textarea
                                            name='permissionDescription'
                                            placeholder="Describe what this permission allows"
                                            onChange={handleChange}
                                            value={formData.permissionDescription}
                                        />
                                    </FieldContent>
                                </Field>
                            </div>
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button onClick={() => setOpen(false)} variant="outline">Cancel</Button>
                    <Button form="permission-create-form" type="submit" >
                        {loading ? <span className="flex items-center gap-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating....</span> : ' Create Permission' }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
