import { Router } from "express";
import { authenticate, requirePlatformUser } from "../../middlewares/authMiddleware/loginMiddelware";
import { activatePlatformUser, addPlatformUsers, deactivatePlatformUser, editPlatformUser, getListOfPlatformUsers, getPlatformUserById } from "../../controllers/platformUser/platformUserControllers";
import { createTenant, getTenantList, getTenantById, editTenant, suspendTenant, deactivateTenant, activateTenant } from "../../controllers/platformUser/tenantManagementController";

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

export default platformUserRoute;