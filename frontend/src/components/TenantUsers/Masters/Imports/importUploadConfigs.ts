import { importBrandExcel, importHSNExcel } from '@/api/endpoints'
import dayjs from 'dayjs'
import { carBodyTypeOptions } from '../../../ModelMaster/bodyTypeOptions'
import { fuelTypeOptions, transmissionOptions } from '../../../VariantMaster/variantOptions'
import type { ImportExcelUploadConfig } from './ImportExcelUploadModal'

const parseNumber = (value: string) => Number(value.trim().replace(/,/g, ''))

const parseBoolean = (value: string) => {
    const normalized = value.trim().toLowerCase()
    return ['true', 'yes', 'y', '1', 'active'].includes(normalized)
}

const normalizeOptionKey = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]/g, '')

const parseImportDate = (value: string) => {
    const trimmed = value.trim()
    if (!trimmed) return ''
    const parsed = dayjs(trimmed)
    return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null
}

const resolveOptionValue = (
    options: { value: string; label: string }[],
    value: string
) => {
    const key = normalizeOptionKey(value)
    return options.find(
        (option) => normalizeOptionKey(option.value) === key || normalizeOptionKey(option.label) === key
    )?.value
}

export const hsnImportConfig: ImportExcelUploadConfig = {
    entityLabel: 'HSN',
    templateFileName: 'hsn-import-template.xlsx',
    description:
        'Upload an Excel file to import HSN codes in bulk using the HSN import API. If any HSN code already exists in the master, none of the rows are imported.',
    columns: [
        {
            key: 'hsnCode',
            header: 'HSN_code',
            label: 'HSN Code',
            required: true,
            aliases: ['hsn', 'hsncode'],
            example: '8708',
        },
        {
            key: 'description',
            header: 'HSN_desc',
            label: 'Description',
            aliases: ['hsndesc', 'hsndescription', 'description'],
            example: 'Motor vehicle parts and accessories',
        },
        {
            key: 'taxRate',
            header: 'TAX_rate',
            label: 'Tax Rate (%)',
            required: true,
            aliases: ['taxrate', 'gst'],
            example: '18',
        },
        {
            key: 'isActive',
            header: 'Is_Active',
            label: 'Is Active',
            aliases: ['isactive', 'active'],
            example: 'Yes',
        },
    ],
    validateRows: (rows) => {
        const seen = new Map<string, number>()
        const errors: string[] = []

        rows.forEach((row, index) => {
            const hsnCode = row.hsnCode.trim()
            if (!hsnCode) return

            const key = hsnCode.toLowerCase()
            const firstRow = seen.get(key)
            if (firstRow !== undefined) {
                errors.push(`Row ${index + 2}: duplicate HSN code "${hsnCode}" (already used in row ${firstRow})`)
                return
            }
            seen.set(key, index + 2)
        })

        return errors
    },
    mapRow: (row) => {
        const hsnCode = row.hsnCode.trim()
        if (!hsnCode) return { error: 'HSN code is required' }

        const rawTaxRate = row.taxRate.trim()
        if (!rawTaxRate) return { error: 'Tax rate is required' }

        const taxRate = parseNumber(rawTaxRate)
        if (!Number.isFinite(taxRate)) return { error: 'Tax rate must be a valid number' }
        if (taxRate < 0 || taxRate > 100) return { error: 'Tax rate must be between 0 and 100' }

        return {
            row: {
                HSN_code: hsnCode,
                HSN_desc: row.description.trim() || null,
                TAX_rate: taxRate,
                Is_Active: row.isActive.trim() ? parseBoolean(row.isActive) : true,
            },
        }
    },
    importFile: (file) => importHSNExcel(file),
}

export const brandImportConfig: ImportExcelUploadConfig = {
    entityLabel: 'Brand, Model and Variant',
    templateFileName: 'brand-model-variant-import-template.xlsx',
    description:
        'Upload an Excel file to import brands, models and variants in bulk using the brand import API. Each row represents one variant, and brands/models are created automatically when new.',
    columns: [
        {
            key: 'brandName',
            header: 'Brand_Names',
            label: 'Brand Name',
            required: true,
            aliases: ['brandnames', 'brand', 'brandname'],
            example: 'Maruti Suzuki',
        },
        {
            key: 'brandCode',
            header: 'Brand_Codes',
            label: 'Brand Code',
            required: true,
            aliases: ['brandcodes', 'brandcode'],
            example: 'MARUTI',
        },
        {
            key: 'modelName',
            header: 'Model_Names',
            label: 'Model Name',
            required: true,
            aliases: ['modelnames', 'model', 'modelname'],
            example: 'Swift',
        },
        {
            key: 'modelCode',
            header: 'Model_Codes',
            label: 'Model Code',
            required: true,
            aliases: ['modelcodes', 'modelcode'],
            example: 'SWIFT01',
        },
        {
            key: 'bodyType',
            header: 'Body_Type',
            label: 'Body Type',
            required: true,
            aliases: ['bodytype'],
            example: 'HATCHBACK',
        },
        {
            key: 'variantName',
            header: 'Variant_Names',
            label: 'Variant Name',
            required: true,
            aliases: ['variantnames', 'variant', 'variantname'],
            example: 'VXi',
        },
        {
            key: 'variantCode',
            header: 'Variant_Codes',
            label: 'Variant Code',
            required: true,
            aliases: ['variantcodes', 'variantcode'],
            example: 'VXI01',
        },
        {
            key: 'fuelType',
            header: 'Fuel_Type',
            label: 'Fuel Type',
            required: true,
            aliases: ['fueltype', 'fuel'],
            example: 'Petrol',
        },
        {
            key: 'transmissionType',
            header: 'Transmission_Type',
            label: 'Transmission Type',
            required: true,
            aliases: ['transmissiontype', 'transmission'],
            example: 'Manual',
        },
        {
            key: 'productionFrom',
            header: 'Production_From',
            label: 'Production From',
            required: true,
            aliases: ['productionfrom'],
            example: '2024-01-01',
        },
        {
            key: 'productionTo',
            header: 'Production_To',
            label: 'Production To',
            aliases: ['productionto'],
            example: '2025-12-31',
        },
        {
            key: 'isActive',
            header: 'Is_Active',
            label: 'Is Active',
            aliases: ['isactive', 'active'],
            example: 'Yes',
        },
    ],
    mapRow: (row) => {
        const brandName = row.brandName.trim()
        const brandCode = row.brandCode.trim()
        const modelName = row.modelName.trim()
        const modelCode = row.modelCode.trim()
        const variantName = row.variantName.trim()
        const variantCode = row.variantCode.trim()

        if (!brandName) return { error: 'Brand name is required' }
        if (!brandCode) return { error: 'Brand code is required' }
        if (!modelName) return { error: 'Model name is required' }
        if (!modelCode) return { error: 'Model code is required' }
        if (!variantName) return { error: 'Variant name is required' }
        if (!variantCode) return { error: 'Variant code is required' }

        const bodyType = resolveOptionValue(carBodyTypeOptions, row.bodyType)
        if (!bodyType) {
            return {
                error: `Invalid body type "${row.bodyType}". Use one of: ${carBodyTypeOptions
                    .map((option) => option.value)
                    .join(', ')}`,
            }
        }

        const fuelType = resolveOptionValue(fuelTypeOptions, row.fuelType)
        if (!fuelType) {
            return {
                error: `Invalid fuel type "${row.fuelType}". Use one of: ${fuelTypeOptions
                    .map((option) => option.value)
                    .join(', ')}`,
            }
        }

        const transmissionType = resolveOptionValue(transmissionOptions, row.transmissionType)
        if (!transmissionType) {
            return {
                error: `Invalid transmission type "${row.transmissionType}". Use one of: ${transmissionOptions
                    .map((option) => option.value)
                    .join(', ')}`,
            }
        }

        const productionFrom = parseImportDate(row.productionFrom)
        if (!productionFrom) return { error: 'Production From must be a valid date' }

        const productionTo = parseImportDate(row.productionTo)
        if (productionTo === null) return { error: 'Production To must be a valid date' }
        if (productionTo && dayjs(productionTo).isBefore(dayjs(productionFrom), 'day')) {
            return { error: 'Production To cannot be before Production From' }
        }

        return {
            row: {
                Brand_Names: brandName,
                Brand_Codes: brandCode,
                Model_Names: modelName,
                Model_Codes: modelCode,
                Body_Type: bodyType,
                Variant_Names: variantName,
                Variant_Codes: variantCode,
                Fuel_Type: fuelType,
                Transmission_Type: transmissionType,
                Production_From: productionFrom,
                Production_To: productionTo,
                Is_Active: row.isActive.trim() ? parseBoolean(row.isActive) : true,
            },
        }
    },
    importFile: (file) => importBrandExcel(file),
}
