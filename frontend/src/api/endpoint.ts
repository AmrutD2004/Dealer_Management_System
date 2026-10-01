import axios from "axios";

import type { platformUserUpdateType } from "@/Types/platformUserType";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true
})
export const createPlatformUser = async (payload: {}) => {
    const response = await api.post('/api/platformuser/create', payload)
    return await response.data;
}

export const platformUserLogin = async (payload: {}) => {
    const response = await api.post(`/api/platformuser/login`, payload)
    return await response.data;
}


export const isAuth = async () => {
    const response = await api.get(`/api/platformuser/auth`)
    return await response.data;
}

export const tenantCreation = async (formData: {}) => {
    const response = await api.post(`/api/tenant/create`, formData)
    return await response.data;
}

export const getTenantList = async (skip : number, take : number) => {
    const response = await api.get(`/api/tenant/get?skip=${skip}&take=${take}`)
    return await response.data;

}

export const createNewPlatformUser = async(payload : {})=>{
    const response = await api.post(`/api/platform/newuser/create`, payload)
    return await response.data;
}

export const getPlatformUsersList = async(skip : number, take:number) => {
    const response = await api.get(`/api/platform/users/get/all?skip=${skip}&take=${take}`)
    return await response.data;
}

export const getPlatformUserById = async(id : number) => {
    const response = await api.get(`/api/platform/user/get/${id}`)
    return await response.data;
}

export const updatePlatformUser = async(id : number, payload : platformUserUpdateType) => {
    const response = await api.put(`/api/platform/user/update/${id}`, payload)
    return await response.data;
}

export const deletePlatformUser = async(id : number) => {
    const response = await api.delete(`/api/platform/user/delete/${id}`)
    return await response.data;
}