import type {
    serviceAppointmentAction,
    serviceAppointmentCancleReason,
    serviceAppointmentSource,
    serviceAppointmentStatus,
} from "@/Types/serviceAppointmentType"
import dayjs from "dayjs"

export const actionLabels: Record<serviceAppointmentAction, string> = {
    NEW_REQUIREMENT: "New Requirement",
    RE_SCHEDULE: "Re Schedule",
    CANCEL: "Cancel",
}

export const statusLabels: Record<serviceAppointmentStatus, string> = {
    OPEN: "Open",
    RE_SCHEDULE: "Re Schedule",
    CANCEL: "Cancelled",
}

export const statusVariants: Record<
    serviceAppointmentStatus,
    "success" | "destructive" | "secondary" | "outline" | "default"
> = {
    OPEN: "success",
    RE_SCHEDULE: "secondary",
    CANCEL: "destructive",
}

export const sourceLabels: Record<serviceAppointmentSource, string> = {
    INWARD_CALL: "Inward Call",
    OUTWARD_CALL: "Outward Call",
    WHATSAPP: "WhatsApp",
    SMS: "SMS",
    WALK_IN: "Walk In",
}

export const cancleReasonLabels: Record<
    serviceAppointmentCancleReason,
    string
> = {
    CUSTOMER_IN_HURRY: "Customer In Hurry",
    PARTS_NOT_AVAILABLE: "Parts Not Available",
    CUSTOMER_BUSY: "Customer Busy",
    BAY_NOT_AVAILABLE: "Bay Not Available",
}

export const actionOptions = (
    Object.keys(actionLabels) as serviceAppointmentAction[]
).map((value) => ({ value, label: actionLabels[value] }))

export const statusOptions = (
    Object.keys(statusLabels) as serviceAppointmentStatus[]
).map((value) => ({ value, label: statusLabels[value] }))

export const sourceOptions = (
    Object.keys(sourceLabels) as serviceAppointmentSource[]
).map((value) => ({ value, label: sourceLabels[value] }))

export const cancleReasonOptions = (
    Object.keys(cancleReasonLabels) as serviceAppointmentCancleReason[]
).map((value) => ({ value, label: cancleReasonLabels[value] }))

export const formatCurrency = (value?: string | number | null) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(value || 0))

export const formatDate = (value?: string | null) =>
    value ? dayjs(value).format("DD MMM YYYY, hh:mm A") : "-"

export const formatDateTimeInput = (value?: string | null) =>
    value ? dayjs(value).format("YYYY-MM-DDTHH:mm") : ""

export const toISO = (value: string) =>
    value ? dayjs(value).toISOString() : null
