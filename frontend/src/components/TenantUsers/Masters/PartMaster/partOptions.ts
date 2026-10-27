export const partUnitOptions = [
    { value: 'EA', label: 'Each (EA)' },
    { value: 'PCS', label: 'Pieces (PCS)' },
    { value: 'SET', label: 'Set (SET)' },
    { value: 'PAIR', label: 'Pair (PAIR)' },
    { value: 'L', label: 'Litre (L)' },
    { value: 'ML', label: 'Millilitre (ML)' },
    { value: 'KG', label: 'Kilogram (KG)' },
    { value: 'G', label: 'Gram (G)' },
    { value: 'M', label: 'Metre (M)' },
    { value: 'BOX', label: 'Box (BOX)' },
    { value: 'PACK', label: 'Pack (PACK)' },
    { value: 'KIT', label: 'Kit (KIT)' },
]

export const getPartUnitLabel = (unit: string) => {
    return partUnitOptions.find((option) => option.value === unit)?.label ?? unit
}

export const formatPartCurrency = (value: string | number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 2,
    }).format(Number(value))
}

export const getPartStatusLabel = (status: string) => {
    switch (status) {
        case 'ACTIVE':
            return 'Active'
        case 'INACTIVE':
            return 'Inactive'
        case 'SUPERSEDED':
            return 'Superseded'
        default:
            return status
    }
}

export const getPartStatusVariant = (status: string): 'success' | 'destructive' | 'secondary' => {
    switch (status) {
        case 'ACTIVE':
            return 'success'
        case 'INACTIVE':
            return 'destructive'
        default:
            return 'secondary'
    }
}
