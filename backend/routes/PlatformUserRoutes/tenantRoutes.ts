import { Router } from "express";
import { platformUserAuth } from "../../middlerwares/platformAdminMiddleware";
import { createTenant, deactivateTenant, editTenant, getTenantById, getTenantList, suspendTenant } from "../../controller/platformUserControllers/tenantManagementController";

const tenantRoute = Router()
tenantRoute.post('/tenant/create', platformUserAuth, createTenant)
tenantRoute.get('/tenant/get/all', platformUserAuth, getTenantList)
tenantRoute.get('/tenant/get/:id', platformUserAuth, getTenantById)
tenantRoute.put('/tenant/update/:id', platformUserAuth, editTenant)
tenantRoute.patch('/tenant/subscription/suspend/:id', platformUserAuth, suspendTenant)
tenantRoute.patch('/tenant/deactivate/:id', platformUserAuth, deactivateTenant)
export default tenantRoute;