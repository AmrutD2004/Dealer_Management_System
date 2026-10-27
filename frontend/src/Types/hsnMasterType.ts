export interface HSNMasterType {
    id: number,
    tenantId: number,
    hsnCode: string,
    description: string | null,
    taxRate: string | null,
    isActive: boolean,
    createdAt: string,
    updatedAt: string,
    tenant: { tenantName: string } | null
}

export interface HSNCreateType {
    hsnCode: string,
    description: string,
    taxRate: string
}

export interface HSNConfirmActionType {
    type: 'deactivate' | 'activate',
    hsnId: number,
    hsnCode: string
}
