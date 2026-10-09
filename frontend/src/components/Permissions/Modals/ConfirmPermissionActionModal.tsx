import { useContext, useState } from 'react'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { toast } from '@/components/ui/toast'
import { activatePermission, deactivatePermission } from '@/api/endpoints'
import { PlatformUserContext } from '@/Contexts/PlatformUserContext.tsx/PlatformUserContext'

type ConfirmActionType = {
  type: 'deactivate' | 'activate'
  permissionId: number
  permissionName: string
} | null

type ActionConfig = {
  title: string
  description: string
  variant: 'default' | 'destructive'
  icon: typeof XCircle
  actionFn: (permissionId: number) => Promise<any>
}

type Props = {
  confirmAction: ConfirmActionType
  open: boolean
  onClose: () => void
}

export function ConfirmPermissionActionModal({ confirmAction, open, onClose }: Props) {
  const { fetchPermissionsList, permissionSkip, permissionTake, closeAllPermissionModals } = useContext(PlatformUserContext)
  const [loading, setLoading] = useState(false)

  const getActionConfig = (): ActionConfig => {
    if (!confirmAction) return { title: '', description: '', variant: 'destructive', icon: XCircle, actionFn: async () => {} }

    switch (confirmAction.type) {
      case 'activate':
        return {
          title: 'Activate Permission',
          description: `Are you sure you want to activate "${confirmAction.permissionName}"? This will restore the permission.`,
          variant: 'default',
          icon: CheckCircle,
          actionFn: activatePermission
        }
      case 'deactivate':
        return {
          title: 'Deactivate Permission',
          description: `Are you sure you want to deactivate "${confirmAction.permissionName}"? This will make the permission inactive.`,
          variant: 'destructive',
          icon: XCircle,
          actionFn: deactivatePermission
        }
    }
  }

  const config = getActionConfig()

  const handleConfirm = async () => {
    if (!confirmAction) return
    setLoading(true)
    try {
      const data = await config.actionFn(confirmAction.permissionId)
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
      } else {
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
    } finally {
      setLoading(false)
    }
  }

  if (!confirmAction) return null

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <config.icon className={confirmAction.type === 'deactivate' ? "h-5 w-5 text-destructive" : "h-5 w-5 text-success"} />
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => { closeAllPermissionModals(); onClose() }} variant="outline" disabled={loading}>
            Cancel
          </Button>
          <Button variant={config.variant} onClick={handleConfirm} disabled={loading}>
            {loading ? <span className='flex items-center gap-2'><Loader2 className="animate-spin" />Processing....</span> : config.title}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
