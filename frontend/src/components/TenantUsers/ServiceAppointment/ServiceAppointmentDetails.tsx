import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { serviceAppointmentListType } from "@/Types/serviceAppointmentType"
import {
  actionLabels,
  cancleReasonLabels,
  formatCurrency,
  formatDate,
  sourceLabels,
  statusLabels,
} from "./appointmentUtils"

const Detail = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) => (
  <div className="grid grid-cols-[140px_minmax(0,1fr)] items-start gap-x-2 gap-y-1">
    <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
    <div className="text-xs font-medium break-words text-foreground">
      {value}
    </div>
  </div>
)

const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <div>
    <div className="mb-2 bg-muted/40 px-2 py-1">
      <h3 className="text-xs font-semibold tracking-wide text-foreground uppercase">
        {title}
      </h3>
    </div>
    {children}
  </div>
)

interface ServiceAppointmentDetailsProps {
  appointment: serviceAppointmentListType
}

export function ServiceAppointmentDetails({
  appointment,
}: ServiceAppointmentDetailsProps) {
  const customerName = appointment.customer
    ? `${appointment.customer.firstName} ${appointment.customer.lastName}`
    : "-"
  const vehicleName = appointment.vehicle
    ? `${appointment.vehicle.vehicleNumber || appointment.vehicle.chassisNumber || "-"} - ${appointment.vehicle.brand?.brandName ?? ""} ${appointment.vehicle.model?.modelName ?? ""} ${appointment.vehicle.variant?.variantName ?? ""}`.trim()
    : "-"
  const creName = appointment.cre
    ? `${appointment.cre.firstName} ${appointment.cre.lastName}`
    : "-"
  const advisorName = appointment.serviceAdvisor
    ? `${appointment.serviceAdvisor.firstName} ${appointment.serviceAdvisor.lastName}`
    : "-"

  return (
    <div className="space-y-4 py-3">
      <Section title="Appointment Details">
        <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
          <Detail label="Appointment No." value={appointment.appointmentNo} />
          <Detail label="Action" value={actionLabels[appointment.action]} />
          <Detail label="Status" value={statusLabels[appointment.status]} />
          <Detail label="Source" value={sourceLabels[appointment.source]} />
          <Detail label="Branch" value={appointment.branch?.branchName || "-"} />
          <Detail
            label="Appoint On"
            value={formatDate(appointment.appointOn)}
          />
          <Detail
            label="Call Date & Time"
            value={formatDate(appointment.callDateAndTime)}
          />
          <Detail
            label="Booked On"
            value={formatDate(appointment.appointDate)}
          />
          <Detail
            label="Original Appointment"
            value={appointment.originalAppointment?.appointmentNo || "-"}
          />
          <Detail
            label="Estimate Charge"
            value={
              appointment.estimateCharge === null ||
              appointment.estimateCharge === undefined
                ? "-"
                : formatCurrency(appointment.estimateCharge)
            }
          />
          {appointment.cancleReason && (
            <Detail
              label="Cancel Reason"
              value={cancleReasonLabels[appointment.cancleReason]}
            />
          )}
        </div>
      </Section>

      <Section title="Customer & Vehicle">
        <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
          <Detail label="Customer" value={customerName} />
          <Detail
            label="Mobile No."
            value={appointment.customer?.mobileNo || "-"}
          />
          <Detail label="Vehicle" value={vehicleName || "-"} />
          <Detail label="Current Reading" value={appointment.currentReading || "-"} />
        </div>
      </Section>

      <Section title="Service Details">
        <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
          <Detail
            label="Service Category"
            value={appointment.serviceCategory?.name || "-"}
          />
          <Detail
            label="Service Type"
            value={appointment.serviceType?.name || "-"}
          />
          <Detail
            label="Repair Order Type"
            value={appointment.repairOrderType?.name || "-"}
          />
          <Detail label="CRE" value={creName} />
          <Detail label="Service Advisor" value={advisorName} />
        </div>
      </Section>

      <Section title="Customer Voice">
        <div className="rounded border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Voice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appointment.serviceAppointmentCustomerVoice?.length ? (
                appointment.serviceAppointmentCustomerVoice.map((voice) => (
                  <TableRow key={voice.id}>
                    <TableCell className="whitespace-normal">
                      {voice.customerVoice}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="py-4 text-center text-muted-foreground">
                    No customer voices added.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Section>
    </div>
  )
}
