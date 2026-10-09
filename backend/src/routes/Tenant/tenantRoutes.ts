import { Router } from "express";
import { authenticate, requireTenantUser } from "../../middlewares/authMiddleware/loginMiddelware";
import { activateTenantBranch, createBranch, deactivateTenantBranch, getTenantBranchById, getTenantBranchList, updatedBranch } from "../../controllers/tenants/tenantSectionController";
import { activateTenantDesignation, createEmployeeDesignation, deactivateTenantDesignation, getAllEmployeeDesignation, getEmployeeDesignationDetails, mechanicAssign, mechanicUnassign, updateDesignation } from "../../controllers/tenants/employeeDesignationController";
import { activateTenantRole, assigningPermissionToRole, createRole, deactivateTenantRole, getAllTenantRole, getRoleDetails, updateRole, updatePermissionToRole, getListOfPermissionToRole, getDetailsPermissionToRole } from "../../controllers/tenants/roleAndPermissionController";
import { activateEmployee, createEmployee, deactivateEmployee, getListOfTenantEmployee, getTenantEmployeeDetails, updateEmployeeDetails } from "../../controllers/tenants/employeeManagementController";

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


//Role permission mapping route
tenantRoute.post('/tenant/role/permission/assign', authenticate, requireTenantUser, assigningPermissionToRole)
tenantRoute.put('/tenant/role/permission/:rolePermissionId/update', authenticate, requireTenantUser, updatePermissionToRole)
tenantRoute.get('/tenant/role/permission/get/all', authenticate, requireTenantUser, getListOfPermissionToRole)
tenantRoute.get('/tenant/role/permission/get/:rolePermissionId', authenticate, requireTenantUser, getDetailsPermissionToRole)

//Employee Management
tenantRoute.post('/tenant/employee/new/create', authenticate, requireTenantUser, createEmployee)
tenantRoute.put('/tenant/employee/:employeeId/update', authenticate, requireTenantUser, updateEmployeeDetails)
tenantRoute.get('/tenant/employee/get/all', authenticate, requireTenantUser, getListOfTenantEmployee)
tenantRoute.get('/tenant/employee/get/:employeeId', authenticate, requireTenantUser, getTenantEmployeeDetails)
tenantRoute.patch('/tenant/employee/:employeeId/deactivate', authenticate, requireTenantUser, deactivateEmployee)
tenantRoute.patch('/tenant/employee/:employeeId/activate', authenticate, requireTenantUser, activateEmployee)
export default tenantRoute;