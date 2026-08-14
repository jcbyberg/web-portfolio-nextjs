# Review (round 3): feat/seo-and-oshawa-offer @ 729c093058ef

Reviewer: codex (gpt-5.x) — independent cross-family review
Date: 2026-08-14
Scope: src/app/api/send/route.js

## Verdict

REQUEST CHANGES

## Previous findings

1. reply_to — FIXED. Both sends use `reply_to` at lines 151 and 182. The installed/resolved package is Resend 1.0.0; its shipped `CreateEmailOptions` declares `reply_to?: string | string[]`, and `Emails.create()` forwards the payload to `post()` unchanged except for rendering/deleting `react`.
2. error detection — FIXED. Resend 1.0.0's `fetchRequest()` returns parsed error JSON when `response.ok` is false. The required notification is now rejected unless the result has a non-empty string `id` (lines 69-70, 167-173), returning a generic 502. The shipped `CreateEmailResponse` contract is exactly `{ id: string }`; thus a conforming success cannot lack `id`, while the provider's error shape is not documented to contain one.
3. partial success — FIXED. The required notification is awaited and confirmed successful before the acknowledgement starts. The acknowledgement is isolated in its own try/catch, and both returned error objects and thrown exceptions are logged but remain non-fatal (lines 175-203), so an acknowledgement failure returns the notification's success ID rather than inviting a duplicate retry.
4. input validation — PARTIALLY FIXED. Malformed JSON now returns 400; null/non-object bodies and non-string/empty fields return 400; normalized values are used in both sends; email/subject CR/LF is removed at the edges by trimming or rejected internally; and overall lengths are bounded before sending. The tightened regex correctly accepts plus-addressing, subdomains, and long alphabetic TLDs, and rejects leading/trailing/doubled local dots plus leading/trailing domain-label hyphens. However, it still accepts invalid addresses with a local part over 64 octets or an individual DNS label over 63 octets, so malformed addresses can still reach Resend and fail there.

## New findings

1. MEDIUM — `src/app/api/send/route.js:18`: the revised email regex still does not enforce the structural length limits of an email address. It accepts a 65-character local part at `example.com` and a 64-character domain label before `.com`, despite the 64-octet SMTP local-part limit and 63-octet DNS-label limit. Both examples are below the route's 254-character total cap. A CAPTCHA-valid request can therefore pass local validation, be rejected by Resend, and receive a misleading provider-failure response instead of the intended 400. Add component/label length checks (or use a maintained validator) before reCAPTCHA.

No other regressions found. Specifically:

- `sendFailed()` matches Resend 1.0.0's declared success response; a legitimate conforming success has a string `id`. Non-2xx bodies are arbitrary provider JSON in this old SDK, but its error contract does not include `id`; no evidence was found of an error response carrying a success ID.
- Validation precedes the reCAPTCHA request and both email sends, so invalid email/subject/message fields burn neither. The acknowledgement result is deliberately response-invariant, so it does not expose whether the submitter address was accepted.
- `notification` is declared in the outer handler block, remains in scope after the nested acknowledgement try/catch, and cannot be null at the final response because the preceding `sendFailed(notification)` branch returns.
- The notification-failure response exposes only `{ error: "Failed to send email." }`; provider details are sent only to server logging.
- `req.json()` has its own 400 path. After parsing, `validate()` guards null/non-object bodies and field types before calling `trim()`; no validation exception path yielding a confusing 500 was found.
- Round-3 whitespace fix is effective: `validate()` returns trimmed values, and lines 104, 151-162, and 181-188 use them rather than raw body fields.

## Checks performed

- Read the prior review, supplied `staged3.diff`, the independently obtained staged diff, and the complete current route with numbered lines.
- Confirmed the installed Resend package version is 1.0.0 and inspected its shipped `CreateEmailOptions`/`CreateEmailResponse` declarations, `Emails.create()`, `Resend.fetchRequest()`, and `Resend.post()`.
- Executed the route's exact regex against representative cases. It accepted plus-addressing, subdomains, and a long TLD; rejected the newly targeted dot/hyphen cases; and incorrectly accepted 65-character local and 64-character domain-label cases.
- Ran `npm run lint`: passed with “No ESLint warnings or errors.”
- Ran `npm run build`: passed; the production build compiled successfully, checked validity, generated all static pages, and included `/api/send`. It emitted Browserslist database and Tailwind legacy color-name warnings.
- Did not call the live Resend API, send email, or submit a live reCAPTCHA challenge. Provider delivery and live CAPTCHA behavior were not end-to-end verified.
