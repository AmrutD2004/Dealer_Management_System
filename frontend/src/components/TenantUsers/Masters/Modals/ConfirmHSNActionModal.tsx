import { activateHSN, deactivateHSN } from "@/api/endpoints"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { toast } from "@/components/ui/toast"
import type { HSNConfirmActionType } from "@/Types/hsnMasterType"
import { CheckCircle, Loader2, XCircle } from "lucide-react"
import { useState } from "react"

type Props = {
    confirmAction: HSNConfirmActionType | null
    open: boolean
    onClose: () => void
    onDone?: () => void
}

type ActionResponse = {
    success?: boolean
    message?: string
    data?: unknown
}

type ActionConfig = {
    title: string
    description: string
    variant: 'default' | 'destructive'
    icon: typeof XCircle
    actionFn: (hsnId: number) => Promise<ActionResponse>
}

export function ConfirmHSNActionModal({ confirmAction, open, onClose, onDone }: Props) {
    const [loading, setLoading] = useState(false)

    const getActionConfig = (): ActionConfig => {
        if (!confirmAction) return { title: '', description: '', variant: 'destructive', icon: XCircle, actionFn: async () => ({ success: false }) }

        switch (confirmAction.type) {
            case 'activate':
                return {
                    title: 'Activate HSN',
                    description: `Are you sure you want to activate "${confirmAction.hsnCode}"? This will restore the HSN code.`,
                    variant: 'default',
                    icon: CheckCircle,
                    actionFn: activateHSN
                }
            case 'deactivate':
                return {
                    title: 'Deactivate HSN',
                    description: `Are you sure you want to deactivate "${confirmAction.hsnCode}"? This will make the HSN code inactive.`,
                    variant: 'destructive',
                    icon: XCircle,
                    actionFn: deactivateHSN
                }
        }
    }

    const config = getActionConfig()

    const handleConfirm = async () => {
        if (!confirmAction) return
        setLoading(true)
        try {
            const data = await config.actionFn(confirmAction.hsnId)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message ?? (typeof data?.data === 'string' ? data.data : undefined)
                })
                onDone?.()
                setTimeout(() => {
                    onClose()
                }, 2000)
            } else {
                toast.add({
                    type: 'error',
                    description: data?.message
                })
            }
        } catch (err: unknown) {
            toast.add({
                type: 'error',
                description: (err as { response?: { data?: { message?: string } } })?.response?.data?.message
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
                    <Button onClick={onClose} variant="outline" disabled={loading}>
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
