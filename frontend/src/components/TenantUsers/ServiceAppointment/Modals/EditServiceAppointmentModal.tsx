import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { serviceAppointmentListType } from "@/Types/serviceAppointmentType"
import { ServiceAppointmentCreateForm } from "../ServiceAppointmentCreateForm"

interface EditServiceAppointmentModalProps {
  appointment: serviceAppointmentListType | null
  open: boolean
  onClose: () => void
  onUpdated?: () => void
}

export function EditServiceAppointmentModal({
  appointment,
  open,
  onClose,
  onUpdated,
}: EditServiceAppointmentModalProps) {
  if (!appointment) return null

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="scrollbarHide max-h-[90vh] w-full max-w-sm overflow-y-auto md:max-w-3xl lg:max-w-6xl"
      >
        <DialogHeader>
          <DialogTitle>Edit Service Appointment</DialogTitle>
          <DialogDescription>
            Update the details of {appointment.appointmentNo}.
          </DialogDescription>
        </DialogHeader>

        <ServiceAppointmentCreateForm
          key={appointment.id}
          appointment={appointment}
          onCancel={onClose}
          onUpdated={onUpdated}
        />
      </DialogContent>
    </Dialog>
  )
}
