export { cn } from "cn"

export interface ApiErrorBody {
  success?: boolean
  message?: string
  [key: string]: unknown
}

export interface NormalizedApiError {
  response?: {
    status?: number
    data?: ApiErrorBody
  }
  message?: string
  code?: string
}

export const getErrorResponse = (error: unknown): ApiErrorBody | undefined => {
  const err = error as NormalizedApiError
  return err?.response?.data
}

export const getErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (typeof error === "string") return error
  if (error instanceof Error && error.message) return error.message
  const err = error as NormalizedApiError
  return err?.response?.data?.message ?? err?.message ?? fallback
}
