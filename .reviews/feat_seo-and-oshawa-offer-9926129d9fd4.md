# Review (round 4): feat/seo-and-oshawa-offer @ 9926129d9fd4

Reviewer: codex (gpt-5.x) — independent cross-family review
Date: 2026-08-14
Scope: src/app/api/send/route.js

## Verdict

APPROVE

## Previous findings

1. reply_to — FIXED. Both sends use `reply_to` at lines 161 and 192. Resend 1.0.0's shipped `CreateEmailOptions` declares `reply_to?: string | string[]`; `Emails.create()` passes the payload to `post()`, which JSON-serializes it without camelCase translation.
2. error detection — FIXED. `sendFailed()` rejects nullish results and any result without a non-empty string `id`; the required notification returns 502 before the acknowledgement when that check fails. In the installed 1.0.0 SDK, `fetchRequest()` returns parsed non-2xx JSON rather than throwing, while the shipped `CreateEmailResponse`, `Emails.send()` declaration, and SDK send test define a successful send as `{ id: string }`. The SDK error contracts/tests do not include an `id`, so a conforming error cannot pass this check and a conforming success cannot lack it.
3. partial success — FIXED. The required notification is checked before the acknowledgement. The acknowledgement has its own try/catch, and a returned error object or thrown exception is logged but remains non-fatal, so the already-delivered enquiry still receives a success response instead of inviting a duplicate retry. `notification` is declared in the outer handler scope, and `sendFailed(notification)` proves it is non-null with a non-empty string ID before the nested acknowledgement block and final response.
4. input validation — FIXED. `req.json()` has a dedicated malformed-JSON catch returning 400; `validate()` rejects null/non-object bodies, checks all three fields are strings and non-empty, trims them, enforces email/subject/message limits, rejects malformed email/header characters, and returns normalized values that are used in both sends. The email check now enforces the 254-character mailbox cap, 64-character ASCII local-part cap, and 63-character ASCII domain-label cap. An independent Node probe passed 64/65-character local parts, 63/64-character labels, plus-addressing, subdomains, long TLDs, leading/trailing/doubled local dots, leading/trailing label hyphens, and CR/LF. Because the regex permits only ASCII, JavaScript character counts equal octet counts for these RFC 5321 boundaries.

## New findings

None.

## Checks performed

- Read the previous review, supplied staged4 diff, complete current route with line numbers, and independently inspected the staged route diff.
- Confirmed the installed and locked package is Resend 1.0.0 and read its shipped email option/response/error declarations, `Emails` implementation, HTTP implementation, and SDK tests.
- Traced validation before reCAPTCHA and both sends. Invalid email/subject/message input returns before any captcha or send call. No path discloses whether the submitted address exists: acknowledgement failure is non-fatal and produces the same success response after required delivery.
- Confirmed the required-send 502 body and outer 500 body are generic and do not expose provider internals. Provider objects are logged server-side only.
- Validation uses guarded string operations and short-circuit checks; malformed JSON and ordinary JSON values cannot make validation itself throw into a confusing 500.
- Ran an independent Node boundary/malformed-address probe; all expected cases passed.
- Ran `npm run lint`: passed with `No ESLint warnings or errors`.
- Ran `npm run build`: passed; the route compiled and the production build completed. The command emitted only Browserslist staleness and Tailwind renamed-color warnings.
- Did not call the live Resend API, send real email, or submit a live reCAPTCHA challenge; delivery behavior was not end-to-end tested.

