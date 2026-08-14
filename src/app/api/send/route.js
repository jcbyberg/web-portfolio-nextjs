import { NextResponse } from "next/server";
import { Resend } from "resend";

// Where enquiries are delivered. Kept separate from FROM_EMAIL so the
// notification lands in the monitored Hostinger inbox regardless of which
// verified sender Resend is configured to send from.
const inboxEmail = process.env.CONTACT_INBOX_EMAIL || "info@joshbyberg.com";
const bccEmail = "jcbyberg@gmail.com";

const MAX_EMAIL = 254;
const MAX_SUBJECT = 200;
const MAX_MESSAGE = 5000;

// Local part: dot-separated atoms, so a leading/trailing/doubled dot fails.
// Domain: dot-separated labels that must start and end alphanumeric, so a
// leading or trailing hyphen fails. Stricter than "contains an @".
const EMAIL_RE =
  /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;

/**
 * Validate the untrusted form payload before anything is sent.
 *
 * Returns { error } or { values } — and the caller MUST use the returned
 * values, not the originals. Validating a trimmed copy while sending the raw
 * input would let unbounded leading/trailing whitespace slip past every length
 * limit and reach the provider.
 *
 * CR/LF is rejected on header-bound values so nothing can smuggle a header.
 */
function validate(body) {
  if (!body || typeof body !== "object") {
    return { error: "Email, subject, and message are required." };
  }
  const { email, subject, message } = body;
  if (
    typeof email !== "string" ||
    typeof subject !== "string" ||
    typeof message !== "string"
  ) {
    return { error: "Email, subject, and message are required." };
  }
  const e = email.trim();
  const s = subject.trim();
  const m = message.trim();
  if (!e || !s || !m) {
    return { error: "Email, subject, and message are required." };
  }
  if (e.length > MAX_EMAIL || !EMAIL_RE.test(e)) {
    return { error: "Enter a valid email address." };
  }
  // RFC 5321 size limits the regex cannot express: local part <= 64 octets,
  // each domain label <= 63. Without these, a 200-character local part or
  // label passes the pattern and is rejected downstream by the provider.
  const [localPart, domainPart] = e.split("@");
  if (localPart.length > 64) {
    return { error: "Enter a valid email address." };
  }
  if (domainPart.split(".").some((label) => label.length > 63)) {
    return { error: "Enter a valid email address." };
  }
  if (s.length > MAX_SUBJECT) {
    return { error: `Subject must be ${MAX_SUBJECT} characters or fewer.` };
  }
  if (m.length > MAX_MESSAGE) {
    return { error: `Message must be ${MAX_MESSAGE} characters or fewer.` };
  }
  // Redundant given the regex, but keeps the guarantee explicit if it changes.
  if (/[\r\n]/.test(e) || /[\r\n]/.test(s)) {
    return { error: "Invalid characters in email or subject." };
  }
  return { values: { email: e, subject: s, message: m } };
}

/**
 * Resend 1.0.0 does NOT throw on a non-2xx response — fetchRequest() parses the
 * error body and returns it. A successful send resolves to an object with `id`,
 * so that is the only reliable success signal in this version.
 */
function sendFailed(result) {
  return !result || typeof result.id !== "string" || result.id.length === 0;
}

export async function POST(req) {
  try {
    // Constructed per-request, not at module scope: a missing key must fail
    // this one request, not the whole production build.
    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.FROM_EMAIL;
    const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

    if (!apiKey || !fromEmail) {
      return NextResponse.json(
        { error: "Email service is not configured." },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    // A malformed body is a client error, not an email-send failure — parse it
    // separately so it cannot fall through to the outer catch as a 500.
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const { error: invalid, values } = validate(body);
    if (invalid) {
      return NextResponse.json({ error: invalid }, { status: 400 });
    }
    // Use the normalised values from here on, never the raw body.
    const { email, subject, message } = values;
    const captchaToken = body.captchaToken;

    if (!recaptchaSecretKey) {
      return NextResponse.json(
        { error: "reCAPTCHA secret key is not configured." },
        { status: 500 }
      );
    }

    if (!captchaToken) {
      return NextResponse.json(
        { error: "Captcha token is missing." },
        { status: 400 }
      );
    }

    const captchaResponse = await fetch(
      "https://www.google.com/recaptcha/api/siteverify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `secret=${encodeURIComponent(
          recaptchaSecretKey
        )}&response=${encodeURIComponent(captchaToken)}`,
      }
    );

    const captchaResult = await captchaResponse.json();

    if (!captchaResult.success) {
      return NextResponse.json(
        { error: "Captcha validation failed." },
        { status: 400 }
      );
    }

    // 1. The enquiry itself, delivered to the monitored inbox. This is the
    //    REQUIRED operation — if it fails, the submission failed.
    //    Note: reply_to (snake_case) is the field name in resend 1.0.0;
    //    the SDK serializes the payload unchanged, so camelCase is dropped.
    const notification = await resend.emails.send({
      from: fromEmail,
      to: inboxEmail,
      bcc: bccEmail,
      reply_to: email,
      subject: `Website enquiry: ${subject}`,
      react: (
        <>
          <h1>New enquiry from joshbyberg.com</h1>
          <p>
            <strong>From:</strong> {email}
          </p>
          <p>
            <strong>Subject:</strong> {subject}
          </p>
          <p>{message}</p>
        </>
      ),
    });

    if (sendFailed(notification)) {
      console.error("Enquiry notification failed:", notification);
      return NextResponse.json(
        { error: "Failed to send email." },
        { status: 502 }
      );
    }

    // 2. Acknowledgement to the submitter. Best-effort only: the enquiry is
    //    already delivered, so a failure here must not tell the sender their
    //    message was lost, and must not invite a retry that duplicates (1).
    try {
      const ack = await resend.emails.send({
        from: fromEmail,
        to: email,
        reply_to: inboxEmail,
        subject: "Thanks for getting in touch",
        react: (
          <>
            <h1>Thank you for contacting us!</h1>
            <p>{subject}</p>
            <p>{message}</p>
            <p>
              Thank you for reaching out. I appreciate the opportunity to help
              and will follow up shortly with a response and any questions.
            </p>
            <p>Josh Byberg</p>
            <p>[info@joshbyberg.com] - [joshbyberg.com]</p>
          </>
        ),
      });
      if (sendFailed(ack)) {
        console.error("Acknowledgement failed (enquiry was delivered):", ack);
      }
    } catch (ackError) {
      console.error("Acknowledgement threw (enquiry was delivered):", ackError);
    }

    return NextResponse.json({ id: notification.id });
  } catch (error) {
    console.error("Email send failed:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}

