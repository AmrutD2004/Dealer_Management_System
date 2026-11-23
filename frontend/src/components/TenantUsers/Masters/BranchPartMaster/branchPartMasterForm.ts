import type { BranchPartMasterFormType, BranchPartMasterListType } from "@/Types/branchPartMasterType"

export const emptyBranchPartMasterStoreRow = {
    storeId: '',
    binId: '',
    stockInHand: '0',
    isDefaultBin: false,
    isActive: true
}

export const initialBranchPartMasterForm: BranchPartMasterFormType = {
    partId: '',
    stores: [{ ...emptyBranchPartMasterStoreRow }],
    sellingPrice: '',
    mrp: '',
    latestLandedCost: '',
    minimumLevel: '',
    maximumLevel: '',
    reorderLevel: '',
    safetyStock: '',
    reservationQty: ''
}

export const branchPartMasterFormFromRecord = (record: BranchPartMasterListType): BranchPartMasterFormType => ({
    partId: String(record.partId),
    stores: [{
        storeId: String(record.storeId),
        binId: String(record.binId),
        stockInHand: String(record.stockInHand ?? '0'),
        isDefaultBin: record.isDefaultBin,
        isActive: record.isActive
    }],
    sellingPrice: record.sellingPrice == null ? '' : String(record.sellingPrice),
    mrp: record.mrp == null ? '' : String(record.mrp),
    latestLandedCost: record.latestLandedCost == null ? '' : String(record.latestLandedCost),
    minimumLevel: record.minimumLevel == null ? '' : String(record.minimumLevel),
    maximumLevel: record.maximumLevel == null ? '' : String(record.maximumLevel),
    reorderLevel: record.reorderLevel == null ? '' : String(record.reorderLevel),
    safetyStock: record.safetyStock == null ? '' : String(record.safetyStock),
    reservationQty: record.reservationQty == null ? '' : String(record.reservationQty)
})

const toNullableNumber = (value: string) => {
    const trimmed = value.trim()
    return trimmed === '' ? null : Number(trimmed)
}

const toNullableDecimal = (value: string) => {
    const trimmed = value.trim()
    return trimmed === '' ? null : trimmed
}

export const buildBranchPartMasterPayload = (formData: BranchPartMasterFormType) => ({
    partId: Number(formData.partId),
    stores: formData.stores.map((row) => ({
        storeId: Number(row.storeId),
        binId: Number(row.binId),
        stockInHand: row.stockInHand.trim() || '0',
        isDefaultBin: row.isDefaultBin,
        isActive: row.isActive
    })),
    sellingPrice: toNullableDecimal(formData.sellingPrice),
    mrp: toNullableDecimal(formData.mrp),
    latestLandedCost: toNullableDecimal(formData.latestLandedCost),
    minimumLevel: toNullableNumber(formData.minimumLevel),
    maximumLevel: toNullableNumber(formData.maximumLevel),
    reorderLevel: toNullableNumber(formData.reorderLevel),
    safetyStock: toNullableNumber(formData.safetyStock),
    reservationQty: toNullableNumber(formData.reservationQty)
})

export const validateBranchPartMasterForm = (formData: BranchPartMasterFormType): string | null => {
    if (!formData.partId) {
        return 'Please select a part.'
    }
    if (formData.stores.length === 0) {
        return 'Add at least one store.'
    }
    const seenStoreBins = new Set<string>()
    for (const row of formData.stores) {
        if (!row.storeId || !row.binId) {
            return 'Select a store and bin for every row.'
        }
        if (row.stockInHand.trim() === '' || !Number.isFinite(Number(row.stockInHand)) || Number(row.stockInHand) < 0) {
            return 'Stock in hand must be a non-negative number.'
        }
        const key = `${row.storeId}-${row.binId}`
        if (seenStoreBins.has(key)) {
            return 'The same store and bin cannot be added more than once.'
        }
        seenStoreBins.add(key)
    }
    return null
}
