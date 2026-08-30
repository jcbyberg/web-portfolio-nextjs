"use client";

import { useEffect, useImperativeHandle, useRef, forwardRef } from "react";

const SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

// One <script> for the whole page, however many widgets render. A second copy
// re-initialises the library and can orphan an already-rendered widget.
let scriptPromise = null;

function loadTurnstile() {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src^="${SCRIPT_SRC}"]`);
    const script = existing ?? document.createElement("script");
    script.addEventListener("load", () => resolve(window.turnstile));
    script.addEventListener("error", () =>
      reject(new Error("Turnstile script failed to load"))
    );
    if (!existing) {
      script.src = SCRIPT_SRC;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
  });

  return scriptPromise;
}

/**
 * Cloudflare Turnstile, rendered explicitly.
 *
 * Explicit rather than the automatic `class="cf-turnstile"` scan because a
 * token is SINGLE-USE: after any submit attempt the old token is spent, and
 * resetting requires the widget id that only explicit rendering hands back.
 * The automatic mode gives no id, so a second attempt on a page that stays
 * open fails verification for a reason the visitor cannot see.
 *
 * `theme` defaults to auto; pass "dark" on a dark ground.
 */
const TurnstileWidget = forwardRef(function TurnstileWidget(
  { siteKey, action, onVerify, onExpire, theme = "auto" },
  ref
) {
  const containerRef = useRef(null);
  const widgetIdRef = useRef(null);
  // Held in refs so a changed callback identity never triggers a re-render of
  // the widget, which would mint a fresh token and discard the current one.
  const onVerifyRef = useRef(onVerify);
  const onExpireRef = useRef(onExpire);
  onVerifyRef.current = onVerify;
  onExpireRef.current = onExpire;

  useImperativeHandle(ref, () => ({
    reset() {
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
  }));

  useEffect(() => {
    if (!siteKey) return undefined;
    let cancelled = false;

    loadTurnstile()
      .then((turnstile) => {
        // Strict Mode runs effects twice in development; without both guards
        // that renders two widgets into the same container.
        if (cancelled || !turnstile || !containerRef.current) return;
        if (widgetIdRef.current !== null) return;

        widgetIdRef.current = turnstile.render(containerRef.current, {
          sitekey: siteKey,
          action,
          theme,
          callback: (token) => onVerifyRef.current?.(token),
          "expired-callback": () => onExpireRef.current?.(),
          "error-callback": () => onExpireRef.current?.(),
        });
      })
      .catch(() => {
        // Swallowed deliberately. A failed script load leaves no token, and the
        // form already refuses to submit without one — the visitor sees the
        // form's own message rather than a console trace.
      });

    return () => {
      cancelled = true;
      if (window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, action, theme]);

  return <div ref={containerRef} />;
});

export default TurnstileWidget;
