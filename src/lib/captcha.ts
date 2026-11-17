const HCAPTCHA_VERIFY_URL = "https://hcaptcha.com/siteverify";

/** Verifies an hCaptcha token server-side before a public form is
 * processed. Until HCAPTCHA_SECRET_KEY is configured, this skips
 * verification entirely (logging a warning) rather than blocking every
 * submission — the form keeps working exactly as before deployment, and
 * real spam protection switches on the moment the key is set, no code
 * change needed. */
export async function verifyCaptcha(token: string): Promise<boolean> {
  const secret = process.env.HCAPTCHA_SECRET_KEY;
  if (!secret) {
    console.warn("[captcha] HCAPTCHA_SECRET_KEY is not set — skipping captcha verification.");
    return true;
  }

  if (!token) return false;

  try {
    const res = await fetch(HCAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error("[captcha] hCaptcha verification request failed", error);
    return false;
  }
}
