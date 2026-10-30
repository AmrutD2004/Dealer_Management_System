import type { PlatformNewuserCreateType, PlatformUserEditType } from '@/Types/platformUserType'
import React, { useContext, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/components/ui/toast'
import { editPlatformUser } from '@/api/endpoints'
import { PlatformUserContext } from '@/Contexts/PlatformUserContext.tsx/PlatformUserContext'
import { Loader2 } from 'lucide-react'

type props = {
  user: PlatformUserEditType | null,
  open: boolean,
  onClose: () => void
}
const EditPlatformUserModal = ({ user, open, onClose }: props) => {
    const { fetchPlatformUsersList, platformUserSkip, platformUserTake } = useContext(PlatformUserContext)
    const [formData, setFormData] = useState<PlatformNewuserCreateType>({
            email:  "",
            passwordHash: "",
            role: "",
        })
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(()=>{
        if(user){
            setFormData({
                email : user.email ?? "",
                passwordHash  : "",
                role : user.role ?? ""
            })
        }
    }, [user])
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
                userRole: formData.role
            }
            const data = await editPlatformUser(payload, Number(user?.id))
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })

                fetchPlatformUsersList(platformUserSkip, platformUserTake)
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
      <DialogContent className="max-w-sm lg:max-w-2xl md:max-w-xl" showCloseButton={false}>
        <DialogHeader >
          <DialogTitle>Edit Platform User Details</DialogTitle>
          <DialogDescription>
            Update the account for {user?.email}. Leave the password blank to keep the current one.
          </DialogDescription>
        </DialogHeader>
        <form id="platform-user-update" onSubmit={handleSubmit}>
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
                                            value={formData?.email}
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
                                        <FieldLabel className="text-xs font-medium">Password <span className="text-red-500">*</span></FieldLabel>
                                        <PasswordInput
                                            name='passwordHash'
                                            placeholder="Set a temporary password"
                                            required
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
          <Button onClick={onClose} variant="outline"  >Cancel</Button>
           <Button disabled={loading} form="platform-user-update" type="submit"   >
                            {loading ? <span className='flex items-center gap-2'><Loader2 className="h-3 w-3 animate-spin" />Saving....</span> : " Save Changes"}

                            
                        </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditPlatformUserModal
