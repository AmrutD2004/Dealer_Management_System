export interface VariantListType {
    id: number,
    modelId: number,
    variantCode: string,
    variantName: string,
    fuelType: string,
    transmissionType: string,
    productionFrom: string | null,
    productionTo: string | null,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
}

export interface VariantCreateType {
    modelId: string,
    variantCode: string,
    variantName: string,
    fuelType: string,
    transmissionType: string,
    productionFrom: string,
    productionTo: string
}

export interface VariantConfirmActionType {
    type: 'deactivate' | 'activate',
    variantId: number,
    variantName: string
}
