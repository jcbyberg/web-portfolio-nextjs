import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL?.trim();

const sanitizeRecipients = (...recipients) =>
  recipients
    .filter((recipient) => typeof recipient === "string")
    .map((recipient) => recipient.trim())
    .filter(Boolean);

export async function POST(req) {
  const { email, subject, message } = await req.json();

  if (!fromEmail) {
    return NextResponse.json(
      { error: "FROM_EMAIL environment variable is not configured." },
      { status: 500 }
    );
  }

  const recipients = sanitizeRecipients(fromEmail, email);
  if (recipients.length === 0) {
    return NextResponse.json(
      { error: "A valid recipient email address is required." },
      { status: 400 }
    );
  }

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: recipients.length === 1 ? recipients[0] : recipients,
      subject,
      react: (
        <>
          <h1>{subject}</h1>
          <p>Thank you for contacting us!</p>
          <p>New message submitted:</p>
          <p>{message}</p>
        </>
      ),
    });

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error?.message || "Unable to send email." },
      { status: 500 }
    );
  }
}