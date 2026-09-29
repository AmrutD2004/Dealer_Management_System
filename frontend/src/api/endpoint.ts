import axios from 'axios'

const BASE_URL = import.meta.env.VITE_BACKEND_URL
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