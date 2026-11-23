import type {
    mrnFormType,
    mrnPartFormType,
    mrnPartyTypeValue,
    mrnPurchaseTypeValue,
    mrnTypeValue,
} from "@/Types/mrnType"

export const MRN_TYPE_OPTIONS: { value: mrnTypeValue; label: string }[] = [
    { value: "CREDIT", label: "Credit" },
    { value: "CASH", label: "Cash" },
    { value: "AGAINST_DC", label: "Against DC" },
]

export const PURCHASE_TYPE_OPTIONS: { value: mrnPurchaseTypeValue; label: string }[] = [
    { value: "LOCAL_STATE", label: "Local State" },
    { value: "OTHER_STATE", label: "Other State" },
]

export const PARTY_TYPE_OPTIONS: { value: mrnPartyTypeValue; label: string }[] = [
    { value: "PRINCIPAL", label: "Principal" },
    { value: "SUPPLIER", label: "Supplier" },
    { value: "CO_DEALER", label: "Co-Dealer" },
    { value: "DISTRIBUTOR", label: "Distributor" },
    { value: "OFF_LINE_DISTRIBUTOR", label: "Offline Distributor" },
]

export const emptyMrnPart: mrnPartFormType = {
    branchPartId: "",
    binId: "",
    invoiceQty: "",
    receivedQty: "0",
    shortQty: "0",
    damageQty: "0",
    excessQty: "0",
    rate: "",
    discount: "0",
    taxRate: "0",
    taxAmount: "0",
    reason: "",
}

const toDateInputValue = (date: Date) => {
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    return local.toISOString().slice(0, 10)
}

export const createInitialMrnForm = (): mrnFormType => ({
    storeId: "",
    mrnDate: toDateInputValue(new Date()),
    mrnType: "",
    purchaseType: "",
    partyType: "",
    partyCode: "",
    partyName: "",
    dcNo: "",
    dcDate: "",
    invoiceNo: "",
    invoiceDate: "",
    parts: [{ ...emptyMrnPart }],
})

export const validateMrnForm = (form: mrnFormType): string | null => {
    if (!form.storeId) return "Store is required"
    if (!form.mrnDate) return "MRN date is required"
    if (!form.mrnType) return "MRN type is required"
    if (!form.purchaseType) return "Purchase type is required"
    if (form.parts.length === 0) return "Add at least one part"

    const seenPartIds = new Set<string>()
    for (const [index, part] of form.parts.entries()) {
        if (!part.branchPartId) return `Part is required in row ${index + 1}`
        if (seenPartIds.has(part.branchPartId)) {
            return `Part is duplicated in row ${index + 1}`
        }
        seenPartIds.add(part.branchPartId)
        if (!part.binId) return `Bin is required in row ${index + 1}`
        if (!(Number(part.invoiceQty) > 0)) {
            return `Invoice quantity must be greater than zero in row ${index + 1}`
        }
        if (!(Number(part.rate) >= 0)) return `Rate is invalid in row ${index + 1}`
    }
    return null
}

const toNumber = (value: string) => {
    const number = Number(value || 0)
    return Number.isFinite(number) ? number : 0
}

export const buildMrnPayload = (form: mrnFormType) => ({
    storeId: Number(form.storeId),
    mrnDate: form.mrnDate,
    mrnType: form.mrnType,
    purchaseType: form.purchaseType,
    partyType: form.partyType || null,
    partyCode: form.partyCode.trim() || null,
    partyName: form.partyName.trim() || null,
    dcNo: form.dcNo.trim() || null,
    dcDate: form.dcDate || null,
    invoiceNo: form.invoiceNo.trim() || null,
    invoiceDate: form.invoiceDate || null,
    parts: form.parts.map((part) => ({
        branchPartId: Number(part.branchPartId),
        binId: Number(part.binId),
        invoiceQty: toNumber(part.invoiceQty),
        receivedQty: toNumber(part.receivedQty),
        shortQty: toNumber(part.shortQty),
        damageQty: toNumber(part.damageQty),
        excessQty: toNumber(part.excessQty),
        rate: toNumber(part.rate),
        discount: toNumber(part.discount),
        taxRate: toNumber(part.taxRate),
        taxAmount: toNumber(part.taxAmount),
        reason: part.reason.trim() || null,
    })),
})

export const calculateLineTotal = (part: mrnPartFormType) =>
    toNumber(part.invoiceQty) * toNumber(part.rate) - toNumber(part.discount) + toNumber(part.taxAmount)

export const formatCurrency = (value: string | number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2,
    }).format(Number(value || 0))

export const formatDate = (value: string | null) => {
    if (!value) return "—"
    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN")
}

export const formatEnumLabel = (value: string) =>
    value
        .toLowerCase()
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
