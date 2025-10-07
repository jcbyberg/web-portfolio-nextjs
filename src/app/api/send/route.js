import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;
const bccEmail = "jcbyberg@gmail.com";
const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

export async function POST(req) {
  try {
    const { email, subject, message, captchaToken } = await req.json();

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

    const data = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject,
      bcc: bccEmail,
      react: (
        <>
          <h1>Thank you for contacting us!</h1>
          <p>{subject}</p>
          <p>{message}</p>
          <p>
            Thank you for reaching out. I appreciate the opportunity to help and
            will follow up shortly with a response and any questions.
          </p>
          <p>Josh Byberg</p>
          <p>[info@joshbyberg.com] - [joshbyberg.com]</p>
        </>
      ),
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("Email send failed:", error);
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 });
  }
}

