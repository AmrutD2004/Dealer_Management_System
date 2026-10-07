import { Router } from "express";
import { authenticate, requireTenantUser } from "../../middlewares/authMiddleware/loginMiddelware";
import { createBranch } from "../../controllers/tenants/tenantSectionController";

const tenantRoute = Router();
tenantRoute.post('/tenant/branch/create', authenticate, requireTenantUser, createBranch)

export default tenantRoute;