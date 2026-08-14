export type SubmitState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success"; message: string }
  | { status: "error"; message: string; fieldErrors?: Record<string, string> };

type ApiResponse = {
  message?: string;
  fieldErrors?: Record<string, string>;
  [key: string]: unknown;
};

export async function postForm<TPayload>(
  endpoint: string,
  payload: TPayload
): Promise<
  | { ok: true; message: string; data: ApiResponse }
  | { ok: false; message: string; fieldErrors?: Record<string, string> }
> {
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data: ApiResponse = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        ok: false,
        message: data.message || "Something went wrong. Please try again.",
        fieldErrors: data.fieldErrors,
      };
    }

    return { ok: true, message: data.message || "Thank you — your submission was received.", data };
  } catch {
    return { ok: false, message: "Network error. Please check your connection and try again." };
  }
}
