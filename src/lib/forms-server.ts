import { z } from "zod";

/** Flattens a ZodError into one message per field, for compact client display. */
export function firstFieldErrors<T>(error: z.ZodError<T>): Record<string, string> {
  const { fieldErrors } = z.flattenError(error);
  const result: Record<string, string> = {};
  for (const [key, messages] of Object.entries(fieldErrors as Record<string, string[] | undefined>)) {
    if (messages && messages[0]) result[key] = messages[0];
  }
  return result;
}
