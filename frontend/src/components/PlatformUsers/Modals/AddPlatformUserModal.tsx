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
import { Field, FieldLabel, FieldContent } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import { PlatformUserContext } from "@/Contexts/PlatformUserContext.tsx/PlatformUserContext"
import type { PlatformNewuserCreateType } from "@/Types/platformUserType"
import { cn } from "cn"
import { Loader2, Plus } from "lucide-react"
import { useContext, useState } from "react"

export function AddPlatformUserModal() {
    const [open, setOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(true)
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
                        <div className="space-y-6 py-4">
                            {/* Profile */}

                            <div>
                                <h3 className="mb-4 text-sm font-semibold text-foreground">
                                    Profile
                                </h3>

                                <div className="grid gap-4 sm:grid-cols-2">

                                    <Field className="sm:col-span-2">
                                        <FieldLabel>Email *</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                name='email'
                                                type='email'
                                                placeholder="name@redogroup.com"
                                                onChange={handleChange}
                                                value={formData.email}
                                            />
                                        </FieldContent>
                                    </Field>
                                </div>
                            </div>

                            {/* Role */}

                            <div>
                                <h3 className="mb-4 text-sm font-semibold text-foreground">
                                    Role Assignment
                                </h3>

                                <div className=" w-full">
                                    <Field>
                                        <FieldLabel>Platform Role</FieldLabel>
                                        <FieldContent>
                                            <Select name='role'

                                                value={formData.role}
                                                onValueChange={(value) => setFormData((prev: any) => ({ ...prev, role: value }))}
                                            >
                                                <SelectTrigger className="w-full" >
                                                    <SelectValue placeholder="Select Role" />

                                                </SelectTrigger>

                                                <SelectContent>

                                                    <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>

                                                    <SelectItem value="SUPPORT_ADMIN">
                                                        Support Admin
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FieldContent>
                                    </Field>
                                </div>
                            </div>

                            {/* Credentials */}

                            <div>
                                <h3 className="mb-4 text-sm font-semibold text-foreground">
                                    Credentials
                                </h3>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <Field className="sm:col-span-2">
                                        <FieldLabel>Initial Password *</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                type="password"
                                                name='passwordHash'
                                                placeholder="Set a temporary password"
                                                onChange={handleChange}
                                                value={formData.passwordHash}
                                            />
                                        </FieldContent>
                                    </Field>
                                </div>
                            </div>
                        </div>
                    </form>
                    <DialogFooter>
                        <Button onClick={() => setOpen(false)} variant="outline">Cancel</Button>
                        <Button form="platform-user-form" type="submit" >
                            {loading && <span className="flex items-center gap-2"><Loader2 className="mr-2 h-4 w-4 animate-spin" /> 'Creating....'</span>}

                            Create Platform User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
