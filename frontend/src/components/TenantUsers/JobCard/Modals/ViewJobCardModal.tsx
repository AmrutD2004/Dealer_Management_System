import type { jobCardListType } from "@/Types/tenantCreateType"
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
import { Label } from "@/components/ui/label"
import dayjs from "dayjs"
import { ClipboardList } from "lucide-react"

interface ViewJobCardModalProps {
  jobCard: jobCardListType | null
  open: boolean
  onClose: () => void
}

const Detail = ({ label, value }: { label: string, value: React.ReactNode }) => (
  <div className="grid grid-cols-[110px_minmax(0,1fr)] items-start gap-x-2 gap-y-1">
    <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
    <div className="text-xs font-medium text-foreground break-words">{value}</div>
  </div>
)

export function ViewJobCardModal({ jobCard, open, onClose }: ViewJobCardModalProps) {
  if (!jobCard) return null

  const fullName = (person?: { firstName: string, lastName: string } | null) =>
    person ? `${person.firstName} ${person.lastName}` : "-"

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="scrollbarHide max-h-[90vh] w-full max-w-sm overflow-y-auto py-5 md:max-w-3xl lg:max-w-2xl"
      >
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ClipboardList className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-base">Job Card Details</DialogTitle>
                <DialogDescription>{jobCard.jobCardNo}</DialogDescription>
              </div>
            </div>
            <Badge variant={jobCard.status === "OPEN" ? "success" : "outline"}>
              {jobCard.status === "OPEN" ? "Open" : "Closed"}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div>
            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Customer & Vehicle</h3></div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
              <Detail label="Customer" value={fullName(jobCard.customer)} />
              <Detail label="Mobile No." value={jobCard.customer?.mobileNo || "-"} />
              <Detail label="Branch" value={jobCard.branch?.branchName || "-"} />
              <Detail
                label="Vehicle"
                value={jobCard.vehicle
                  ? `${jobCard.vehicle.vehicleNumber || jobCard.vehicle.chassisNumber} - ${jobCard.vehicle.brand.brandName} ${jobCard.vehicle.model.modelName} ${jobCard.vehicle.variant.variantName}`
                  : "-"}
              />
              <Detail label="Current KM Reading" value={jobCard.currentKmReading ?? "-"} />
              <Detail label="Previous KM Reading" value={jobCard.previousKmReading ?? "-"} />
            </div>
          </div>

          <div>
            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Service Details</h3></div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
              <Detail label="Service Category" value={jobCard.serviceCategory?.name || "-"} />
              <Detail label="Service Type" value={jobCard.serviceType?.name || "-"} />
              <Detail label="Repair Order Type" value={jobCard.repairOrderType?.name || "-"} />
              <Detail
                label="Vehicle Status"
                value={
                  <Badge variant={jobCard.vehicleStatus === "MOBILIZE" ? "success" : "destructive"}>
                    {jobCard.vehicleStatus === "MOBILIZE" ? "Mobilize" : "Immobilize"}
                  </Badge>
                }
              />
              <Detail label="Estimate Close At" value={jobCard.estimateCloseAt ? dayjs(jobCard.estimateCloseAt).format("DD MMM YYYY, hh:mm A") : "-"} />
              <Detail label="Closed At" value={jobCard.closedAt ? dayjs(jobCard.closedAt).format("DD MMM YYYY, hh:mm A") : "-"} />
              <Detail label="Supervisor" value={fullName(jobCard.supervisor)} />
              <Detail label="Technician" value={fullName(jobCard.technician)} />
              <Detail label="Revisit" value={jobCard.isRevisit ? "Yes" : "No"} />
            </div>
          </div>

          <div>
            <div className="mb-2 bg-muted/40 px-2 py-1"><h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">Driver & Breakdown</h3></div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
              <Detail label="Breakdown" value={jobCard.isBreakdown ? "Yes" : "No"} />
              <Detail label="Driver Name" value={jobCard.driverName || "-"} />
              <Detail label="Driver Mobile No." value={jobCard.driverMobileNo || "-"} />
              {jobCard.isBreakdown && (
                <>
                  <Detail label="Person Attended" value={jobCard.breakdownPersonAttended || "-"} />
                  <Detail label="Breakdown At" value={jobCard.breakdownDateTime ? dayjs(jobCard.breakdownDateTime).format("DD MMM YYYY, hh:mm A") : "-"} />
                  <Detail label="Breakdown Start" value={jobCard.breakdownStartDateTime ? dayjs(jobCard.breakdownStartDateTime).format("DD MMM YYYY, hh:mm A") : "-"} />
                  <Detail label="Breakdown End" value={jobCard.breakdownEndDateTime ? dayjs(jobCard.breakdownEndDateTime).format("DD MMM YYYY, hh:mm A") : "-"} />
                  <Detail label="Dealer Van Start KM" value={jobCard.dealerVanStartKm ?? "-"} />
                  <Detail label="Dealer Van End KM" value={jobCard.dealerVanEndKm ?? "-"} />
                </>
              )}
              <Detail label="Created At" value={dayjs(jobCard.createdAt).format("DD MMM YYYY, hh:mm A")} />
              <Detail label="Updated At" value={dayjs(jobCard.updatedAt).format("DD MMM YYYY, hh:mm A")} />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-0">
          <Button onClick={onClose} variant="outline" size="sm" className="h-7 px-3 text-xs">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
