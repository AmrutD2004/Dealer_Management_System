import { activateVariant, deactivateVariant } from "@/api/endpoints"
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
import type { VariantConfirmActionType } from "@/Types/variantMasterType"
import { CheckCircle, Loader2, XCircle } from "lucide-react"
import { useState } from "react"

type Props = {
    confirmAction: VariantConfirmActionType | null
    open: boolean
    onClose: () => void
    onDone?: () => void
}

type ActionResponse = {
    success?: boolean
    message?: string
}

type ActionConfig = {
    title: string
    description: string
    variant: 'default' | 'destructive'
    icon: typeof XCircle
    actionFn: (variantId: number) => Promise<ActionResponse>
}

export function ConfirmVariantActionModal({ confirmAction, open, onClose, onDone }: Props) {
    const [loading, setLoading] = useState(false)

    const getActionConfig = (): ActionConfig => {
        if (!confirmAction) return { title: '', description: '', variant: 'destructive', icon: XCircle, actionFn: async () => ({ success: false }) }

        switch (confirmAction.type) {
            case 'activate':
                return {
                    title: 'Activate Variant',
                    description: `Are you sure you want to activate "${confirmAction.variantName}"? This will restore the variant.`,
                    variant: 'default',
                    icon: CheckCircle,
                    actionFn: activateVariant
                }
            case 'deactivate':
                return {
                    title: 'Deactivate Variant',
                    description: `Are you sure you want to deactivate "${confirmAction.variantName}"? This will make the variant inactive.`,
                    variant: 'destructive',
                    icon: XCircle,
                    actionFn: deactivateVariant
                }
        }
    }

    const config = getActionConfig()

    const handleConfirm = async () => {
        if (!confirmAction) return
        setLoading(true)
        try {
            const data = await config.actionFn(confirmAction.variantId)
            if (data?.success) {
                toast.add({
                    type: 'success',
                    description: data?.message
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
            const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
            toast.add({
                type: 'error',
                description: message
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
