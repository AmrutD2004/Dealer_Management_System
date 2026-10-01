export { cn } from "cn"

/* Narrows a raw form value to a known union with a safe fallback. */
export const asChoice = <T extends string>(value: string, fallback: T): T =>
  (value as T) ?? fallback

/*
 * Pulls the server's message out of an axios rejection. A rejected
 * request is not an Error instance, so the shape is checked by hand.
 */
export const getApiErrorMessage = (
  err: unknown,
  fallback = "Something went wrong",
): string => {
  if (typeof err === "object" && err !== null && "response" in err) {
    const { response } = err as { response?: { data?: { message?: string } } }

    if (response?.data?.message) {
      return response.data.message
    }
  }

  if (err instanceof Error) {
    return err.message
  }

  return fallback
}
