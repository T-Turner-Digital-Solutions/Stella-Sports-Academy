"use client";

import { forwardRef, useEffect, useId, useImperativeHandle, useRef } from "react";
import Script from "next/script";

declare global {
  interface Window {
    hcaptcha?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY || "10000000-ffff-ffff-ffff-000000000001";

export type CaptchaHandle = {
  /** Clears the completed/expired challenge and re-arms the widget for a
   * fresh token — call after a failed or rejected submission so the
   * visitor can retry without reloading the page. */
  reset: () => void;
};

/** hCaptcha widget — spam protection for public forms. Renders the real
 * widget once hCaptcha's script loads, calling onVerify with the token to
 * submit alongside the form (verified server-side before the form is
 * processed). An expired or failed challenge calls onVerify("") so the
 * caller can block resubmission without losing anything the visitor typed.
 * Falls back to hCaptcha's published test site key when
 * NEXT_PUBLIC_HCAPTCHA_SITE_KEY isn't set, which always passes — real
 * protection requires the real site key. */
export const Captcha = forwardRef<CaptchaHandle, { onVerify: (token: string) => void }>(function Captcha(
  { onVerify },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const reactId = useId();

  function renderWidget() {
    if (!containerRef.current || !window.hcaptcha || widgetId.current !== null) return;
    widgetId.current = window.hcaptcha.render(containerRef.current, {
      sitekey: SITE_KEY,
      callback: onVerify,
      "expired-callback": () => onVerify(""),
      "error-callback": () => onVerify(""),
    });
  }

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (window.hcaptcha && widgetId.current !== null) {
        window.hcaptcha.reset(widgetId.current);
      }
    },
  }));

  useEffect(() => {
    if (window.hcaptcha) renderWidget();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Script src="https://js.hcaptcha.com/1/api.js" strategy="afterInteractive" onReady={renderWidget} />
      <div ref={containerRef} id={`hcaptcha-${reactId}`} />
    </div>
  );
});
