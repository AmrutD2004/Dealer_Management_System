import type { PlatformNewuserCreateType, PlatformUserEditType, PlatformUsersListType } from '@/Types/platformUserType'
import React, { useContext, useEffect, useState } from 'react'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldContent, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
                        <div className="space-y-6 py-1">
                            {/* Profile */}

                            <div>
                                <h3 className="mb-4 text-sm font-semibold text-foreground">
                                    Profile
                                </h3>

                                <div className="grid gap-4 sm:grid-cols-2">

                                    <Field className="sm:col-span-2">
                                        <FieldLabel>Email</FieldLabel>
                                        <FieldContent>
                                            <Input
                                                name='email'
                                                type='email'
                                                placeholder="name@redogroup.com"
                                                onChange={handleChange}
                                                value={formData?.email}
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
                                        <FieldLabel>Password </FieldLabel>
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
          <Button onClick={onClose} variant="outline">Cancel</Button>
           <Button disabled={loading} form="platform-user-update" type="submit" >
                            {loading ? <span className='flex items-center gap-2'><Loader2 className="animate-spin" />Saving....</span> : " Save Changes"}

                            
                        </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditPlatformUserModal
