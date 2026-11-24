import type { PartMasterListType } from "./partMasterType"

export interface BranchPartMasterPartType {
    id: number,
    partNo: string,
    partDescription: string,
    sellingPrice?: string | number | null,
    unitOfMeasure?: string | null
    taxRate : string  | undefined
}

export interface BranchPartMasterStoreType {
    id: number,
    code: string,
    description: string,
    IsActive?: boolean
}

export interface BranchPartMasterBinType {
    id: number,
    storeId: number,
    binCode: string,
    binDescription?: string | null,
    isActive?: boolean
}

export interface BranchPartMasterRecordType {
    id: number,
    part : BranchPartMasterPartType | null
    tenantId: number,
    branchId: number,
    partId: number,
    storeId: number,
    binId: number,
    stockInHand: string | number,
    isDefaultBin: boolean,
    isActive: boolean,
    minimumLevel: number | null,
    maximumLevel: number | null,
    reorderLevel: number | null,
    safetyStock: number | null,
    reservationQty: number | null,
    mrp: string | number | null,
    sellingPrice: string | number | null,
    latestLandedCost: string | number | null,
    createdAt: string,
    updatedAt: string
}

export interface BranchPartMasterListType extends BranchPartMasterRecordType {
    part: BranchPartMasterPartType | null,
    store: BranchPartMasterStoreType | null,
    bin: BranchPartMasterBinType | null
}

export interface BranchPartMasterStoreFormType {
    storeId: string,
    binId: string,
    stockInHand: string,
    isDefaultBin: boolean,
    isActive: boolean
}

export interface BranchPartMasterFormType {
    partId: string,
    stores: BranchPartMasterStoreFormType[],
    sellingPrice: string,
    mrp: string,
    latestLandedCost: string,
    minimumLevel: string,
    maximumLevel: string,
    reorderLevel: string,
    safetyStock: string,
    reservationQty: string
}
