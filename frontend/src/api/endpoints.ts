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


//Employee Designation
export const createDesignation = async (payload: {}) => {
    const response = await api.post(`/api/tenant/designation/create`, payload)
    return await response.data;
}

export const getDesignationList = async (skip: number, take: number) => {
    const response = await api.get(`/api/tenant/designation/get/all?skip=${skip}&take=${take}`)
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