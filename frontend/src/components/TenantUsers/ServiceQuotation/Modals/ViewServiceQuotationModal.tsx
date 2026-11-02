import { getServiceQuotationById } from "@/api/endpoints"
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type {
  serviceQuotationListType,
  serviceQuotationStatus,
} from "@/Types/serviceQuotationType"
import dayjs from "dayjs"
import { FileText } from "lucide-react"
import { useEffect, useState } from "react"

interface ViewServiceQuotationModalProps {
  quotation: serviceQuotationListType | null
  open: boolean
  onClose: () => void
}

const statusLabels: Record<serviceQuotationStatus, string> = {
  DRAFT: "Draft",
  INPROGRESS: "In Progress",
  APPROVED: "Approved",
  COMPLETED: "Completed",
  GENERATED: "Generated",
  REJECTED: "Rejected",
}

const statusVariants: Record<
  serviceQuotationStatus,
  "success" | "destructive" | "secondary" | "outline" | "default"
> = {
  DRAFT: "outline",
  INPROGRESS: "secondary",
  APPROVED: "success",
  COMPLETED: "success",
  GENERATED: "default",
  REJECTED: "destructive",
}

const sourceLabels: Record<string, string> = {
  CUSTOMER: "Customer",
  SERVICE_SUPERVISOR: "Service Supervisor",
  FORM_PREVIOUS_JOB_CARD: "From Previous Job Card",
  TEST_DRIVE: "Test Drive",
}

const formatCurrency = (value: string | number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0))

const formatDate = (value?: string | null) =>
  value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "-"

const Detail = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) => (
  <div className="grid grid-cols-[130px_minmax(0,1fr)] items-start gap-x-2 gap-y-1">
    <Label className="text-xs font-medium text-muted-foreground">{label}</Label>
    <div className="text-xs font-medium break-words text-foreground">{value}</div>
  </div>
)

export function ViewServiceQuotationModal({
  quotation,
  open,
  onClose,
}: ViewServiceQuotationModalProps) {
  const [detail, setDetail] = useState<serviceQuotationListType | null>(quotation)

  useEffect(() => {
    if (!open || !quotation) return
    let cancelled = false
    const load = async () => {
      try {
        const data = await getServiceQuotationById(quotation.id)
        if (!cancelled && data?.data) {
          setDetail({ ...quotation, ...data.data })
        }
      } catch {
        // Keep showing the row data if the detail request fails.
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [open, quotation])

  if (!detail) return null

  const customerName = detail.customer
    ? `${detail.customer.firstName} ${detail.customer.lastName}`
    : "-"
  const vehicleName = detail.vehicle
    ? `${detail.vehicle.vehicleNumber || detail.vehicle.chassisNumber || "-"} - ${detail.vehicle.brand?.brandName ?? ""} ${detail.vehicle.model?.modelName ?? ""} ${detail.vehicle.variant?.variantName ?? ""}`.trim()
    : "-"

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="scrollbarHide max-h-[90vh] w-full max-w-sm overflow-y-auto py-5 md:max-w-4xl lg:max-w-5xl"
      >
        <DialogHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </span>
              <div>
                <DialogTitle className="text-base">Service Quotation Details</DialogTitle>
                <DialogDescription>{detail.quotationNo}</DialogDescription>
              </div>
            </div>
            <Badge variant={statusVariants[detail.status]}>
              {statusLabels[detail.status]}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div>
            <div className="mb-2 bg-muted/40 px-2 py-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                Quotation Details
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
              <Detail label="Quotation No." value={detail.quotationNo} />
              <Detail label="Action" value={detail.action === "NEW" ? "New" : "Supplement"} />
              <Detail label="Status" value={statusLabels[detail.status]} />
              <Detail label="Branch" value={detail.branch?.branchName || "-"} />
              <Detail
                label="Insurance Party"
                value={detail.insurancePartyName || "-"}
              />
              <Detail
                label="Created By"
                value={
                  detail.createdByEmployee
                    ? `${detail.createdByEmployee.firstName} ${detail.createdByEmployee.lastName}`
                    : "-"
                }
              />
              <Detail label="Created At" value={formatDate(detail.createdAt)} />
              <Detail label="Updated At" value={formatDate(detail.updatedAt)} />
            </div>
          </div>

          <div>
            <div className="mb-2 bg-muted/40 px-2 py-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                Customer & Vehicle
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
              <Detail label="Customer" value={customerName} />
              <Detail label="Mobile No." value={detail.customer?.mobileNo || "-"} />
              <Detail label="Vehicle" value={vehicleName || "-"} />
              <Detail label="Current Reading" value={detail.currentReading} />
            </div>
          </div>

          <div>
            <div className="mb-2 bg-muted/40 px-2 py-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                Service Details
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
              <Detail label="Service Category" value={detail.serviceCategory?.name || "-"} />
              <Detail label="Service Type" value={detail.serviceType?.name || "-"} />
              <Detail label="Repair Order Type" value={detail.repairOrderType?.name || "-"} />
            </div>
          </div>

          <div>
            <div className="mb-2 bg-muted/40 px-2 py-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                Parts
              </h3>
            </div>
            <div className="rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.serviceQuotationParts?.length ? (
                    detail.serviceQuotationParts.map((part) => (
                      <TableRow key={part.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{part.partNo || "-"}</span>
                            <span className="text-xs text-muted-foreground">
                              {part.partDescription || "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{part.quantity}</TableCell>
                        <TableCell className="text-right">{formatCurrency(part.rate)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(part.discountAmount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(part.taxAmount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(part.totalAmount)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="py-4 text-center text-muted-foreground">
                        No parts added.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div>
            <div className="mb-2 bg-muted/40 px-2 py-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                Labours
              </h3>
            </div>
            <div className="rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Labour</TableHead>
                    <TableHead className="text-right">Rate</TableHead>
                    <TableHead className="text-right">Discount</TableHead>
                    <TableHead className="text-right">Tax</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.serviceQuotationLabours?.length ? (
                    detail.serviceQuotationLabours.map((labour) => (
                      <TableRow key={labour.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{labour.labourCode || "-"}</span>
                            <span className="text-xs text-muted-foreground">
                              {labour.labourName || "-"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{formatCurrency(labour.rate)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(labour.discountAmount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(labour.taxAmount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(labour.totalAmount)}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="py-4 text-center text-muted-foreground">
                        No labours added.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div>
            <div className="mb-2 bg-muted/40 px-2 py-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                Customer Voice
              </h3>
            </div>
            <div className="rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Voice</TableHead>
                    <TableHead className="w-[220px]">Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {detail.serviceQuotationCustomerVoices?.length ? (
                    detail.serviceQuotationCustomerVoices.map((voice) => (
                      <TableRow key={voice.id}>
                        <TableCell className="whitespace-normal">{voice.customerVoice}</TableCell>
                        <TableCell>{sourceLabels[voice.source] ?? voice.source}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="py-4 text-center text-muted-foreground">
                        No customer voices added.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div>
            <div className="mb-2 bg-muted/40 px-2 py-1">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-foreground">
                Amount Summary
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
              <Detail label="Parts Basic" value={formatCurrency(detail.partsBasicAmount)} />
              <Detail label="Parts Discount" value={formatCurrency(detail.partsDiscountAmount)} />
              <Detail label="Parts Tax" value={formatCurrency(detail.partsTaxAmount)} />
              <Detail label="Parts Total" value={formatCurrency(detail.partsTotalAmount)} />
              <Detail label="Labour Basic" value={formatCurrency(detail.labourBasicAmount)} />
              <Detail label="Labour Discount" value={formatCurrency(detail.labourDiscountAmount)} />
              <Detail label="Labour Tax" value={formatCurrency(detail.labourTaxAmount)} />
              <Detail label="Labour Total" value={formatCurrency(detail.labourTotalAmount)} />
              <Detail
                label="Grand Total"
                value={
                  <span className="text-sm font-semibold">
                    {formatCurrency(detail.grandTotal)}
                  </span>
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter className="mt-0">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
