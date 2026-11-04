import { getServiceAppointmentById } from "@/api/endpoints"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { serviceAppointmentListType } from "@/Types/serviceAppointmentType"
import { CalendarClock } from "lucide-react"
import { useEffect, useState } from "react"
import { ServiceAppointmentDetails } from "../ServiceAppointmentDetails"
import { statusLabels, statusVariants } from "../appointmentUtils"

interface ViewServiceAppointmentModalProps {
  appointment: serviceAppointmentListType | null
  open: boolean | null
  onClose: () => void
}

export function ViewServiceAppointmentModal({
  appointment,
  open,
  onClose,
}: ViewServiceAppointmentModalProps) {
  const [detail, setDetail] =
    useState<serviceAppointmentListType | null>(appointment)

  useEffect(() => {
    if (!open || !appointment) return
    let cancelled = false
    const load = async () => {
      try {
        const data = await getServiceAppointmentById(appointment.id)
        if (!cancelled && data?.data) {
          setDetail({ ...appointment, ...data.data })
        }
      } catch {
        // Keep showing the row data if the detail request fails.
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [open, appointment])

  if (!detail) return null

  return (
    <Dialog
      open={!!open}
      onOpenChange={(isOpen) => {
        if (!isOpen) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="scrollbarHide max-h-[90vh] w-full max-w-sm overflow-y-auto py-5 md:max-w-4xl lg:max-w-5xl"
      >
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <CalendarClock className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-base">
                  Service Appointment Details
                </DialogTitle>
                <DialogDescription>{detail.appointmentNo}</DialogDescription>
              </div>
            </div>
            <Badge variant={statusVariants[detail.status]}>
              {statusLabels[detail.status]}
            </Badge>
          </div>
        </DialogHeader>

        <ServiceAppointmentDetails appointment={detail} />

        <DialogFooter className="mt-0">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
