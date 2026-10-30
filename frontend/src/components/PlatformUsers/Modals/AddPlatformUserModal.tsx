import { createNewPlatformUser } from "@/api/endpoints"
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
import { PasswordInput } from "@/components/ui/password-input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { PlatformUserContext } from "@/Contexts/PlatformUserContext.tsx/PlatformUserContext"
import type { PlatformNewuserCreateType } from "@/Types/platformUserType"
import { cn } from "cn"
import { Loader2, Plus } from "lucide-react"
import { useContext, useState } from "react"

export function AddPlatformUserModal() {
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const { fetchPlatformUsersList, platformUserSkip, platformUserTake } = useContext(PlatformUserContext)
    const [formData, setFormData] = useState<PlatformNewuserCreateType>({
        email: "",
        passwordHash: "",
        role: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        try {
            const payload = {
                email: formData.email,
                passwordHash: formData.passwordHash,
                role: formData.role
            }
            const data = await createNewPlatformUser(payload)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })
                setFormData({
                    email: "",
                    passwordHash: "",
                    role: "",
                })
                fetchPlatformUsersList(platformUserSkip, platformUserTake)
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
                <Plus /> Add Platform User
            </Button>
            <form>
                <DialogContent showCloseButton={false} className="max-w-sm lg:max-w-3xl w-full md:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Add Platform User</DialogTitle>

                        <DialogDescription>
                            Create an admin account for the DMS platform and grant an initial
                            role.
                        </DialogDescription>
                    </DialogHeader>

                    <form id="platform-user-form" onSubmit={handleSubmit}>
                        <div className="space-y-4 py-3">
                            {/* Profile */}

                            <div>
                                <div className="mb-2 bg-muted/40 px-2 py-1">
                                    <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                                        Profile
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">

                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 lg:col-span-2">
                                        <FieldLabel className="text-xs font-medium">Email <span className="text-red-500">*</span></FieldLabel>
                                        <Input
                                            name='email'
                                            type='email'
                                            placeholder="name@redogroup.com"
                                            required
                                            onChange={handleChange}
                                            value={formData.email}
                                            className="h-7 rounded-none px-2 text-xs"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Role */}

                            <div>
                                <div className="mb-2 bg-muted/40 px-2 py-1">
                                    <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                                        Role Assignment
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                                        <FieldLabel className="text-xs font-medium">Platform Role <span className="text-red-500">*</span></FieldLabel>
                                        <Select name='role'
                                            required
                                            value={formData.role}
                                            onValueChange={(value) => setFormData((prev: any) => ({ ...prev, role: value }))}
                                        >
                                            <SelectTrigger className="h-7 w-full rounded-none px-2 text-xs" >
                                                <SelectValue placeholder="Select Role" />

                                            </SelectTrigger>

                                            <SelectContent>

                                                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>

                                                <SelectItem value="SUPPORT_ADMIN">
                                                    Support Admin
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Credentials */}

                            <div>
                                <div className="mb-2 bg-muted/40 px-2 py-1">
                                    <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                                        Credentials
                                    </h3>
                                </div>

                                <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
                                    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 lg:col-span-2">
                                        <FieldLabel className="text-xs font-medium">Initial Password <span className="text-red-500">*</span></FieldLabel>
                                        <PasswordInput
                                            required
                                            name='passwordHash'
                                            placeholder="Set a temporary password"
                                            onChange={handleChange}
                                            value={formData.passwordHash}
                                            className="h-7 rounded-none px-2 text-xs"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <DialogFooter>
                        <Button onClick={() => setOpen(false)} variant="outline"  >Cancel</Button>
                        <Button form="platform-user-form" type="submit"   >
                            {loading ? <span className="flex items-center gap-2"><Loader2 className="mr-2 h-3 w-3 animate-spin" /> Creating....</span> : ' Create Platform User' }

                           
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
