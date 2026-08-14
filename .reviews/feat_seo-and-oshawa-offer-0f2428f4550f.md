# Review (round 2): feat/seo-and-oshawa-offer @ 0f2428f4550f

Reviewer: codex (gpt-5.x) — independent cross-family review
Date: 2026-08-14
Scope: src/app/api/send/route.js

## Verdict

REQUEST CHANGES

## Previous findings

1. `reply_to` — **FIXED.** Both sends now use `reply_to` (`route.js:114,145`). The installed Resend 1.0.0 declaration accepts `reply_to?: string | string[]`, and `Emails.create()` posts the payload unchanged after rendering, so these exact fields reach the API.
2. Error detection — **FIXED.** `sendFailed()` rejects nullish results, missing/empty IDs, and non-string IDs. Resend 1.0.0's shipped `CreateEmailResponse` requires `id: string`; its send test models success as `{ id: "1234" }`, while its non-2xx path returns parsed error JSON and the shipped error fixture is `{ name, message, statusCode }` without an ID. Thus a contract-conforming success cannot lack `id`, and a contract-conforming error cannot contain it. The required notification now returns 502 unless that success signal is present.
3. Partial success — **FIXED.** The required notification is checked before proceeding. The acknowledgement send, including React rendering and the awaited provider call, is inside its own `try/catch`; either a returned error object or a thrown exception is logged but leaves the already-delivered enquiry response as 200. This avoids prompting a duplicate notification retry.
4. Input validation — **PARTIALLY FIXED.** Type/presence checks, nominal limits, an email-pattern check, and CR/LF rejection were added before reCAPTCHA or either send. However, validation checks trimmed copies and sends the untrimmed originals. Arbitrarily large leading/trailing whitespace can therefore bypass all three length limits and is handed to rendering/the provider. The email regex also admits plainly invalid addresses such as `.user@example.com`, `user..name@example.com`, and `user@-example.com`. The original requirement to prevent malformed/oversized provider input is therefore not fully met.

## New findings

1. **LOW — `src/app/api/send/route.js:63`: malformed JSON and a JSON `null` body are reported as an internal email-send failure.** Invalid JSON rejects `req.json()`, and destructuring `null` throws before `validate()`; both fall into the outer catch and return HTTP 500 with `{"error":"Failed to send email."}`. These are malformed client requests and should return 400. The validation function itself does not throw for JSON-derived string/non-string field values, but the parsing/destructuring immediately before it leaves this confusing exception path.

No other regression found in the requested paths. The representative valid forms `user+tag@example.com`, `user@mail.sub.example.com`, and `user@example.technology` pass the regex. Validation of the three message fields occurs before the reCAPTCHA fetch and both sends, so those invalid fields cannot consume a CAPTCHA verification or email send (although `captchaToken` itself is only checked for truthiness). No address-existence check exists, so this ordering does not expose whether an address exists. `notification` is block-scoped in the outer `try`, checked as non-null with a non-empty string ID before the acknowledgement block, and remains valid at the final response. The notification-failure response exposes only the generic client message; provider details are confined to server logs.

## Checks performed

- Read the prior review, the supplied `staged2.diff`, the complete current route with numbered lines, and the actual cached diff for the route; the supplied and cached revisions agree.
- Confirmed `package-lock.json` and `node_modules/resend/package.json` resolve exactly Resend 1.0.0. Read its shipped `resend.js`, `emails.js`, `create-email-options.interface.d.ts`, and email tests to verify request-field forwarding, non-2xx behavior, and success/error response shapes.
- Ran a Node regex probe. Plus-addressing, subdomains, and a long TLD passed; the invalid leading-dot local part, doubled local/domain dots, and leading-hyphen domain also passed.
- Traced validation, reCAPTCHA, both send paths, the nested exception boundaries, variable scope, client response bodies, and server-only logging.
- `npm run lint`: **passed** with “No ESLint warnings or errors” (exit 0).
- `npm run build`: **passed** (exit 0); the route compiled and static generation completed. The build emitted only Browserslist staleness and Tailwind renamed-color warnings.
- Did not call the live Resend API, send email, submit a live reCAPTCHA challenge, or verify actual delivery. Provider behavior was verified against the installed 1.0.0 implementation/types/tests, not end to end.
