import type { customerListType } from "./tenantCreateType"
import type { vehicleBrand } from "./vehicleBrand"
import type { vehicleModel } from "./vehicleModel"
import type { vehicleVariant } from "./vehicleVariants"

export interface vehicleAuthorizedByType {
    firstName: string
    lastName: string
}

export interface vehicleListType {
    id: number
    tenantId?: number
    customerId: number
    brandId: number
    modelId: number
    variantId: number
    vehicleNumber: string | null
    chassisNumber: string
    manufacturer?: string | null
    engineNumber: string | null
    color: string | null
    currentOdometerReading: number | string | null
    manufacturingYear: number | string | null
    purchaseDate: string | null
    registrationDate: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string
    customer?: customerListType | null
    brand: vehicleBrand
    model: vehicleModel
    variant: vehicleVariant
    authorizedByUser?: vehicleAuthorizedByType | null
}
