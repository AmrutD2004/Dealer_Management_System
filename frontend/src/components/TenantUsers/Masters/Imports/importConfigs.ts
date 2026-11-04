import { createBranch, createDesignation, createLabour, createPartCategory } from '@/api/endpoints'
import type { ImportExcelConfig } from './ImportExcelModal'

const parseNumber = (value: string) => Number(value.trim().replace(/,/g, ''))

const parseBoolean = (value: string) => {
    const normalized = value.trim().toLowerCase()
    return ['true', 'yes', 'y', '1', 'mechanic'].includes(normalized)
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
