export interface PartCategoryParentType {
    id: number,
    tenantId: number,
    code: string,
    name: string,
    parentId: number | null,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
}

export interface PartCategoryListType {
    id: number,
    tenantId: number,
    code: string,
    name: string,
    parentId: number | null,
    isActive: boolean,
    createdAt: string,
    updatedAt: string,
    tenant: { tenantName: string } | null,
    parent: PartCategoryParentType | null
}

export interface PartCategoryCreateType {
    code: string,
    name: string,
    parentId: string
}

export interface PartCategoryConfirmActionType {
    type: 'deactivate' | 'activate',
    categoryId: number,
    categoryName: string
}
