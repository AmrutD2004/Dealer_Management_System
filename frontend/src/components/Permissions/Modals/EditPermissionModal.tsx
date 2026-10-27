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
import { FieldLabel } from '@/components/ui/field'
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
          <div className="space-y-4 py-3">
            <div>
              <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Permission Details</h3></div>
              <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
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
                <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1">
                  <FieldLabel className="text-xs font-medium">Permission Name <span className="text-red-500">*</span></FieldLabel>
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
          <Button onClick={() => { closeAllPermissionModals(); onClose() }} variant="outline" size="sm" className="h-7 px-3 text-xs" disabled={loading}>Cancel</Button>
          <Button disabled={loading} form="permission-edit-form" type="submit" size="sm" className="h-7 px-3 text-xs">
            {loading ? <span className='flex items-center gap-2'><Loader2 className="h-3 w-3 animate-spin" />Saving....</span> : " Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default EditPermissionModal
