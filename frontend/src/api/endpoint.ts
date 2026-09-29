import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export interface PlatformUserPayload {
  email: string;
  password: string;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
}

export const createPlatformUser = async (payload: PlatformUserPayload) => {
  const response = await api.post<ApiResponse>(
    "/api/platformuser/create",
    payload,
  );

  return response.data;
};
