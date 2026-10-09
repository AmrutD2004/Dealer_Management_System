import { Router } from "express";
import { authenticate, requireTenantUser } from "../../middlewares/authMiddleware/loginMiddelware";
import { activateTenantBranch, createBranch, deactivateTenantBranch, getTenantBranchById, getTenantBranchList, updatedBranch } from "../../controllers/tenants/tenantSectionController";
import { activateTenantDesignation, createEmployeeDesignation, deactivateTenantDesignation, getAllEmployeeDesignation, getEmployeeDesignationDetails, mechanicAssign, mechanicUnassign, updateDesignation } from "../../controllers/tenants/employeeDesignationController";
import { activateTenantRole, createRole, deactivateTenantRole, getAllTenantRole, getRoleDetails, updateRole } from "../../controllers/tenants/roleAndPermissionController";

const tenantRoute = Router();
//Branch Management routes
tenantRoute.post('/tenant/branch/create', authenticate, requireTenantUser, createBranch)
tenantRoute.get('/tenant/branch/get/all', authenticate, requireTenantUser, getTenantBranchList)
tenantRoute.put('/tenant/branch/:branchId/update', authenticate, requireTenantUser, updatedBranch)
tenantRoute.patch('/tenant/branch/:branchId/deactivate', authenticate, requireTenantUser, deactivateTenantBranch)
tenantRoute.patch('/tenant/branch/:branchId/activate', authenticate, requireTenantUser, activateTenantBranch)
tenantRoute.get('/tenant/branch/get/:branchId', authenticate, requireTenantUser, getTenantBranchById)

//Employee Designation Routes
tenantRoute.post('/tenant/designation/create', authenticate,requireTenantUser, createEmployeeDesignation)
tenantRoute.get('/tenant/designation/get/all', authenticate, requireTenantUser, getAllEmployeeDesignation)
tenantRoute.get('/tenant/designation/get/:designationId', authenticate, requireTenantUser, getEmployeeDesignationDetails)
tenantRoute.put('/tenant/designation/:designationId/update', authenticate, requireTenantUser, updateDesignation)
tenantRoute.patch('/tenant/designation/:designationId/mechanic/assign', authenticate, requireTenantUser, mechanicAssign)
tenantRoute.patch('/tenant/designation/:designationId/mechanic/unassign', authenticate, requireTenantUser, mechanicUnassign)
tenantRoute.patch('/tenant/designation/:designationId/activate', authenticate, requireTenantUser, activateTenantDesignation)
tenantRoute.patch('/tenant/designation/:designationId/deactivate', authenticate, requireTenantUser, deactivateTenantDesignation)

//Role Routes
tenantRoute.post('/tenant/role/create', authenticate, requireTenantUser, createRole)
tenantRoute.get('/tenant/role/get/all', authenticate, requireTenantUser, getAllTenantRole)
tenantRoute.get('/tenant/role/get/:roleId', authenticate, requireTenantUser, getRoleDetails)
tenantRoute.put('/tenant/role/:roleId/update', authenticate, requireTenantUser, updateRole)
tenantRoute.patch('/tenant/role/:roleId/deactivate', authenticate, requireTenantUser, deactivateTenantRole)
tenantRoute.patch('/tenant/role/:roleId/activate', authenticate, requireTenantUser, activateTenantRole)

export default tenantRoute;