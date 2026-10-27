export interface PartFitmentPartType {
    id: number,
    partNo: string,
    partDescription: string
}

export interface PartFitmentBrandType {
    id: number,
    brandCode: string,
    brandName: string,
    isActive: boolean
}

export interface PartFitmentModelType {
    id: number,
    brandId: number,
    modelCode: string,
    modelName: string,
    isActive: boolean
}

export interface PartFitmentVariantType {
    id: number,
    modelId: number,
    variantCode: string,
    variantName: string,
    isActive: boolean
}

export interface PartFitmentListType {
    id: number,
    tenantId: number,
    partId: number,
    modelId: number,
    variantId: number,
    brandId: number,
    quantity: string,
    position: string | null,
    isOem: boolean,
    validFrom: string,
    validTo: string | null,
    createdAt: string,
    updatedAt: string,
    tenant: { tenantName: string } | null,
    part: PartFitmentPartType | null,
    brand: PartFitmentBrandType | null,
    model: PartFitmentModelType | null,
    variant: PartFitmentVariantType | null
}

export interface PartFitmentCreateType {
    brandId: string,
    modelId: string,
    variantId: string,
    partId: string,
    position: string,
    quantity: string,
    isOem: boolean,
    validFrom: string,
    validTo: string
}
