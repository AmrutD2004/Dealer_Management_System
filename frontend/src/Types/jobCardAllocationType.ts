export interface JobCardAllocationBayType {
    id: number,
    tenantId: number,
    branchId: number,
    bayCode: string,
    bayName: string,
    description: string | null,
    isActive: boolean
}

export interface JobCardAllocationMechanicType {
    id: number,
    tenantId: number,
    branchId: number,
    roleId: number,
    designationId: number,
    employeeCode: string,
    firstName: string,
    middleName: string | null,
    lastName: string | null,
    email: string,
    mobileNo: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
}

export interface JobCardAllocationJobCardType {
    id: number,
    tenantId: number,
    branchId: number,
    jobCardNo: string,
    vehicleId: number,
    customerId: number,
    currentKmReading: number,
    previousKmReading: number | null,
    vehicleStatus: "MOBILIZE" | "IMMOBILIZE",
    status: "OPEN" | "CLOSED",
    isRevisit: boolean,
    estimateCloseAt: string,
    closedAt: string | null,
    createdAt: string,
    updatedAt: string
}

export interface JobCardAllocationType {
    id: number,
    jobCardId: number,
    mechanicId: number,
    bayId: number,
    bayInDateTime: string,
    bayOutTime: string | null,
    createdAt: string,
    updatedAt: string,
    jobCard: JobCardAllocationJobCardType | null,
    bay: JobCardAllocationBayType | null,
    mechanic: JobCardAllocationMechanicType | null
}

export interface JobCardAllocationCreateType {
    jobCardId: string,
    bayId: string,
    mechanicId: string,
    bayInDateTime: string
}
