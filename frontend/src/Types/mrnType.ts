import type { BranchPartMasterRecordType } from "./branchPartMasterType"
import type { binListType, storageListType } from "./tenantCreateType"

export type mrnTypeValue = "CREDIT" | "CASH" | "AGAINST_DC"

export type mrnPurchaseTypeValue = "LOCAL_STATE" | "OTHER_STATE"

export type mrnPartyTypeValue =
    | "PRINCIPAL"
    | "SUPPLIER"
    | "CO_DEALER"
    | "DISTRIBUTOR"
    | "OFF_LINE_DISTRIBUTOR"

export type mrnStatusValue =
    | "GENERATED"
    | "PARTIALLY_RECEIVED"
    | "FULLY_RECEIVED"
    | "CANCELLED"

export interface mrnDetailType {
    id: number
    branchPartId: number
    binId: number
    branchPart: BranchPartMasterRecordType | null
    invoiceQty: string | number
    receivedQty: string | number
    shortQty: string | number
    damageQty: string | number
    excessQty: string | number
    rate: string | number
    discount: string | number
    taxRate: string | number
    taxAmount: string | number
    lineTotal: string | number
    reason: string | null
    isReceived: boolean
}

export interface mrnAuditUserType {
    firstName: string
    middleName?: string | null
    lastName?: string | null
    mobileNo?: string | null
    employeeCode?: string | null
}

export interface mrnListType {
    id: number
    tenantId: number
    branchId: number
    storeId: number
    mrnNo: string
    mrnDate: string
    mrnType: mrnTypeValue
    purchaseType: mrnPurchaseTypeValue
    partyType: mrnPartyTypeValue | null
    partyCode: string | null
    partyName: string | null
    dcNo: string | null
    dcDate: string | null
    invoiceNo: string | null
    invoiceDate: string | null
    status: mrnStatusValue
    totalTaxableValue: string | number
    totalDiscountValue: string | number
    totalInvoiceValue: string | number
    totalMRNValue: string | number
    createdById: number
    updatedById: number
    createdAt: string
    updatedAt: string
    store: (storageListType & { bins?: binListType[] }) | null
    createdBy: mrnAuditUserType | null
    updatedBy: mrnAuditUserType | null
    mrnDetails: mrnDetailType[]
}

export interface mrnPartFormType {
    id?: number
    branchPartId: string
    binId: string
    invoiceQty: string
    receivedQty: string
    shortQty: string
    damageQty: string
    excessQty: string
    rate: string
    discount: string
    taxRate: string
    taxAmount: string
    taxSource?: "rate" | "amount"
    reason: string
}

export interface mrnFormType {
    storeId: string
    mrnDate: string
    mrnType: mrnTypeValue | ""
    purchaseType: mrnPurchaseTypeValue | ""
    partyType: mrnPartyTypeValue | ""
    partyCode: string
    partyName: string
    dcNo: string
    dcDate: string
    invoiceNo: string
    invoiceDate: string
    parts: mrnPartFormType[]
}
