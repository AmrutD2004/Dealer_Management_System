export interface PartMasterHSNType {
    id: number,
    tenantId: number,
    hsnCode: string,
    description: string | null,
    taxRate: string | null,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
}

export interface PartMasterCategoryType {
    id: number,
    tenantId: number,
    code: string,
    name: string,
    parentId: number | null,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
}

export type PartMasterStatusType = 'ACTIVE' | 'INACTIVE' | 'SUPERSEDED'

export interface PartMasterListType {
    id: number,
    tenantId: number,
    partNo: string,
    partDescription: string,
    partCategoryId: number | null,
    hsnId: number,
    sellingPrice: string,
    landingPrice?: string,
    taxRate: string,
    unitOfMeasure: string,
    reorderLevel: number | null,
    isFastMoving: boolean,
    status: PartMasterStatusType,
    supersededById: number | null,
    validFrom: string,
    validTo: string | null,
    createdAt: string,
    updatedAt: string,
    tenant: { tenantName: string } | null,
    hsn: PartMasterHSNType | null,
    category: PartMasterCategoryType | null
}

export interface PartMasterCreateType {
    partNo: string,
    partDescription: string,
    partCategoryId: string,
    hsnId: string,
    sellingPrice: string,
    landingPrice?: string,
    taxRate: string,
    unitOfMeasure: string,
    reorderLevel: string,
    isFastMoving: boolean,
    validFrom: string,
    validTo: string,
    brandId: string,
    modelId: string,
    variantId: string,
    isOem: boolean,
    position: string,
    quantity: string,
    fitmentValidFrom: string,
    fitmentValidTo: string
}

export interface PartMasterConfirmActionType {
    type: 'deactivate' | 'activate',
    partId: number,
    partNo: string
}
