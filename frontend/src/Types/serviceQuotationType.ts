import type { customerListType } from "./tenantCreateType"

export type serviceQuotationAction = "NEW" | "SUPPLEMENT"

export type serviceQuotationStatus =
    | "DRAFT"
    | "INPROGRESS"
    | "APPROVED"
    | "COMPLETED"
    | "GENERATED"
    | "REJECTED"

export type serviceQuotationDiscountType = "PERCENTAGE" | "AMOUNT"

export type serviceQuotationVoiceSource =
    | "CUSTOMER"
    | "SERVICE_SUPERVISOR"
    | "FORM_PREVIOUS_JOB_CARD"
    | "TEST_DRIVE"

export interface serviceQuotationPartType {
    id: number
    tenantId: number
    serviceQuotationId: number
    partId: number
    partNo: string | null
    partDescription: string | null
    quantity: number
    rate: string | number
    basicAmount: string | number
    discountType: serviceQuotationDiscountType
    discountRate: string | number
    discountAmount: string | number
    hsnCode: string | null
    taxRate: string | number
    taxableAmount: string | number
    taxAmount: string | number
    totalAmount: string | number
    createdAt: string
    updatedAt: string
}

export interface serviceQuotationLabourType {
    id: number
    tenantId: number
    serviceQuotationId: number
    labourId: number
    labourName: string | null
    labourCode: string | null
    labourDescription: string | null
    rate: string | number
    basicAmount: string | number
    discountType: serviceQuotationDiscountType
    discountRate: string | number
    discountAmount: string | number
    taxRate: string | number
    taxableAmount: string | number
    taxAmount: string | number
    totalAmount: string | number
    createdAt: string
    updatedAt: string
}

export interface serviceQuotationCustomerVoiceType {
    id: number
    tenantId: number
    serviceQuotationId: number
    customerVoice: string
    source: serviceQuotationVoiceSource
    createdAt: string
    updatedAt: string
}

export interface serviceQuotationVehicleType {
    id: number
    customerId: number
    vehicleNumber: string | null
    chassisNumber: string | null
    brand?: { brandName: string } | null
    model?: { modelName: string } | null
    variant?: { variantName: string } | null
}

export interface serviceQuotationMasterType {
    id: number
    tenantId: number
    branchId: number
    quotationNo: string
    originalQuotationId: number | null
    action: serviceQuotationAction
    status: serviceQuotationStatus
    vehicleId: number
    customerId: number
    currentReading: string | number
    serviceCategoryId: number
    serviceTypeId: number
    repairOrderTypeId: number
    insurancePartyName: string | null
    partsBasicAmount: string | number
    partsDiscountAmount: string | number
    partsTaxAmount: string | number
    partsTotalAmount: string | number
    labourBasicAmount: string | number
    labourDiscountAmount: string | number
    labourTaxAmount: string | number
    labourTotalAmount: string | number
    grandTotal: string | number
    closeAt: string | null
    createdBy: number
    createdAt: string
    updatedAt: string
}

export interface serviceQuotationListType extends serviceQuotationMasterType {
    customer: customerListType | null
    vehicle: serviceQuotationVehicleType | null
    serviceCategory: { id: number; name: string } | null
    serviceType: { id: number; name: string } | null
    repairOrderType: { id: number; name: string } | null
    branch: { id: number; branchName: string } | null
    createdByEmployee: { firstName: string; lastName: string } | null
    serviceQuotationParts: serviceQuotationPartType[]
    serviceQuotationLabours: serviceQuotationLabourType[]
    serviceQuotationCustomerVoices: serviceQuotationCustomerVoiceType[]
}
