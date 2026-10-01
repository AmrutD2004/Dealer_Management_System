export { cn } from "cn"

/* Narrows a raw form value to a known union with a safe fallback. */
export const asChoice = <T extends string>(value: string, fallback: T): T =>
  (value as T) ?? fallback
