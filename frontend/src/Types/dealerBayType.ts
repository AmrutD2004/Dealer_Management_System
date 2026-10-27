export interface DealerBayBranchType {
    id: number,
    branchCode: string,
    branchName: string,
    email: string | null,
    phone: string | null,
    city: string | null
}

export interface DealerBayTenantType {
    id: number,
    tenantName: string
}

export interface DealerBayMasterType {
    id: number,
    tenantId: number,
    branchId: number,
    bayCode: string,
    bayName: string,
    description: string | null,
    isActive: boolean,
    createdAt: string,
    updatedAt: string,
    branch: DealerBayBranchType | null,
    tenant: DealerBayTenantType | null
}

export interface DealerBayCreateType {
    bayCode: string,
    bayName: string,
    branchId: string,
    description: string
}

export interface DealerBayConfirmActionType {
    type: 'deactivate' | 'activate',
    bayId: number,
    bayName: string
}
