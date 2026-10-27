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
import { FieldLabel } from "@/components/ui/field"
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
                    <div className="space-y-4 py-3">
                        <div>
                            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Permission Details</h3></div>

                            <div className="w-full grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="text-xs font-medium">Permission Code <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='permissionCode'
                                            type='text'
                                            placeholder="USER_VIEW"
                                            required
                                            onChange={handleChange}
                                            value={formData.permissionCode}
                                            className="h-7 rounded-none px-2 text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="w-full grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                    <FieldLabel className="w-full text-xs font-medium">Permission Name <span className="text-red-500">*</span></FieldLabel>
                                    <div className="min-w-0">
                                        <Input
                                            name='permissionName'
                                            type='text'
                                            placeholder="View Users"
                                            required
                                            onChange={handleChange}
                                            value={formData.permissionName}
                                            className="h-7 rounded-none px-2 text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 sm:col-span-2 lg:col-span-2">
                                    <FieldLabel className="text-xs font-medium">Description</FieldLabel>
                                    <div className="min-w-0">
                                        <Textarea
                                            name='permissionDescription'
                                            placeholder="Describe what this permission allows"
                                            onChange={handleChange}
                                            value={formData.permissionDescription}
                                            className="min-h-[48px] rounded-none px-2 py-1 text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <DialogFooter>
                    <Button onClick={() => setOpen(false)} variant="outline" size="sm" className="h-7 px-3 text-xs">Cancel</Button>
                    <Button form="permission-create-form" type="submit" size="sm" className="h-7 px-3 text-xs" >
                        {loading ? <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Creating....</span> : ' Create Permission' }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
