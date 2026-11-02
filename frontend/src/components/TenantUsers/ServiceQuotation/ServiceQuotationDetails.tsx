import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { serviceQuotationListType } from "@/Types/serviceQuotationType"
import {
  formatCurrency,
  formatDate,
  formatDiscountPercent,
  sourceLabels,
  statusLabels,
} from "./serviceQuotationUtils"

const Detail = ({
  label,
  value,
}: {
  label: string
  value: React.ReactNode
}) => (
  <div className="grid grid-cols-[130px_minmax(0,1fr)] items-start gap-x-2 gap-y-1">
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

interface ServiceQuotationDetailsProps {
  quotation: serviceQuotationListType
}

export function ServiceQuotationDetails({
  quotation,
}: ServiceQuotationDetailsProps) {
  const customerName = quotation.customer
    ? `${quotation.customer.firstName} ${quotation.customer.lastName}`
    : "-"
  const vehicleName = quotation.vehicle
    ? `${quotation.vehicle.vehicleNumber || quotation.vehicle.chassisNumber || "-"} - ${quotation.vehicle.brand?.brandName ?? ""} ${quotation.vehicle.model?.modelName ?? ""} ${quotation.vehicle.variant?.variantName ?? ""}`.trim()
    : "-"

  return (
    <div className="space-y-4 py-3">
      <Section title="Quotation Details">
        <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
          <Detail label="Quotation No." value={quotation.quotationNo} />
          <Detail
            label="Action"
            value={quotation.action === "NEW" ? "New" : "Supplement"}
          />
          <Detail label="Status" value={statusLabels[quotation.status]} />
          <Detail label="Branch" value={quotation.branch?.branchName || "-"} />
          <Detail
            label="Insurance Party"
            value={quotation.insurancePartyName || "-"}
          />
          <Detail
            label="Created By"
            value={
              quotation.createdByEmployee
                ? `${quotation.createdByEmployee.firstName} ${quotation.createdByEmployee.lastName}`
                : "-"
            }
          />
          <Detail label="Created At" value={formatDate(quotation.createdAt)} />
          <Detail label="Updated At" value={formatDate(quotation.updatedAt)} />
        </div>
      </Section>

      <Section title="Customer & Vehicle">
        <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
          <Detail label="Customer" value={customerName} />
          <Detail
            label="Mobile No."
            value={quotation.customer?.mobileNo || "-"}
          />
          <Detail label="Vehicle" value={vehicleName || "-"} />
          <Detail label="Current Reading" value={quotation.currentReading} />
        </div>
      </Section>

      <Section title="Service Details">
        <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
          <Detail
            label="Service Category"
            value={quotation.serviceCategory?.name || "-"}
          />
          <Detail
            label="Service Type"
            value={quotation.serviceType?.name || "-"}
          />
          <Detail
            label="Repair Order Type"
            value={quotation.repairOrderType?.name || "-"}
          />
        </div>
      </Section>

      <Section title="Parts">
        <div className="rounded border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Part</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Discount %</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="text-right">Tax %</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotation.serviceQuotationParts?.length ? (
                quotation.serviceQuotationParts.map((part) => (
                  <TableRow key={part.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {part.partNo || "-"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {part.partDescription || "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {part.quantity}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(part.rate)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDiscountPercent(
                        part.discountType,
                        part.discountRate,
                        part.discountAmount,
                        part.basicAmount
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(part.discountAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(part.taxAmount)}
                    </TableCell>
                    <TableCell className="text-right">{`${Number(part.taxRate || 0)}%`}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(part.totalAmount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="py-4 text-center text-muted-foreground"
                  >
                    No parts added.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section title="Labours">
        <div className="rounded border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Labour</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Discount %</TableHead>
                <TableHead className="text-right">Discount</TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="text-right">Tax %</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotation.serviceQuotationLabours?.length ? (
                quotation.serviceQuotationLabours.map((labour) => (
                  <TableRow key={labour.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {labour.labourCode || "-"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {labour.labourName || "-"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(labour.rate)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDiscountPercent(
                        labour.discountType,
                        labour.discountRate,
                        labour.discountAmount,
                        labour.basicAmount
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(labour.discountAmount)}
                    </TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(labour.taxAmount)}
                    </TableCell>
                    <TableCell className="text-right">{`${Number(labour.taxRate || 0)}%`}</TableCell>
                    <TableCell className="text-right">
                      {formatCurrency(labour.totalAmount)}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-4 text-center text-muted-foreground"
                  >
                    No labours added.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section title="Customer Voice">
        <div className="rounded border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer Voice</TableHead>
                <TableHead className="w-[220px]">Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quotation.serviceQuotationCustomerVoices?.length ? (
                quotation.serviceQuotationCustomerVoices.map((voice) => (
                  <TableRow key={voice.id}>
                    <TableCell className="whitespace-normal">
                      {voice.customerVoice}
                    </TableCell>
                    <TableCell>
                      {sourceLabels[voice.source] ?? voice.source}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    className="py-4 text-center text-muted-foreground"
                  >
                    No customer voices added.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Section>

      <Section title="Amount Summary">
        <div className="grid grid-cols-1 gap-x-4 gap-y-1 lg:grid-cols-2">
          <Detail
            label="Parts Basic"
            value={formatCurrency(quotation.partsBasicAmount)}
          />
          <Detail
            label="Parts Discount"
            value={formatCurrency(quotation.partsDiscountAmount)}
          />
          <Detail
            label="Parts Tax"
            value={formatCurrency(quotation.partsTaxAmount)}
          />
          <Detail
            label="Parts Total"
            value={formatCurrency(quotation.partsTotalAmount)}
          />
          <Detail
            label="Labour Basic"
            value={formatCurrency(quotation.labourBasicAmount)}
          />
          <Detail
            label="Labour Discount"
            value={formatCurrency(quotation.labourDiscountAmount)}
          />
          <Detail
            label="Labour Tax"
            value={formatCurrency(quotation.labourTaxAmount)}
          />
          <Detail
            label="Labour Total"
            value={formatCurrency(quotation.labourTotalAmount)}
          />
          <Detail
            label="Grand Total"
            value={
              <span className="text-sm font-semibold">
                {formatCurrency(quotation.grandTotal)}
              </span>
            }
          />
        </div>
      </Section>
    </div>
  )
}
