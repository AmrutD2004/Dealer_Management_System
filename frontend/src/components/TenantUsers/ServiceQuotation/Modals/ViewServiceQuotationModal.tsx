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
import { downloadServiceQuotationPdf } from "@/lib/serviceQuotationPdf"
import type { serviceQuotationListType } from "@/Types/serviceQuotationType"
import { Download, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { ServiceQuotationDetails } from "../ServiceQuotationDetails"
import { statusLabels, statusVariants } from "../serviceQuotationUtils"

interface ViewServiceQuotationModalProps {
  quotation: serviceQuotationListType | null
  open: boolean
  onClose: () => void
}

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

        <ServiceQuotationDetails quotation={detail} />

        <DialogFooter className="mt-0">
          <Button onClick={onClose} variant="outline">
            Close
          </Button>
          <Button
            onClick={() => downloadServiceQuotationPdf(detail)}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
