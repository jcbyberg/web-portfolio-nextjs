# Review: feat/seo-and-oshawa-offer @ c620d5034cb6

Reviewer: codex (gpt-5.x) — independent cross-family review
Date: 2026-08-14
Scope: src/app/api/send/route.js

## Verdict

REQUEST CHANGES

## Findings

BLOCKER: None.

1. **HIGH — `src/app/api/send/route.js:71,91`: `replyTo` is not a valid field in the installed Resend SDK/API contract.** The lockfile and installed package resolve `resend` to exactly 1.0.0. Its shipped `CreateEmailOptions` declares `reply_to`, and `emails.send()` serializes the supplied payload unchanged; it does not translate camelCase. Both messages therefore send an unsupported `replyTo` key instead of `reply_to`. Concrete failure: the monitored inbox receives the enquiry without a Reply-To header (or the API rejects the payload), so clicking Reply does not address the submitter; the acknowledgement likewise cannot reply to the inbox. Change both properties to `reply_to` for this dependency version.

2. **HIGH — `src/app/api/send/route.js:67-108`: Resend 1.0.0 HTTP failures are treated as successful submissions.** In this SDK version, `fetchRequest()` parses and returns the error JSON for a non-2xx response instead of throwing. The route never checks either send result for an error and always returns HTTP 200 after both promises settle. Concrete failure: Resend rejects the owner notification because the recipient/header is invalid or the account is restricted, returns an error object, the acknowledgement call also returns normally, and the browser shows “Message sent” even though the monitored inbox received nothing. Validate both results and return a non-2xx response unless the required owner notification has a success ID; preferably upgrade to a supported SDK and handle its documented `{ data, error }` contract.

3. **MEDIUM — `src/app/api/send/route.js:67-111`: the two sequential sends have an unhandled partial-success state.** Both calls are correctly awaited, but if the owner notification succeeds and rendering, networking, or response parsing for the acknowledgement throws, the catch returns 500. The caller then displays “Please try again,” implying nothing was delivered. A retry can send a duplicate owner notification. This is a real defect, not merely cosmetic: define the owner notification as the required operation and make acknowledgement failure non-fatal (with internal reporting), or add idempotency/deduplication and return a response that accurately represents partial success.

4. **MEDIUM — `src/app/api/send/route.js:27,71-97`: untrusted form fields are used as address/header/content values without server-side validation or size limits.** `email`, `subject`, and `message` are accepted with no type, presence, format, newline, or length checks. React rendering escapes HTML content, so the JSX body is not a direct HTML-injection path, and the JSON API means this is not direct SMTP header construction; nevertheless, malformed/CRLF-bearing address or subject data is delegated to Resend and can cause rejection, while oversized strings can consume function/provider resources. Concrete failure: a CAPTCHA-passing request supplies a non-string object or an extremely large subject/message and produces a provider/render failure or avoidable cost. Reject malformed requests with 400 before calling Resend, including a real email validator, string checks, CR/LF rejection for header-bound values, and conservative maximum lengths.

LOW: None.

## Checks performed

- Read the supplied `staged.diff`, independently inspected `git diff --cached -- src/app/api/send/route.js`, and read the complete current route with numbered lines.
- Read `package.json`, `package-lock.json`, and the installed `node_modules/resend` package metadata. Confirmed the resolved version is exactly 1.0.0 despite the manifest range `^1.0.0`.
- Inspected Resend 1.0.0's shipped `create-email-options.interface.d.ts`, `emails.js`, and `resend.js`. These directly establish that the supported field is `reply_to`, payloads are serialized unchanged by `emails.send()`, and non-2xx API responses are returned rather than thrown. I attempted an online primary-source lookup as an additional cross-check, but the browsing tool returned no source content; I am not claiming that lookup succeeded.
- Traced the frontend caller in `src/app/components/EmailSection.jsx`; it treats any non-2xx response as “Something went wrong. Please try again” and any 200 response as “Message sent.”
- Verified both email calls have `await`.
- Verified reCAPTCHA token presence and Google's verification result are checked before line 67, so no email send occurs before successful CAPTCHA verification.
- Reviewed logging and responses for new secret/PII exposure. No API key or CAPTCHA secret is newly logged or returned. The existing catch logs the thrown error object; the new success response returns the notification result, and under Resend 1.0.0 that can be a provider error object because of Finding 2, but I did not find evidence that it contains submitted message content or credentials.
- Ran `npm run lint`: passed with “No ESLint warnings or errors.”
- Ran `npm run build`: passed, compiled the route, and generated the site. `RESEND_API_KEY`, `FROM_EMAIL`, and `RECAPTCHA_SECRET_KEY` were absent from the process environment, confirming this diff no longer fails that build for a missing Resend key. The build emitted only pre-existing Browserslist/Tailwind warnings.
- Did not call the live Resend API, send email, or submit a live reCAPTCHA challenge; delivery behavior was not end-to-end tested.
