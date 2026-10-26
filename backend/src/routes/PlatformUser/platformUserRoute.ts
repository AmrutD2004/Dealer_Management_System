import { Router } from "express";
import { authenticate, requirePlatformUser } from "../../middlewares/authMiddleware/loginMiddelware";
import { activatePermission, activatePlatformUser, addPlatformUsers, createPermission, deactivatePermission, deactivatePlatformUser, editPlatformUser, getListOfPermissions, getListOfPlatformUsers, getPermissonDetails, getPlatformUserById, updatePermission } from "../../controllers/platformUser/platformUserControllers";
import { createTenant, getTenantList, getTenantById, editTenant, suspendTenant, deactivateTenant, activateTenant } from "../../controllers/platformUser/tenantManagementController";
import { activateBrand, addBrand, deactivateBrand, getBrandDetails, getListOfBrands, updateBrand } from "../../controllers/platformUser/brandMasterController";
import { activateModel, addModel, deactivateModel, getListOfModels, getModelDetails, updateModel } from "../../controllers/platformUser/modelMasterController";
import { activateVariant, addVariants, deactivateVariant, getListOfVariants, getVariantDetails, updateVariant } from "../../controllers/platformUser/vehicleVariantController";

const platformUserRoute = Router()

//PlatformUser management Routes
platformUserRoute.post('/platform/newuser/create', authenticate, requirePlatformUser, addPlatformUsers)
platformUserRoute.put('/platform/user/update/:userId', authenticate, requirePlatformUser, editPlatformUser)
platformUserRoute.patch('/platform/user/deactivate/:userId', authenticate, requirePlatformUser, deactivatePlatformUser)
platformUserRoute.patch('/platform/user/activate/:userId', authenticate, requirePlatformUser, activatePlatformUser)
platformUserRoute.get('/platform/users/get/all', authenticate, requirePlatformUser, getListOfPlatformUsers)
platformUserRoute.get('/platform/user/get/:userId', authenticate, requirePlatformUser, getPlatformUserById)

//Tenant Management Routes
platformUserRoute.post('/platform/tenant/create', authenticate, requirePlatformUser, createTenant)
platformUserRoute.get('/platform/tenant/get/all', authenticate, requirePlatformUser, getTenantList)
platformUserRoute.get('/platform/tenant/get/:tenantId', authenticate, requirePlatformUser, getTenantById)
platformUserRoute.put('/platform/tenant/update/:tenantId', authenticate, requirePlatformUser, editTenant)
platformUserRoute.patch('/platform/tenant/suspend/:tenantId', authenticate, requirePlatformUser, suspendTenant)
platformUserRoute.patch('/platform/tenant/deactivate/:tenantId', authenticate, requirePlatformUser, deactivateTenant)
platformUserRoute.patch('/platform/tenant/activate/:tenantId', authenticate, requirePlatformUser, activateTenant)


//Permission Management
platformUserRoute.post('/platform/permission/create', authenticate, requirePlatformUser, createPermission)
platformUserRoute.put('/platform/permission/:permissionId/update', authenticate, requirePlatformUser, updatePermission)
platformUserRoute.patch('/platform/permission/:permissionId/deactivate', authenticate, requirePlatformUser, deactivatePermission)
platformUserRoute.patch('/platform/permission/:permissionId/activate', authenticate, requirePlatformUser, activatePermission)
platformUserRoute.get('/platform/permission/get/all', authenticate, getListOfPermissions)
platformUserRoute.get('/platform/permission/get/:permissionId', authenticate, requirePlatformUser, getPermissonDetails)

//Brand Master management

platformUserRoute.post('/platform/brand/create', authenticate, requirePlatformUser, addBrand)
platformUserRoute.put('/platform/brand/:brandId/update', authenticate, requirePlatformUser, updateBrand)
platformUserRoute.patch('/platform/brand/:brandId/deactivate', authenticate, requirePlatformUser, deactivateBrand)
platformUserRoute.patch('/platform/brand/:brandId/activate', authenticate, requirePlatformUser, activateBrand)
platformUserRoute.get('/platform/brand/get/all', authenticate, getListOfBrands)
platformUserRoute.get('/platform/brand/get/:brandId', authenticate, requirePlatformUser, getBrandDetails)

//Vehicle Models Management
platformUserRoute.post('/platform/vehicle/model/create', authenticate, requirePlatformUser, addModel)
platformUserRoute.put('/platform/vehicle/model/:modelId/update', authenticate, requirePlatformUser, updateModel)
platformUserRoute.patch('/platform/vehicle/model/:modelId/deactivate', authenticate, requirePlatformUser, deactivateModel)
platformUserRoute.patch('/platform/vehicle/model/:modelId/activate', authenticate, requirePlatformUser, activateModel)
platformUserRoute.get('/platform/vehicle/model/get/all', authenticate, getListOfModels)
platformUserRoute.get('/platform/vehicle/model/get/:modelId', authenticate, requirePlatformUser, getModelDetails)

//Vehicle Variant Management
platformUserRoute.post('/platform/vehicle/variant/create', authenticate, requirePlatformUser, addVariants)
platformUserRoute.put('/platform/vehicle/variant/:variantId/update', authenticate, requirePlatformUser, updateVariant)
platformUserRoute.patch('/platform/vehicle/variant/:variantId/deactivate', authenticate, requirePlatformUser, deactivateVariant)
platformUserRoute.patch('/platform/vehicle/variant/:variantId/activate', authenticate, requirePlatformUser, activateVariant)
platformUserRoute.get('/platform/vehicle/variant/get/all', authenticate, getListOfVariants)
platformUserRoute.get('/platform/vehicle/variant/get/:variantId', authenticate, requirePlatformUser, getVariantDetails)
export default platformUserRoute;