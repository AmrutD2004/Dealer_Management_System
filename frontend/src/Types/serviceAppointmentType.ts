import type { customerListType } from "./tenantCreateType"

export type serviceAppointmentAction =
    | "NEW_REQUIREMENT"
    | "RE_SCHEDULE"
    | "CANCEL"

export type serviceAppointmentStatus = "OPEN" | "RE_SCHEDULE" | "CANCEL"

export type serviceAppointmentSource =
    | "INWARD_CALL"
    | "OUTWARD_CALL"
    | "WHATSAPP"
    | "SMS"
    | "WALK_IN"

export type serviceAppointmentCancleReason =
    | "CUSTOMER_IN_HURRY"
    | "PARTS_NOT_AVAILABLE"
    | "CUSTOMER_BUSY"
    | "BAY_NOT_AVAILABLE"

export interface serviceAppointmentCustomerVoiceType {
    id: number
    tenantId: number
    serviceAppointmentId: number
    customerVoice: string
}

export interface serviceAppointmentEmployeeType {
    id: number
    employeeCode: string
    firstName: string
    middleName?: string | null
    lastName: string
    email?: string
    mobileNo?: string
}

export interface serviceAppointmentVehicleType {
    id: number
    customerId: number
    vehicleNumber: string | null
    chassisNumber: string | null
    currentOdometerReading?: number | string
    brand?: { brandName: string } | null
    model?: { modelName: string } | null
    variant?: { variantName: string } | null
}

export interface serviceAppointmentMasterType {
    id: number
    tenantId: number
    branchId: number
    appointmentNo: string
    originalAppointmentId: number | null
    action: serviceAppointmentAction
    status: serviceAppointmentStatus
    vehicleId: number
    customerId: number
    currentReading: string | null
    serviceCategoryId: number
    serviceTypeId: number
    repairOrderTypeId: number
    creId: number
    serviceAdvisorId: number
    cancleReason: serviceAppointmentCancleReason | null
    estimateCharge: string | number | null
    appointOn: string
    callDateAndTime: string
    source: serviceAppointmentSource
    appointDate: string
    createdAt: string
    updatedAt: string
}

export interface serviceAppointmentListType
    extends serviceAppointmentMasterType {
    originalAppointment: serviceAppointmentMasterType | null
    customer: customerListType | null
    vehicle: serviceAppointmentVehicleType | null
    serviceCategory: { id: number; name: string } | null
    serviceType: { id: number; name: string } | null
    repairOrderType: { id: number; name: string } | null
    branch: { id: number; branchName: string } | null
    cre: serviceAppointmentEmployeeType | null
    serviceAdvisor: serviceAppointmentEmployeeType | null
    serviceAppointmentCustomerVoice: serviceAppointmentCustomerVoiceType[]
}
