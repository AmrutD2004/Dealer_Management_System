import { Router } from "express";
import { platformUserAuth } from "../../middlerwares/platformAdminMiddleware";
import { createTenant, getTenantList } from "../../controller/platformUserControllers/tenantManagementController";

const tenantRoute = Router()
tenantRoute.post('/tenant/create', platformUserAuth, createTenant)
tenantRoute.get('/tenant/get', platformUserAuth, getTenantList)
export default tenantRoute;