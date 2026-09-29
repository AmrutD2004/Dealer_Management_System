import { Router } from "express";
import { platformUserAuth } from "../../middlerwares/platformAdminMiddleware";
import { createTenant } from "../../controller/platformUserControllers/tenantManagementController";

const tenantRoute = Router()
tenantRoute.post('/tenant/create', platformUserAuth, createTenant)
export default tenantRoute;