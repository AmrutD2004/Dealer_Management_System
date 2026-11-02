import type { serviceQuotationStatus } from "@/Types/serviceQuotationType"
import dayjs from "dayjs"

export const statusLabels: Record<serviceQuotationStatus, string> = {
  DRAFT: "Draft",
  INPROGRESS: "In Progress",
  APPROVED: "Approved",
  COMPLETED: "Completed",
  GENERATED: "Generated",
  REJECTED: "Rejected",
}

export const statusVariants: Record<
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

export const sourceLabels: Record<string, string> = {
  CUSTOMER: "Customer",
  SERVICE_SUPERVISOR: "Service Supervisor",
  FORM_PREVIOUS_JOB_CARD: "From Previous Job Card",
  TEST_DRIVE: "Test Drive",
}

export const formatCurrency = (value: string | number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0))

export const formatDiscountPercent = (
  discountType: "PERCENTAGE" | "AMOUNT",
  discountRate: string | number,
  discountAmount: string | number,
  basicAmount: string | number
) => {
  const basic = Number(basicAmount || 0)
  const percent =
    discountType === "PERCENTAGE"
      ? Number(discountRate || 0)
      : basic > 0
        ? (Number(discountAmount || 0) / basic) * 100
        : 0
  return `${Math.round(percent * 100) / 100}%`
}

export const formatDate = (value?: string | null) =>
  value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "-"
