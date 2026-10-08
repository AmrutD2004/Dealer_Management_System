import { Router } from "express";
import { authenticate, requireTenantUser } from "../../middlewares/authMiddleware/loginMiddelware";
import { createBranch, getTenantBranchList } from "../../controllers/tenants/tenantSectionController";

const tenantRoute = Router();
tenantRoute.post('/tenant/branch/create', authenticate, requireTenantUser, createBranch)
tenantRoute.get('/tenant/branch/get/all', authenticate, requireTenantUser, getTenantBranchList)

export default tenantRoute;