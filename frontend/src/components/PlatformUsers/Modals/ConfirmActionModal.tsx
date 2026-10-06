import { useContext, useState } from 'react'
import { AlertTriangle, CheckCircle, Loader2, XCircle } from 'lucide-react'
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
import { suspendTenant, deactivateTenant, activateTenant } from '@/api/endpoints'
import { PlatformUserContext } from '@/Contexts/PlatformUserContext.tsx/PlatformUserContext'

type ConfirmActionType = {
  type: 'suspend' | 'deactivate' | 'activate'
  tenantId: number
  tenantName: string
} | null

type ActionConfig = {
  title: string
  description: string
  variant: 'default' | 'destructive'
  icon: typeof AlertTriangle
  actionFn: (tenantId: number) => Promise<any>
}

type Props = {
  confirmAction: ConfirmActionType
  open: boolean
  onClose: () => void
}

export function ConfirmActionModal({ confirmAction, open, onClose }: Props) {
  const { fetchTenantsList, tenantSkip, tenantTake, closeAllModals } = useContext(PlatformUserContext)
  const [loading, setLoading] = useState(false)

  const getActionConfig = (): ActionConfig => {
    if (!confirmAction) return { title: '', description: '', variant: 'destructive', icon: AlertTriangle, actionFn: async () => {} }

    switch (confirmAction.type) {
      case 'suspend':
        return {
          title: 'Suspend Tenant',
          description: `Are you sure you want to suspend "${confirmAction.tenantName}"? This will change their subscription status to SUSPENDED.`,
          variant: 'destructive',
          icon: AlertTriangle,
          actionFn: suspendTenant
        }
      case 'deactivate':
        return {
          title: 'Deactivate Tenant',
          description: `Are you sure you want to deactivate "${confirmAction.tenantName}"? This will make the tenant inactive and they will lose access to the platform.`,
          variant: 'destructive',
          icon: XCircle,
          actionFn: deactivateTenant
        }
      case 'activate':
        return {
          title: 'Activate Tenant',
          description: `Are you sure you want to activate "${confirmAction.tenantName}"? This will restore their access to the platform.`,
          variant: 'default',
          icon: CheckCircle,
          actionFn: activateTenant
        }
    }
  }

  const config = getActionConfig()

  const handleConfirm = async () => {
    if (!confirmAction) return
    setLoading(true)
    try {
      const data = await config.actionFn(confirmAction.tenantId)
      if (data?.success) {
        toast.add({
          type: 'success',
          description: data?.message
        })
        fetchTenantsList(tenantSkip, tenantTake)
        setTimeout(() => {
          closeAllModals()
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
            <config.icon className="h-5 w-5 text-destructive" />
            {config.title}
          </DialogTitle>
          <DialogDescription>{config.description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={() => { closeAllModals(); onClose() }} variant="outline" disabled={loading}>
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