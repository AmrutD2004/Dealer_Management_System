export interface ModelListType {
    id: number,
    brandId: number,
    modelCode: string,
    modelName: string,
    bodyType: string,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
}

export interface ModelCreateType {
    brandId: string,
    modelCode: string,
    modelName: string,
    bodyType: string
}

export interface ModelConfirmActionType {
    type: 'deactivate' | 'activate',
    modelId: number,
    modelName: string
}
