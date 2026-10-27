import axios from 'axios'
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})
// export const createPlatformUser = async (payload: {}) => {
//     const response = await api.post('/api/platformuser/create', payload)
//     return await response.data;
// }

export const unifiedLogin = async (payload: {}) => {
    const response = await api.post(`/api/auth/login`, payload)
    return await response.data;
}

export const isAuthenticatedUser = async () => {
    const response = await api.get(`/api/auth/me`)
    return await response.data
}

export const logout = async () => {
    const response = await api.post(`/api/logout`)
    return await response.data
}


//platform user management
export const createNewPlatformUser = async (payload: {}) => {
    const response = await api.post(`/api/platform/newuser/create`, payload)
    return await response.data;
}

export const getPlatformUserList = async (skip: number, take: number) => {
    const response = await api.get(`/api/platform/users/get/all?skip=${skip}&take=${take}`)
    return await response.data
}

export const deactivatePlatformUser = async (id: number) => {
    const response = await api.patch(`/api/platform/user/deactivate/${id}`)
    return await response.data
}

export const activatePlatformUser = async (id: number) => {
    const response = await api.patch(`/api/platform/user/activate/${id}`)
    return await response.data
}
export const editPlatformUser = async (payload: {}, id: number) => {
    const response = await api.put(`/api/platform/user/update/${id}`, payload)
    return await response.data;
}

//Tenant management
export const tenantCreation = async (payload: {}) => {
    const response = await api.post(`/api/platform/tenant/create`, payload)
    return await response.data;
}

export const getTenantList = async (skip: number, take: number) => {
    const response = await api.get(`/api/platform/tenant/get/all?skip=${skip}&take=${take}`)
    return await response.data
}

export const getTenantById = async (tenantId: number) => {
    const response = await api.get(`/api/platform/tenant/get/${tenantId}`)
    return await response.data
}

export const editTenant = async (payload: {}, tenantId: number) => {
    const response = await api.put(`/api/platform/tenant/update/${tenantId}`, payload)
    return await response.data;
}

export const suspendTenant = async (tenantId: number) => {
    const response = await api.patch(`/api/platform/tenant/suspend/${tenantId}`, { status: "SUSPENDED" })
    return await response.data;
}

export const deactivateTenant = async (tenantId: number) => {
    const response = await api.patch(`/api/platform/tenant/deactivate/${tenantId}`)
    return await response.data
}

export const activateTenant = async (tenantId: number) => {
    const response = await api.patch(`/api/platform/tenant/activate/${tenantId}`)
    return await response.data
}


export const createBranch = async (payload: {}) => {
    const response = await api.post(`/api/tenant/branch/create`, payload)
    return await response.data;
}


export const getTenantBranchList = async (skip: number, take: number) => {
    const response = await api.get(`/api/tenant/branch/get/all?skip=${skip}&take=${take}`)
    return await response.data;
}

export const getTenantBranchById = async (branchId: number) => {
    const response = await api.get(`/api/tenant/branch/get/${branchId}`)
    return await response.data;
}

export const editTenantBranch = async (payload: {}, branchId: number) => {
    const response = await api.put(`/api/tenant/branch/${branchId}/update`, payload)
    return await response.data;
}

export const deactivateTenantBranch = async (branchId: number) => {
    const response = await api.patch(`/api/tenant/branch/${branchId}/deactivate`)
    return await response.data
}

export const activateTenantBranch = async (branchId: number) => {
    const response = await api.patch(`/api/tenant/branch/${branchId}/activate`)
    return await response.data
}

//Dealer Bay
export const createDealerBay = async (payload: Record<string, unknown>) => {
    const response = await api.post(`/api/tenant/bay/create`, payload)
    return await response.data;
}

export const getDealerBayList = async () => {
    const response = await api.get(`/api/tenant/bay/get/all`)
    return await response.data;
}

export const getDealerBayById = async (bayId: number) => {
    const response = await api.get(`/api/tenant/bay/get/${bayId}`)
    return await response.data;
}

export const updateDealerBay = async (payload: Record<string, unknown>, bayId: number) => {
    const response = await api.put(`/api/tenant/bay/${bayId}/update`, payload)
    return await response.data;
}

export const deactivateDealerBay = async (bayId: number) => {
    const response = await api.patch(`/api/tenant/bay/${bayId}/deactivate`)
    return await response.data;
}

export const activateDealerBay = async (bayId: number) => {
    const response = await api.patch(`/api/tenant/bay/${bayId}/activate`)
    return await response.data;
}


//Employee Designation
export const createDesignation = async (payload: {}) => {
    const response = await api.post(`/api/tenant/designation/create`, payload)
    return await response.data;
}

export const getDesignationList = async (skip: number, take: number) => {
    const response = await api.get(`/api/tenant/designation/get/all?skip=${skip}&take=${take}`)
    return await response.data;
}

export const getDesignationListWithoutPagination = async () => {
    const response = await api.get(`/api/tenant/designation/get/all`)
    return await response.data;
}

export const getDesignationById = async (designationId: number) => {
    const response = await api.get(`/api/tenant/designation/get/${designationId}`)
    return await response.data;
}

export const editDesignation = async (payload: {}, designationId: number) => {
    const response = await api.put(`/api/tenant/designation/${designationId}/update`, payload)
    return await response.data;
}

export const deactivateDesignation = async (designationId: number) => {
    const response = await api.patch(`/api/tenant/designation/${designationId}/deactivate`)
    return await response.data
}

export const activateDesignation = async (designationId: number) => {
    const response = await api.patch(`/api/tenant/designation/${designationId}/activate`)
    return await response.data
}


//Role management
export const createRole = async (payload: {}) => {
    const response = await api.post(`/api/tenant/role/create`, payload)
    return await response.data;
}

export const getRoleList = async (skip: number, take: number) => {
    const response = await api.get(`/api/tenant/role/get/all?skip=${skip}&take=${take}`)
    return await response.data;
}

export const getRoleListWithoutPagination = async () => {
    const response = await api.get(`/api/tenant/role/get/all`)
    return await response.data;
}

export const getRoleById = async (roleId: number) => {
    const response = await api.get(`/api/tenant/role/get/${roleId}`)
    return await response.data;
}

export const editRole = async (payload: {}, roleId: number) => {
    const response = await api.put(`/api/tenant/role/${roleId}/update`, payload)
    return await response.data;
}

export const deactivateRole = async (roleId: number) => {
    const response = await api.patch(`/api/tenant/role/${roleId}/deactivate`)
    return await response.data
}

export const activateRole = async (roleId: number) => {
    const response = await api.patch(`/api/tenant/role/${roleId}/activate`)
    return await response.data
}


//Permission management
export const createPermission = async (payload: {}) => {
    const response = await api.post(`/api/platform/permission/create`, payload)
    return await response.data;
}

export const getPermissionList = async (skip: number, take: number) => {
    const response = await api.get(`/api/platform/permission/get/all?skip=${skip}&take=${take}`)
    return await response.data
}

export const getPermissionListWithoutpagination = async () => {
    const response = await api.get(`/api/platform/permission/get/all`)
    return await response.data
}

export const getPermissionById = async (permissionId: number) => {
    const response = await api.get(`/api/platform/permission/get/${permissionId}`)
    return await response.data
}

export const editPermission = async (payload: {}, permissionId: number) => {
    const response = await api.put(`/api/platform/permission/${permissionId}/update`, payload)
    return await response.data;
}

export const deactivatePermission = async (permissionId: number) => {
    const response = await api.patch(`/api/platform/permission/${permissionId}/deactivate`)
    return await response.data
}

export const activatePermission = async (permissionId: number) => {
    const response = await api.patch(`/api/platform/permission/${permissionId}/activate`)
    return await response.data
}


//Assign Permission to roles
export const assignPermission = async(payload : {})=>{
    const response = await api.post(`/api/tenant/role/permission/assign`, payload)
    return await response.data
}

export const getAssignedPermissionList = async (skip: number, take: number) => {
    const response = await api.get(`/api/tenant/role/permission/get/all?skip=${skip}&take=${take}`)
    return await response.data
}

export const getAssignedPermissionById = async (rolePermissionId: number) => {
    const response = await api.get(`/api/tenant/role/permission/get/${rolePermissionId}`)
    return await response.data
}

export const updateAssignedPermission = async (payload: {}, rolePermissionId: number) => {
    const response = await api.put(`/api/tenant/role/permission/${rolePermissionId}/update`, payload)
    return await response.data
}


//Employee management
export const createEmployee = async (payload: {}) => {
    const response = await api.post(`/api/tenant/employee/new/create`, payload)
    return await response.data;
}

export const getEmployeeList = async (skip: number, take: number) => {
    const response = await api.get(`/api/tenant/employee/get/all?skip=${skip}&take=${take}`)
    return await response.data;
}

export const getEmployeeById = async (employeeId: number) => {
    const response = await api.get(`/api/tenant/employee/get/${employeeId}`)
    return await response.data;
}

export const editEmployee = async (payload: {}, employeeId: number) => {
    const response = await api.put(`/api/tenant/employee/${employeeId}/update`, payload)
    return await response.data;
}

export const deactivateEmployee = async (employeeId: number) => {
    const response = await api.patch(`/api/tenant/employee/${employeeId}/deactivate`)
    return await response.data
}

export const activateEmployee = async (employeeId: number) => {
    const response = await api.patch(`/api/tenant/employee/${employeeId}/activate`)
    return await response.data
}


//Service Category management
export const createServiceCategory = async (payload: {}) => {
    const response = await api.post(`/api/tenant/service/category/create`, payload)
    return await response.data;
}

export const getServiceCategoryList = async () => {
    const response = await api.get(`/api/tenant/service/category/get/all`)
    return await response.data;
}


//Service Type management
export const createServiceType = async (payload: {}) => {
    const response = await api.post(`/api/tenant/service/type/create`, payload)
    return await response.data;
}

export const getServiceTypeList = async (skip: number, take: number) => {
    const response = await api.get(`/api/tenant/service/type/get/all?skip=${skip}&take=${take}`)
    return await response.data;
}


//Repair Order management
export const createRepairOrder = async (payload: {}) => {
    const response = await api.post(`/api/tenant/repairorder/create`, payload)
    return await response.data;
}

export const getRepairOrderList = async () => {
    const response = await api.get(`/api/tenant/repairorder/get/all`)
    return await response.data;
}


//Labour management
export const createLabour = async (payload: {}) => {
    const response = await api.post(`/api/tenant/labour/create`, payload)
    return await response.data;
}

export const getLabourList = async (skip: number, take: number) => {
    const response = await api.get(`/api/tenant/labour/get/all?skip=${skip}&take=${take}`)
    return await response.data;
}

export const getLabourById = async (labourId: number) => {
    const response = await api.get(`/api/tenant/labour/get/${labourId}`)
    return await response.data;
}

export const editLabour = async (payload: {}, labourId: number) => {
    const response = await api.put(`/api/tenant/labour/${labourId}/update`, payload)
    return await response.data;
}

export const deactivateLabour = async (labourId: number) => {
    const response = await api.patch(`/api/tenant/labour/${labourId}/deactivate`)
    return await response.data
}

export const activateLabour = async (labourId: number) => {
    const response = await api.patch(`/api/tenant/labour/${labourId}/activate`)
    return await response.data
}


//HSN Master management
export const createHSN = async (payload: Record<string, unknown>) => {
    const response = await api.post(`/api/tenant/hsn/create`, payload)
    return await response.data;
}

export const getHSNList = async () => {
    const response = await api.get(`/api/tenant/hsn/get/all`)
    return await response.data;
}

export const getHSNById = async (hsnId: number) => {
    const response = await api.get(`/api/tenant/hsn/get/${hsnId}`)
    return await response.data;
}

export const editHSN = async (payload: Record<string, unknown>, hsnId: number) => {
    const response = await api.put(`/api/tenant/hsn/${hsnId}/update`, payload)
    return await response.data;
}

export const deactivateHSN = async (hsnId: number) => {
    const response = await api.patch(`/api/tenant/hsn/${hsnId}/deactivate`)
    return await response.data;
}

export const activateHSN = async (hsnId: number) => {
    const response = await api.patch(`/api/tenant/hsn/${hsnId}/activate`)
    return await response.data;
}


//Part Category management
export const createPartCategory = async (payload: {}) => {
    const response = await api.post(`/api/tenant/part/category/create`, payload)
    return await response.data;
}

export const getPartCategoryList = async () => {
    const response = await api.get(`/api/tenant/part/category/get/all`)
    return await response.data;
}

export const getPartCategoryById = async (categoryId: number) => {
    const response = await api.get(`/api/tenant/part/category/get/${categoryId}`)
    return await response.data;
}

export const editPartCategory = async (payload: {}, categoryId: number) => {
    const response = await api.put(`/api/tenant/part/category/${categoryId}/update`, payload)
    return await response.data;
}

export const deactivatePartCategory = async (categoryId: number) => {
    const response = await api.patch(`/api/tenant/part/category/${categoryId}/deactivate`)
    return await response.data
}

export const activatePartCategory = async (categoryId: number) => {
    const response = await api.patch(`/api/tenant/part/category/${categoryId}/activate`)
    return await response.data
}


//Part Master management
export const createPartMaster = async (payload: {}) => {
    const response = await api.post(`/api/tenant/part/create`, payload)
    return await response.data;
}

export const getPartMasterList = async () => {
    const response = await api.get(`/api/tenant/part/get/all`)
    return await response.data;
}

export const getPartMasterById = async (partId: number) => {
    const response = await api.get(`/api/tenant/part/get/${partId}`)
    return await response.data;
}

export const editPartMaster = async (payload: {}, partId: number) => {
    const response = await api.put(`/api/tenant/part/${partId}/update`, payload)
    return await response.data;
}

export const deactivatePartMaster = async (partId: number) => {
    const response = await api.patch(`/api/tenant/part/${partId}/deactivate`)
    return await response.data
}

export const activatePartMaster = async (partId: number) => {
    const response = await api.patch(`/api/tenant/part/${partId}/activate`)
    return await response.data
}


//Part Fitment management
export const createPartFitment = async (payload: Record<string, unknown>) => {
    const response = await api.post(`/api/tenant/part/fitment/create`, payload)
    return await response.data;
}

export const getPartFitmentList = async () => {
    const response = await api.get(`/api/tenant/part/fitment/get/all`)
    return await response.data;
}

export const getPartFitmentById = async (fitmentId: number) => {
    const response = await api.get(`/api/tenant/part/fitment/get/${fitmentId}`)
    return await response.data;
}

export const editPartFitment = async (payload: Record<string, unknown>, fitmentId: number) => {
    const response = await api.put(`/api/tenant/part/fitment/${fitmentId}/update`, payload)
    return await response.data;
}


//Customer management
export const createCustomer = async (payload: {}) => {
    const response = await api.post(`/api/tenant/customer/create`, payload)
    return await response.data;
}

export const getCustomerList = async (skip: number, take: number) => {
    const response = await api.get(`/api/tenant/customer/get/all?skip=${skip}&take=${take}`)
    return await response.data;
}

export const getCustomerById = async (custId: number) => {
    const response = await api.get(`/api/tenant/customer/get/${custId}`)
    return await response.data;
}

export const editCustomer = async (payload: {}, custId: number) => {
    const response = await api.put(`/api/tenant/customer/${custId}/update`, payload)
    return await response.data;
}

export const deactivateCustomer = async (custId: number) => {
    const response = await api.patch(`/api/tenant/customer/${custId}/deactivate`)
    return await response.data
}

export const activateCustomer = async (custId: number) => {
    const response = await api.patch(`/api/tenant/customer/${custId}/activate`)
    return await response.data
}
//Vehicle management
export const createVehicle = async (payload: {}) => {
    const response = await api.post(`/api/tenant/vehicle/create`, payload)
    return await response.data;
}

export const getVehicleList = async (skip: number, take: number) => {
    const response = await api.get(`/api/tenant/vehicle/get/all?skip=${skip}&take=${take}`)
    return await response.data;
}

export const getVehicleById = async (vehicleId: number) => {
    const response = await api.get(`/api/tenant/vehicle/get/${vehicleId}`)
    return await response.data;
}

export const editVehicle = async (payload: {}, vehicleId: number) => {
    const response = await api.put(`/api/tenant/vehicle/${vehicleId}/update`, payload)
    return await response.data;
}

export const deactivateVehicle = async (vehicleId: number) => {
    const response = await api.patch(`/api/tenant/vehicle/${vehicleId}/deactivate`)
    return await response.data
}

export const activateVehicle = async (vehicleId: number) => {
    const response = await api.patch(`/api/tenant/vehicle/${vehicleId}/activate`)
    return await response.data
}

//Job Card management
export const createJobCard = async (payload: {}) => {
    const response = await api.post(`/api/tenant/jobcard/create`, payload)
    return await response.data;
}

export const getJobCardList = async (skip: number, take: number) => {
    const response = await api.get(`/api/tenant/jobcard/get/all?skip=${skip}&take=${take}`)
    return await response.data;
}

export const getJobCardListWithoutPagination = async () => {
    const response = await api.get(`/api/tenant/jobcard/get/all`)
    return await response.data;
}

export const getJobCardById = async (jobCardId: number) => {
    const response = await api.get(`/api/tenant/jobcard/get/${jobCardId}`)
    return await response.data;
}

export const updateJobCard = async (payload: {}, jobCardId: number) => {
    const response = await api.put(`/api/tenant/jobcard/${jobCardId}/update`, payload)
    return await response.data;
}

//Job Card Allocation
export const allocateJobCard = async (payload: Record<string, unknown>) => {
    const response = await api.post(`/api/tenant/jobcard/allocate`, payload)
    return await response.data;
}

export const getJobCardAllocationList = async () => {
    const response = await api.get(`/api/tenant/jobcard/allocate/get/all`)
    return await response.data;
}

export const getJobCardAllocationById = async (allocatedId: number) => {
    const response = await api.get(`/api/tenant/jobcard/allocate/get/${allocatedId}`)
    return await response.data;
}

export const updateJobCardAllocation = async (payload: Record<string, unknown>, allocatedId: number) => {
    const response = await api.put(`/api/tenant/jobcard/allocate/${allocatedId}/update`, payload)
    return await response.data;
}


//Vehicle Brand Routes
export const createBrand = async (payload: object) => {
    const response = await api.post(`/api/platform/brand/create`, payload)
    return await response.data;
}

export const getBrandList = async (skip: number, take: number) => {
    const response = await api.get(`/api/platform/brand/get/all?skip=${skip}&take=${take}`)
    return await response.data;
}

export const getBrandListWithoutPagination = async () => {
    const response = await api.get(`/api/platform/brand/get/all`)
    return await response.data;
}

export const getBrandById = async (brandId: number) => {
    const response = await api.get(`/api/platform/brand/get/${brandId}`)
    return await response.data;
}

export const editBrand = async (payload: object, brandId: number) => {
    const response = await api.put(`/api/platform/brand/${brandId}/update`, payload)
    return await response.data;
}

export const deactivateBrand = async (brandId: number) => {
    const response = await api.patch(`/api/platform/brand/${brandId}/deactivate`)
    return await response.data;
}

export const activateBrand = async (brandId: number) => {
    const response = await api.patch(`/api/platform/brand/${brandId}/activate`)
    return await response.data;
}

//Vehicle Model Routes
export const createModel = async (payload: object) => {
    const response = await api.post(`/api/platform/vehicle/model/create`, payload)
    return await response.data;
}

export const getModelList = async (skip: number, take: number) => {
    const response = await api.get(`/api/platform/vehicle/model/get/all?skip=${skip}&take=${take}`)
    return await response.data;
}

export const getModelListWithoutPagination = async () => {
    const response = await api.get(`/api/platform/vehicle/model/get/all`)
    return await response.data;
}

export const getModelById = async (modelId: number) => {
    const response = await api.get(`/api/platform/vehicle/model/get/${modelId}`)
    return await response.data;
}

export const editModel = async (payload: object, modelId: number) => {
    const response = await api.put(`/api/platform/vehicle/model/${modelId}/update`, payload)
    return await response.data;
}

export const deactivateModel = async (modelId: number) => {
    const response = await api.patch(`/api/platform/vehicle/model/${modelId}/deactivate`)
    return await response.data;
}

export const activateModel = async (modelId: number) => {
    const response = await api.patch(`/api/platform/vehicle/model/${modelId}/activate`)
    return await response.data;
}


//Vehicle Variant Routes
export const createVariant = async (payload: object) => {
    const response = await api.post(`/api/platform/vehicle/variant/create`, payload)
    return await response.data;
}

export const getVariantList = async (skip: number, take: number) => {
    const response = await api.get(`/api/platform/vehicle/variant/get/all?skip=${skip}&take=${take}`)
    return await response.data;
}

export const getVariantListWithoutPagination = async () => {
    const response = await api.get(`/api/platform/vehicle/variant/get/all`)
    return await response.data;
}

export const getVariantById = async (variantId: number) => {
    const response = await api.get(`/api/platform/vehicle/variant/get/${variantId}`)
    return await response.data;
}

export const editVariant = async (payload: object, variantId: number) => {
    const response = await api.put(`/api/platform/vehicle/variant/${variantId}/update`, payload)
    return await response.data;
}

export const deactivateVariant = async (variantId: number) => {
    const response = await api.patch(`/api/platform/vehicle/variant/${variantId}/deactivate`)
    return await response.data;
}

export const activateVariant = async (variantId: number) => {
    const response = await api.patch(`/api/platform/vehicle/variant/${variantId}/activate`)
    return await response.data;
}
