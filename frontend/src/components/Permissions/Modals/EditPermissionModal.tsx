import type { PermissionListType, PermissionCreateType } from '@/Types/permissionType'
import React, { useContext, useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldContent, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/toast'
import { editPermission } from '@/api/endpoints'
import { PlatformUserContext } from '@/Contexts/PlatformUserContext.tsx/PlatformUserContext'
import { Loader2, KeyRound } from 'lucide-react'

type props = {
  permission: PermissionListType | null,
  open: boolean,
  onClose: () => void
}

const EditPermissionModal = ({ permission, open, onClose }: props) => {
    const { fetchPermissionsList, permissionSkip, permissionTake, closeAllPermissionModals, selectedPermission } = useContext(PlatformUserContext)
    const [formData, setFormData] = useState<PermissionCreateType>({
        permissionCode: "",
        permissionName: "",
        permissionDescription: "",
    })
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        if (permission) {
            setFormData({
                permissionCode: permission.permissionCode ?? "",
                permissionName: permission.permissionName ?? "",
                permissionDescription: permission.description ?? "",
            })
        }
    }, [permission])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        try {
            const permissionId = selectedPermission?.id
            if (!permissionId) {
                toast.add({
                    type: 'error',
                    description: 'Permission ID not found'
                })
                setLoading(false)
                return
            }
            const data = await editPermission(formData, permissionId)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
                })

                fetchPermissionsList(permissionSkip, permissionTake)
                setTimeout(() => {
                    closeAllPermissionModals()
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
    <Dialog open={open} >
      <DialogContent className="max-w-sm lg:max-w-3xl md:max-w-xl overflow-y-auto max-h-[90vh] scrollbarHide " showCloseButton={false} >
        <DialogHeader>
          <div className="flex items-center gap-3">
            <KeyRound className="h-8 w-8 text-primary" />
            <div>
              <DialogTitle>Edit Permission Details</DialogTitle>
              <DialogDescription>
                Update the permission information. All required fields must be filled.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form id="permission-edit-form" onSubmit={handleSubmit}>
          <div className="space-y-6 py-1">
            <div>
              <h3 className="mb-4 text-sm font-semibold text-foreground">Permission Details</h3>
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
          <Button onClick={() => { closeAllPermissionModals(); onClose() }} variant="outline" disabled={loading}>Cancel</Button>
          <Button disabled={loading} form="permission-edit-form" type="submit">
            {loading ? <span className='flex items-center gap-2'><Loader2 className="animate-spin" />Saving....</span> : " Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditPermissionModal
