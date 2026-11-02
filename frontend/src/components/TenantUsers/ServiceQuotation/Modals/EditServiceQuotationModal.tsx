import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { serviceQuotationListType } from "@/Types/serviceQuotationType"
import { ServiceQuotationCreateForm } from "../ServiceQuotationCreateForm"

interface EditServiceQuotationModalProps {
  quotation: serviceQuotationListType | null
  open: boolean
  onClose: () => void
  onUpdated?: () => void
}

export function EditServiceQuotationModal({
  quotation,
  open,
  onClose,
  onUpdated,
}: EditServiceQuotationModalProps) {
  if (!quotation) return null

  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="scrollbarHide max-h-[90vh] w-full max-w-sm overflow-y-auto md:max-w-3xl lg:max-w-6xl"
      >
        <DialogHeader>
          <DialogTitle>Edit Service Quotation</DialogTitle>
          <DialogDescription>
            Update the details of {quotation.quotationNo}.
          </DialogDescription>
        </DialogHeader>

        <ServiceQuotationCreateForm
          key={quotation.id}
          quotation={quotation}
          onCancel={onClose}
          onUpdated={onUpdated}
        />
      </DialogContent>
    </Dialog>
  )
}
