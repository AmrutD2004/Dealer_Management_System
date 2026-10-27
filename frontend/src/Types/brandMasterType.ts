export interface BrandListType {
    id: number,
    brandCode: string,
    brandName: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
}

export interface BrandCreateType {
    brandCode: string,
    brandName: string
}

export interface BrandConfirmActionType {
    type: 'deactivate' | 'activate',
    brandId: number,
    brandName: string
}
