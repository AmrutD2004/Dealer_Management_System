
import {
    createBranch,
    createDesignation,
    createHSN,
    createLabour,
    createPartCategory,
    createPartMaster,
    getBrandListWithoutPagination,
    getHSNList,
    getModelListWithoutPagination,
    getPartCategoryList,
    getVariantListWithoutPagination,
} from '@/api/endpoints'
import dayjs from 'dayjs'
import { partUnitOptions } from '../PartMaster/partOptions'
import type { ImportExcelConfig } from './ImportExcelModal'

const parseNumber = (value: string) => Number(value.trim().replace(/,/g, ''))

const parseBoolean = (value: string) => {
    const normalized = value.trim().toLowerCase()
    return ['true', 'yes', 'y', '1', 'mechanic'].includes(normalized)
}


const normalizeLookup = (value: string) => value.trim().toLowerCase()

const parseImportDate = (value: string, useTodayWhenEmpty = false) => {
    const trimmed = value.trim()
    if (!trimmed) return useTodayWhenEmpty ? dayjs().format('YYYY-MM-DD') : ''
    const parsed = dayjs(trimmed)
    return parsed.isValid() ? parsed.format('YYYY-MM-DD') : null
}

const resolveUnitOfMeasure = (value: string) => {
    const key = normalizeLookup(value)
    const option = partUnitOptions.find((unit) => {
        const label = unit.label.split('(')[0]
        return (
            normalizeLookup(unit.value) === key ||
            normalizeLookup(unit.label) === key ||
            normalizeLookup(label) === key
        )
    })
    return option?.value
}
export const labourImportConfig: ImportExcelConfig = {
    entityLabel: 'Labour',
    templateFileName: 'labour-import-template.xlsx',
    description: 'Upload an Excel file to add labour records in bulk. Each row is created using the existing labour API.',
    columns: [
        { key: 'labourCode', label: 'Labour Code', required: true, aliases: ['code', 'labourcode'], example: 'LAB001' },
        { key: 'labourName', label: 'Labour Name', required: true, aliases: ['name', 'labourname'], example: 'Engine Oil Replacement' },
        { key: 'labourDescription', label: 'Description', aliases: ['labourdescription'], example: 'Labour description' },
        { key: 'rate', label: 'Rate', required: true, aliases: ['labourrate'], example: '500' },
        { key: 'standardHours', label: 'Standard Hours', required: true, aliases: ['standardhours', 'hours'], example: '1.5' },
    ],
    mapRow: (row) => {
        const labourCode = row.labourCode.trim()
        const labourName = row.labourName.trim()
        if (!labourCode || !labourName) return { error: 'Labour code and labour name are required' }

        const rate = parseNumber(row.rate)
        if (!row.rate.trim() || !Number.isFinite(rate)) return { error: 'Rate must be a valid number' }

        const standardHours = parseNumber(row.standardHours)
        if (!row.standardHours.trim() || !Number.isFinite(standardHours)) return { error: 'Standard hours must be a valid number' }

        return {
            payload: {
                labourCode,
                labourName,
                labourDescription: row.labourDescription.trim(),
                rate: String(rate),
                standardHours: String(standardHours),
            },
        }
    },
    createRecord: (payload) => createLabour(payload),
}

export const designationImportConfig: ImportExcelConfig = {
    entityLabel: 'Designation',
    templateFileName: 'designation-import-template.xlsx',
    description: 'Upload an Excel file to add designation records in bulk. Each row is created using the existing designation API.',
    columns: [
        { key: 'code', label: 'Designation Code', required: true, aliases: ['code', 'designationcode'], example: 'SRV001' },
        { key: 'name', label: 'Designation Name', required: true, aliases: ['name', 'designationname'], example: 'Senior Technician' },
        { key: 'description', label: 'Description', required: true, aliases: ['designationdescription'], example: 'Role responsibilities' },
        { key: 'isMechanic', label: 'Is Mechanic', aliases: ['ismechanic', 'mechanic'], example: 'No' },
    ],
    mapRow: (row) => {
        const code = row.code.trim()
        const name = row.name.trim()
        const description = row.description.trim()
        if (!code || !name || !description) return { error: 'Code, name and description are required' }

        return {
            payload: {
                code,
                name,
                description,
                isMechanic: parseBoolean(row.isMechanic),
            },
        }
    },
    createRecord: (payload) => createDesignation(payload),
}

export const partCategoryImportConfig: ImportExcelConfig = {
    entityLabel: 'Part Category',
    templateFileName: 'part-category-import-template.xlsx',
    description: 'Upload an Excel file to add part category records in bulk. Each row is created using the existing part category API.',
    columns: [
        { key: 'code', label: 'Category Code', required: true, aliases: ['code', 'partcategorycode'], example: 'PC001' },
        { key: 'name', label: 'Category Name', required: true, aliases: ['name', 'partcategoryname'], example: 'Engine Parts' },
    ],
    mapRow: (row) => {
        const code = row.code.trim()
        const name = row.name.trim()
        if (!code || !name) return { error: 'Category code and category name are required' }

        return { payload: { code, name } }
    },
    createRecord: (payload) => createPartCategory(payload),
}

export const branchImportConfig: ImportExcelConfig = {
    entityLabel: 'Branch',
    templateFileName: 'branch-import-template.xlsx',
    description: 'Upload an Excel file to add branch records in bulk. Each row is created using the existing branch API.',
    columns: [
        { key: 'branchName', label: 'Branch Name', required: true, aliases: ['branchname', 'tenantbranchname', 'name'], example: 'Pune Branch' },
        { key: 'email', label: 'Email', aliases: ['branchemail', 'tenantbranchemail'], example: 'branch@redogroup.com' },
        { key: 'phone', label: 'Phone', aliases: ['branchphone', 'tenantbranchphone'], example: '+91 00000 00000' },
        { key: 'address1', label: 'Address Line 1', aliases: ['address', 'address1', 'branchaddress', 'tenantbranchaddress'], example: 'Address Line 1' },
        { key: 'address2', label: 'Address Line 2', aliases: ['address2', 'branchaddress2', 'tenantbranchaddress2'], example: 'Address Line 2' },
        { key: 'locality', label: 'Locality', aliases: ['branchlocality', 'tenantbranchlocality'], example: 'Locality' },
        { key: 'city', label: 'City', aliases: ['branchcity', 'tenantbranchcity'], example: 'Pune' },
        { key: 'state', label: 'State', aliases: ['branchstate', 'tenantbranchstate'], example: 'Maharashtra' },
        { key: 'country', label: 'Country', aliases: ['branchcountry', 'tenantbranchcountry'], example: 'India' },
        { key: 'pincode', label: 'Pincode', aliases: ['pin', 'branchpincode', 'tenantbranchpincode'], example: '411001' },
    ],
    mapRow: (row) => {
        const branchName = row.branchName.trim()
        if (!branchName) return { error: 'Branch name is required' }

        return {
            payload: {
                tenant_branchName: branchName,
                tenant_branchEmail: row.email.trim(),
                tenant_branchPhone: row.phone.trim(),
                tenant_branchAddress: row.address1.trim(),
                tenant_branchAddress2: row.address2.trim(),
                tenant_branchLocality: row.locality.trim(),
                tenant_branchCity: row.city.trim(),
                tenant_branchState: row.state.trim(),
                tenant_branchCountry: row.country.trim(),
                tenant_branchPincode: row.pincode.trim(),
            },
        }
    },
    createRecord: (payload) => createBranch(payload),
}

interface PartLookupCategory {
    id: number
    code: string
    name: string
}

interface PartLookupHsn {
    id: number
    hsnCode: string
    description?: string | null
    taxRate?: string | number | null
}

interface PartLookupBrand {
    id: number
    brandCode?: string
    brandName: string
}

interface PartLookupModel {
    id: number
    modelCode?: string
    modelName: string
    brandId: number
}

interface PartLookupVariant {
    id: number
    variantCode?: string
    variantName: string
    modelId: number
}

interface PartMasterLookups {
    categories: PartLookupCategory[]
    hsn: PartLookupHsn[]
    brands: PartLookupBrand[]
    models: PartLookupModel[]
    variants: PartLookupVariant[]
}

let partMasterLookupsPromise: Promise<PartMasterLookups> | null = null

const loadPartMasterLookups = () => {
    if (!partMasterLookupsPromise) {
        partMasterLookupsPromise = (async () => {
            const [categoryData, hsnData, brandData, modelData, variantData] = await Promise.all([
                getPartCategoryList(),
                getHSNList(),
                getBrandListWithoutPagination(),
                getModelListWithoutPagination(),
                getVariantListWithoutPagination(),
            ])
            if (!categoryData?.success) throw new Error('Unable to load part categories for import')
            if (!hsnData?.success) throw new Error('Unable to load HSN codes for import')
            if (!brandData?.success) throw new Error('Unable to load brands for import')
            if (!modelData?.success) throw new Error('Unable to load vehicle models for import')
            if (!variantData?.success) throw new Error('Unable to load vehicle variants for import')

            return {
                categories: (categoryData.data ?? []) as PartLookupCategory[],
                hsn: (hsnData.data ?? []) as PartLookupHsn[],
                brands: (brandData.data ?? []) as PartLookupBrand[],
                models: (modelData.data ?? []) as PartLookupModel[],
                variants: (variantData.data ?? []) as PartLookupVariant[],
            }
        })().catch((err) => {
            partMasterLookupsPromise = null
            throw err
        })
    }
    return partMasterLookupsPromise
}

const refreshPartMasterLookups = () => {
    partMasterLookupsPromise = null
    return loadPartMasterLookups()
}

const getApiErrorMessage = (err: unknown, fallback: string) => {
    const responseMessage = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
    if (responseMessage) return responseMessage
    return err instanceof Error ? err.message : fallback
}

const findCategory = (categories: PartLookupCategory[], value: string) => {
    const key = normalizeLookup(value)
    return categories.find(
        (category) => normalizeLookup(category.code) === key || normalizeLookup(category.name) === key
    )
}

const findHsn = (hsnList: PartLookupHsn[], value: string) => {
    const key = normalizeLookup(value)
    return hsnList.find(
        (hsn) =>
            normalizeLookup(hsn.hsnCode) === key ||
            (hsn.description ? normalizeLookup(hsn.description) === key : false)
    )
}

const findBrand = (brands: PartLookupBrand[], value: string) => {
    const key = normalizeLookup(value)
    return brands.find(
        (brand) =>
            normalizeLookup(brand.brandName) === key ||
            (brand.brandCode ? normalizeLookup(brand.brandCode) === key : false)
    )
}

const findModel = (models: PartLookupModel[], value: string, brandId: number) => {
    const key = normalizeLookup(value)
    return models.find(
        (model) =>
            String(model.brandId) === String(brandId) &&
            (normalizeLookup(model.modelName) === key ||
                (model.modelCode ? normalizeLookup(model.modelCode) === key : false))
    )
}

const findVariant = (variants: PartLookupVariant[], value: string, modelId: number) => {
    const key = normalizeLookup(value)
    return variants.find(
        (variant) =>
            String(variant.modelId) === String(modelId) &&
            (normalizeLookup(variant.variantName) === key ||
                (variant.variantCode ? normalizeLookup(variant.variantCode) === key : false))
    )
}

export const partMasterImportConfig: ImportExcelConfig = {
    entityLabel: 'Part',
    templateFileName: 'part-master-import-template.xlsx',
    description:
        'Upload an Excel file to add part records in bulk. Each row is created using the existing part master API. Category, brand and model must already exist. Variant is optional; leave it blank to import the part at model level. Missing HSN codes are created automatically using the Tax Rate from the file.',
    prepare: async () => {
        await refreshPartMasterLookups()
    },
    columns: [
        { key: 'partNo', label: 'Part Number', required: true, aliases: ['partnumber', 'partno', 'partcode'], example: 'P-10001' },
        { key: 'partDescription', label: 'Part Description', required: true, aliases: ['description', 'partdescription'], example: 'Brake Pad Set' },
        { key: 'partCategory', label: 'Part Category', required: true, aliases: ['category', 'categories', 'partcategory', 'partcategories', 'partcategorycode'], example: 'PC001' },
        { key: 'hsnCode', label: 'HSN Code', required: true, aliases: ['hsn', 'hsncode'], example: '8708' },
        { key: 'sellingPrice', label: 'Selling Price', required: true, aliases: ['sellingprice', 'price'], example: '1500.00' },
        { key: 'landingPrice', label: 'Landing Price', required: true, aliases: ['landingprice', 'cost'], example: '1200.00' },
        { key: 'taxRate', label: 'Tax Rate', aliases: ['taxrate', 'gst'], example: '18' },
        { key: 'unitOfMeasure', label: 'Unit of Measure', required: true, aliases: ['unit', 'uom', 'unitofmeasure'], example: 'PCS' },
        { key: 'reorderLevel', label: 'Reorder Level', aliases: ['reorderlevel', 'reorder'], example: '10' },
        { key: 'isFastMoving', label: 'Fast Moving', aliases: ['isfastmoving', 'fastmoving'], example: 'No' },
        { key: 'validFrom', label: 'Valid From', aliases: ['validfrom'], example: '2024-01-01' },
        { key: 'validTo', label: 'Valid To', aliases: ['validto'], example: '2025-12-31' },
        { key: 'brand', label: 'Brand', required: true, aliases: ['brands', 'brandname', 'brandcode'], example: 'Maruti Suzuki' },
        { key: 'model', label: 'Model', required: true, aliases: ['models', 'modelname', 'modelcode'], example: 'Swift' },
        { key: 'variant', label: 'Variant', aliases: ['variants', 'variantname', 'variantcode'], example: 'VXi' },
        { key: 'isOem', label: 'OEM', aliases: ['isoem', 'oem'], example: 'Yes' },
        { key: 'position', label: 'Position', aliases: ['fitmentposition'], example: 'Front' },
        { key: 'quantity', label: 'Quantity', required: true, aliases: ['qty', 'fitmentquantity'], example: '1' },
        { key: 'fitmentValidFrom', label: 'Fitment Valid From', aliases: ['fitmentvalidfrom'], example: '2024-01-01' },
        { key: 'fitmentValidTo', label: 'Fitment Valid To', aliases: ['fitmentvalidto'], example: '2025-12-31' },
    ],
    mapRow: (row) => {
        const partNo = row.partNo.trim()
        const partDescription = row.partDescription.trim()
        const partCategory = row.partCategory.trim()
        const hsnCode = row.hsnCode.trim()
        const brand = row.brand.trim()
        const model = row.model.trim()
        const variant = row.variant.trim()

        if (!partNo) return { error: 'Part number is required' }
        if (!partDescription) return { error: 'Part description is required' }
        if (!partCategory) return { error: 'Part category is required' }
        if (!hsnCode) return { error: 'HSN code is required' }
        if (!brand) return { error: 'Brand is required' }
        if (!model) return { error: 'Model is required' }

        const unitOfMeasure = resolveUnitOfMeasure(row.unitOfMeasure)
        if (!unitOfMeasure) {
            return {
                error: `Invalid unit of measure "${row.unitOfMeasure}". Use one of: ${partUnitOptions.map((unit) => unit.value).join(', ')}`,
            }
        }

        const sellingPrice = parseNumber(row.sellingPrice)
        if (!row.sellingPrice.trim() || !Number.isFinite(sellingPrice)) {
            return { error: 'Selling price must be a valid number' }
        }

        const landingPrice = parseNumber(row.landingPrice)
        if (!row.landingPrice.trim() || !Number.isFinite(landingPrice)) {
            return { error: 'Landing price must be a valid number' }
        }

        let taxRate = ''
        if (row.taxRate.trim()) {
            const parsedTaxRate = parseNumber(row.taxRate)
            if (!Number.isFinite(parsedTaxRate)) return { error: 'Tax rate must be a valid number' }
            taxRate = String(parsedTaxRate)
        }

        let reorderLevel = ''
        if (row.reorderLevel.trim()) {
            const parsedReorderLevel = parseNumber(row.reorderLevel)
            if (!Number.isFinite(parsedReorderLevel)) return { error: 'Reorder level must be a valid number' }
            reorderLevel = String(parsedReorderLevel)
        }

        const quantity = parseNumber(row.quantity)
        if (!row.quantity.trim() || !Number.isFinite(quantity) || quantity <= 0) {
            return { error: 'Quantity must be a valid number greater than 0' }
        }

        const validFrom = parseImportDate(row.validFrom, true)
        if (validFrom === null) return { error: 'Valid From must be a valid date' }

        const validTo = parseImportDate(row.validTo)
        if (validTo === null) return { error: 'Valid To must be a valid date' }
        if (validTo && dayjs(validTo).isBefore(dayjs(validFrom), 'day')) {
            return { error: 'Valid To cannot be before Valid From' }
        }

        const fitmentValidFrom = parseImportDate(row.fitmentValidFrom, true)
        if (fitmentValidFrom === null) return { error: 'Fitment Valid From must be a valid date' }

        const fitmentValidTo = parseImportDate(row.fitmentValidTo)
        if (fitmentValidTo === null) return { error: 'Fitment Valid To must be a valid date' }
        if (fitmentValidTo && dayjs(fitmentValidTo).isBefore(dayjs(fitmentValidFrom), 'day')) {
            return { error: 'Fitment Valid To cannot be before Fitment Valid From' }
        }

        return {
            payload: {
                partNo,
                partDescription,
                partCategory,
                hsnCode,
                sellingPrice: String(sellingPrice),
                landingPrice: String(landingPrice),
                taxRate,
                unitOfMeasure,
                reorderLevel,
                isFastMoving: parseBoolean(row.isFastMoving),
                validFrom,
                validTo,
                brand,
                model,
                variant,
                isOem: parseBoolean(row.isOem),
                position: row.position.trim(),
                quantity: String(quantity),
                fitmentValidFrom,
                fitmentValidTo,
            },
        }
    },
    createRecord: async (payload) => {
        let lookups = await loadPartMasterLookups()

        const partCategory = String(payload.partCategory ?? '')
        const hsnCode = String(payload.hsnCode ?? '')
        const brandName = String(payload.brand ?? '')
        const modelName = String(payload.model ?? '')
        const variantName = String(payload.variant ?? '')

        let category = findCategory(lookups.categories, partCategory)
        if (!category) {
            lookups = await refreshPartMasterLookups()
            category = findCategory(lookups.categories, partCategory)
        }
        if (!category) {
            throw new Error(`Part category "${partCategory}" was not found. Create it in Part Category first.`)
        }

        let hsn = findHsn(lookups.hsn, hsnCode)
        if (!hsn) {
            const taxRateValue = String(payload.taxRate ?? '').trim()
            if (!taxRateValue) {
                throw new Error(
                    `HSN code "${hsnCode}" was not found. Add a Tax Rate in the file so it can be created automatically in HSN Master.`
                )
            }

            let createErrorMessage = ''
            try {
                await createHSN({
                    hsnCode,
                    taxRate: Number(taxRateValue),
                    description: null,
                })
            } catch (err) {
                createErrorMessage = getApiErrorMessage(err, '')
            }

            lookups = await refreshPartMasterLookups()
            hsn = findHsn(lookups.hsn, hsnCode)
            if (!hsn) {
                throw new Error(
                    createErrorMessage ||
                        `HSN code "${hsnCode}" was not found and could not be created automatically. Create it in HSN Master first.`
                )
            }
        }

        const brand = findBrand(lookups.brands, brandName)
        if (!brand) {
            throw new Error(`Brand "${brandName}" was not found.`)
        }

        const model = findModel(lookups.models, modelName, brand.id)
        if (!model) {
            throw new Error(`Model "${modelName}" was not found for brand "${brand.brandName}".`)
        }

        let variant: PartLookupVariant | undefined
        if (variantName) {
            variant = findVariant(lookups.variants, variantName, model.id)
            if (!variant) {
                throw new Error(
                    `Variant "${variantName}" was not found for model "${model.modelName}". Leave the Variant blank to import this part at model level.`
                )
            }
        }

        const taxRate =
            String(payload.taxRate ?? '').trim() ||
            (hsn.taxRate !== null && hsn.taxRate !== undefined ? String(hsn.taxRate) : '')
        if (!taxRate) {
            throw new Error(`Tax rate is required for HSN ${hsn.hsnCode}. Add a tax rate to the HSN or include it in the file.`)
        }

        const reorderLevel = String(payload.reorderLevel ?? '').trim()

        return createPartMaster({
            partNo: String(payload.partNo ?? ''),
            partDescription: String(payload.partDescription ?? ''),
            partCategoryId: Number(category.id),
            hsnId: Number(hsn.id),
            sellingPrice: String(payload.sellingPrice ?? ''),
            landingPrice: String(payload.landingPrice ?? ''),
            taxRate,
            unitOfMeasure: String(payload.unitOfMeasure ?? ''),
            reorderLevel: reorderLevel ? Number(reorderLevel) : null,
            isFastMoving: Boolean(payload.isFastMoving),
            validFrom: String(payload.validFrom ?? ''),
            validTo: String(payload.validTo ?? '') || null,
            brandId: Number(brand.id),
            modelId: Number(model.id),
            variantId: variant ? Number(variant.id) : null,
            isOem: Boolean(payload.isOem),
            position: String(payload.position ?? '').trim() || null,
            quantity: Number(payload.quantity),
            fitmentValidFrom: String(payload.fitmentValidFrom ?? ''),
            fitmentValidTo: String(payload.fitmentValidTo ?? '') || null,
        })
    },
}
