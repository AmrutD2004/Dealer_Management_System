import { Router } from "express";
import { authenticate, requireTenantUser } from "../../middlewares/authMiddleware/loginMiddelware";
import { activateTenantBranch, createBranch, deactivateTenantBranch, getTenantBranchById, getTenantBranchList, updatedBranch } from "../../controllers/tenants/tenantSectionController";
import { activateTenantDesignation, createEmployeeDesignation, deactivateTenantDesignation, getAllEmployeeDesignation, getEmployeeDesignationDetails, mechanicAssign, mechanicUnassign, updateDesignation } from "../../controllers/tenants/employeeDesignationController";
import { activateTenantRole, assigningPermissionToRole, createRole, deactivateTenantRole, getAllTenantRole, getRoleDetails, updateRole, updatePermissionToRole, getListOfPermissionToRole, getDetailsPermissionToRole } from "../../controllers/tenants/roleAndPermissionController";
import { activateEmployee, createEmployee, deactivateEmployee, getListOfTenantEmployee, getTenantEmployeeDetails, updateEmployeeDetails } from "../../controllers/tenants/employeeManagementController";
import { activateServiceCategory, activateServiceType, createServiceCategory, createServiceType, deactivateServiceCategory, deactivateServiceType, getListOfServiceCategory, getListOfServiceType, getListOfServiceTypeAccordingServiceCategory, getServiceCategoryDetails, getServiceTypeDetails, updateServiceCategory, updateServiceType } from "../../controllers/tenants/Services/serviceController";
import { activateRepairOrder, createRepairOrder, deactivateRepairOrder, getListOfRepairOrder, getRepairOrderDetails, updateRepairOrder } from "../../controllers/tenants/repairOrderController";

import { activateCustomer, createCustomer, deactivateCustomer, findCustomer, getCustomerDetails, getCustomerList, updateCustomer } from "../../controllers/tenants/customerManagementController";
import { activateVehicle, createVehicle, deactivateVehicle, getListOfVehicle, getVehicleDetails, updateVehicle } from "../../controllers/tenants/vehicalManagementController";
import { closeJobCard, createJobCard, getJobcardDetails, getListOfJobCard, updateJobCard } from "../../controllers/tenants/jobCardManagement";
import { activateLabours, createLabours, deactivateLabours, getLaboursDetails, getListOfLabours, updateLabours } from "../../controllers/tenants/labourMasterManagement";
import { activateBay, createBay, deactivateBay, getBayDetails, getListOfBay, updateBay } from "../../controllers/tenants/bayMasterManagementController";
import { allocateJobCard, getAllocatedJobCardDetails, getListOfAllocatedJobCards, updateAllocatedJobCard } from "../../controllers/tenants/jobCardAllocationController";
import { activateHSN, createHSN, deactivateHSN, getHSNDetails, getListOfHSN, updateHSN } from "../../controllers/tenants/hsnMasterController";
import { activatePartCategory, addPartCategory, deactivatePartCategory, getListOfPartCategories, getPartCategoryDetails, updatePartCategory } from "../../controllers/tenants/Parts/partCategoryManagementController";
import { activatePart, addPartMaster, deactivatePart, getListOfParts, getPartDetails, updatePartMaster } from "../../controllers/tenants/Parts/partMasterManagementController";
import { getListOfPartFitment, getPartFitmentDetails, updatePartFitment } from "../../controllers/tenants/Parts/partFitmentManagementController";

const tenantRoute = Router();
//Branch Management routes
tenantRoute.post('/tenant/branch/create', authenticate, requireTenantUser, createBranch)
tenantRoute.get('/tenant/branch/get/all', authenticate, requireTenantUser, getTenantBranchList)
tenantRoute.put('/tenant/branch/:branchId/update', authenticate, requireTenantUser, updatedBranch)
tenantRoute.patch('/tenant/branch/:branchId/deactivate', authenticate, requireTenantUser, deactivateTenantBranch)
tenantRoute.patch('/tenant/branch/:branchId/activate', authenticate, requireTenantUser, activateTenantBranch)
tenantRoute.get('/tenant/branch/get/:branchId', authenticate, requireTenantUser, getTenantBranchById)

//Employee Designation Routes
tenantRoute.post('/tenant/designation/create', authenticate, requireTenantUser, createEmployeeDesignation)
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


//Service Category
tenantRoute.post('/tenant/service/category/create', authenticate, requireTenantUser, createServiceCategory)
tenantRoute.put('/tenant/service/category/:serviceCategoryId/update', authenticate, requireTenantUser, updateServiceCategory)
tenantRoute.patch('/tenant/service/category/:serviceCategoryId/deactivate', authenticate, requireTenantUser, deactivateServiceCategory)
tenantRoute.patch('/tenant/service/category/:serviceCategoryId/activate', authenticate, requireTenantUser, activateServiceCategory)
tenantRoute.get('/tenant/service/category/get/all', authenticate, requireTenantUser, getListOfServiceCategory)
tenantRoute.get('/tenant/service/category/get/:serviceCategoryId', authenticate, requireTenantUser, getServiceCategoryDetails)


//Service Type
tenantRoute.post('/tenant/service/type/create', authenticate, requireTenantUser, createServiceType)
tenantRoute.put('/tenant/service/type/:serviceTypeId/update', authenticate, requireTenantUser, updateServiceType)
tenantRoute.get('/tenant/service/type/get/all', authenticate, requireTenantUser, getListOfServiceType)
tenantRoute.get('/tenant/service/type/get/:serviceTypeId', authenticate, requireTenantUser, getServiceTypeDetails)
tenantRoute.patch('/tenant/service/type/:serviceTypeId/deactivate', authenticate, requireTenantUser, deactivateServiceType)
tenantRoute.patch('/tenant/service/type/:serviceTypeId/activate', authenticate, requireTenantUser, activateServiceType)
tenantRoute.get('/tenant/service/category/type/get/:categoryId', authenticate, requireTenantUser, getListOfServiceTypeAccordingServiceCategory)

//Repair Order
tenantRoute.post('/tenant/repairorder/create', authenticate, requireTenantUser, createRepairOrder)
tenantRoute.put('/tenant/repairorder/:repairOrderId/update', authenticate, requireTenantUser, updateRepairOrder)
tenantRoute.get('/tenant/repairorder/get/all', authenticate, requireTenantUser, getListOfRepairOrder)
tenantRoute.get('/tenant/repairorder/get/:repairOrderId', authenticate, requireTenantUser, getRepairOrderDetails)
tenantRoute.patch('/tenant/repairorder/:repairOrderId/deactivate', authenticate, requireTenantUser, deactivateRepairOrder)
tenantRoute.patch('/tenant/repairorder/:repairOrderId/activate', authenticate, requireTenantUser, activateRepairOrder)


//Cutomer Management
tenantRoute.post('/tenant/customer/create', authenticate, requireTenantUser, createCustomer)
tenantRoute.put('/tenant/customer/:custId/update', authenticate, requireTenantUser, updateCustomer)
tenantRoute.get('/tenant/customer/get/all', authenticate, requireTenantUser, getCustomerList)
tenantRoute.get('/tenant/customer/get/:custId', authenticate, requireTenantUser, getCustomerDetails)
tenantRoute.patch('/tenant/customer/:custId/deactivate', authenticate, requireTenantUser, deactivateCustomer)
tenantRoute.patch('/tenant/customer/:custId/activate', authenticate, requireTenantUser, activateCustomer)
tenantRoute.get('/tenant/customer/find', authenticate, requireTenantUser, findCustomer)


//Vehicle Management
tenantRoute.post('/tenant/vehicle/create', authenticate, requireTenantUser, createVehicle)
tenantRoute.put('/tenant/vehicle/:vehicleId/update', authenticate, requireTenantUser, updateVehicle)
tenantRoute.get('/tenant/vehicle/get/all', authenticate, requireTenantUser, getListOfVehicle)
tenantRoute.get('/tenant/vehicle/get/:vehicleId', authenticate, requireTenantUser, getVehicleDetails)
tenantRoute.patch('/tenant/vehicle/:vehicleId/deactivate', authenticate, requireTenantUser, deactivateVehicle)
tenantRoute.patch('/tenant/vehicle/:vehicleId/activate', authenticate, requireTenantUser, activateVehicle)


//Labour Master Management
tenantRoute.post('/tenant/labour/create', authenticate, requireTenantUser, createLabours)
tenantRoute.put('/tenant/labour/:labourId/update', authenticate, requireTenantUser, updateLabours)
tenantRoute.get('/tenant/labour/get/all', authenticate, requireTenantUser, getListOfLabours)
tenantRoute.get('/tenant/labour/get/:labourId', authenticate, requireTenantUser, getLaboursDetails)
tenantRoute.patch('/tenant/labour/:labourId/deactivate', authenticate, requireTenantUser, deactivateLabours)
tenantRoute.patch('/tenant/labour/:labourId/activate', authenticate, requireTenantUser, activateLabours)


//Jobcard Management
tenantRoute.post('/tenant/jobcard/create', authenticate, requireTenantUser, createJobCard)
tenantRoute.put('/tenant/jobcard/:jobCardId/update', authenticate, requireTenantUser, updateJobCard)
tenantRoute.get('/tenant/jobcard/get/all', authenticate, requireTenantUser, getListOfJobCard)
tenantRoute.get('/tenant/jobcard/get/:jobCardId', authenticate, requireTenantUser, getJobcardDetails)
tenantRoute.patch('/tenant/jobcard/:jobCardId/close', authenticate, requireTenantUser, closeJobCard)


//Dealer Bay Management
tenantRoute.post('/tenant/bay/create', authenticate, requireTenantUser, createBay)
tenantRoute.put('/tenant/bay/:bayId/update', authenticate, requireTenantUser, updateBay)
tenantRoute.get('/tenant/bay/get/all', authenticate, requireTenantUser, getListOfBay)
tenantRoute.get('/tenant/bay/get/:bayId', authenticate, requireTenantUser, getBayDetails)
tenantRoute.patch('/tenant/bay/:bayId/deactivate', authenticate, requireTenantUser, deactivateBay)
tenantRoute.patch('/tenant/bay/:bayId/activate', authenticate, requireTenantUser, activateBay)

//Job card allocation
tenantRoute.post('/tenant/jobcard/allocate', authenticate, requireTenantUser, allocateJobCard)
tenantRoute.put('/tenant/jobcard/allocate/:allocatedId/update', authenticate, requireTenantUser, updateAllocatedJobCard)
tenantRoute.get('/tenant/jobcard/allocate/get/all', authenticate, requireTenantUser, getListOfAllocatedJobCards)
tenantRoute.get('/tenant/jobcard/allocate/get/:allocatedId', authenticate, requireTenantUser, getAllocatedJobCardDetails)


//HSN Master Management
tenantRoute.post('/tenant/hsn/create', authenticate, requireTenantUser, createHSN)
tenantRoute.put('/tenant/hsn/:hsnId/update', authenticate, requireTenantUser, updateHSN)
tenantRoute.get('/tenant/hsn/get/all', authenticate, requireTenantUser, getListOfHSN)
tenantRoute.get('/tenant/hsn/get/:hsnId', authenticate, requireTenantUser, getHSNDetails)
tenantRoute.patch('/tenant/hsn/:hsnId/deactivate', authenticate, requireTenantUser, deactivateHSN)
tenantRoute.patch('/tenant/hsn/:hsnId/activate', authenticate, requireTenantUser, activateHSN)


//Part Category Management
tenantRoute.post('/tenant/part/category/create', authenticate, requireTenantUser, addPartCategory)
tenantRoute.put('/tenant/part/category/:categoryId/update', authenticate, requireTenantUser, updatePartCategory)
tenantRoute.get('/tenant/part/category/get/all', authenticate, requireTenantUser, getListOfPartCategories)
tenantRoute.get('/tenant/part/category/get/:categoryId', authenticate, requireTenantUser, getPartCategoryDetails)
tenantRoute.patch('/tenant/part/category/:categoryId/deactivate', authenticate, requireTenantUser, deactivatePartCategory)
tenantRoute.patch('/tenant/part/category/:categoryId/activate', authenticate, requireTenantUser, activatePartCategory)


//Part Master Management
tenantRoute.post('/tenant/part/create', authenticate, requireTenantUser, addPartMaster)
tenantRoute.put('/tenant/part/:partId/update', authenticate, requireTenantUser, updatePartMaster)
tenantRoute.get('/tenant/part/get/all', authenticate, requireTenantUser, getListOfParts)
tenantRoute.get('/tenant/part/get/:partId', authenticate, requireTenantUser, getPartDetails)
tenantRoute.patch('/tenant/part/:partId/deactivate', authenticate, requireTenantUser, deactivatePart)
tenantRoute.patch('/tenant/part/:partId/activate', authenticate, requireTenantUser, activatePart)


//Part Fitment Management
// tenantRoute.post('/tenant/part/fitment/create', authenticate, requireTenantUser, addPartFitment)
tenantRoute.put('/tenant/part/fitment/:fitmentId/update', authenticate, requireTenantUser, updatePartFitment)
tenantRoute.get('/tenant/part/fitment/get/all', authenticate, requireTenantUser, getListOfPartFitment)
tenantRoute.get('/tenant/part/fitment/get/:fitmentId', authenticate, requireTenantUser, getPartFitmentDetails)
export default tenantRoute;