import { cancelServiceAppointment } from "@/api/endpoints"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
import type { serviceAppointmentListType } from "@/Types/serviceAppointmentType"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { cancleReasonOptions } from "../appointmentUtils"

interface CancelServiceAppointmentModalProps {
  appointment: serviceAppointmentListType | null
  open: boolean
  onClose: () => void
  onCancelled?: () => void
}

export function CancelServiceAppointmentModal({
  appointment,
  open,
  onClose,
  onCancelled,
}: CancelServiceAppointmentModalProps) {
  const [cancleReason, setCancleReason] = useState("")
  const [loading, setLoading] = useState(false)

  if (!appointment) return null

  const handleCancelAppointment = async () => {
    if (!cancleReason) {
      toast.add({
        type: "error",
        description: "Please select a cancel reason",
      })
      return
    }
    setLoading(true)
    try {
      const data = await cancelServiceAppointment(
        { cancleReason },
        appointment.id
      )
      if (data?.success) {
        toast.add({
          type: "success",
          description: data?.message,
        })
        onCancelled?.()
      } else {
        toast.add({
          type: "error",
          description: data?.message,
        })
      }
    } catch (err: unknown) {
      toast.add({
        type: "error",
        description: (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent showCloseButton={false} className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle>Cancel Service Appointment</DialogTitle>
          <DialogDescription>
            Cancel {appointment.appointmentNo}. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-x-2 gap-y-1 py-2">
          <FieldLabel className="text-xs font-medium">
            Cancel Reason <span className="text-red-500">*</span>
          </FieldLabel>
          <Select
            items={cancleReasonOptions}
            value={cancleReason || null}
            onValueChange={(value) => setCancleReason(value ?? "")}
          >
            <SelectTrigger className="h-8 w-full rounded-none px-2 text-xs">
              <SelectValue placeholder="Select reason" />
            </SelectTrigger>
            <SelectContent align="start" alignItemWithTrigger={false}>
              {cancleReasonOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Keep Appointment
          </Button>
          <Button
            variant="destructive"
            onClick={handleCancelAppointment}
            disabled={loading}
            className="gap-2"
          >
            {loading && <Loader2 className="h-3 w-3 animate-spin" />}
            Cancel Appointment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
