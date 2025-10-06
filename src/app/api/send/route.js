import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;
const bccEmail = "jcbyberg@gmail.com";

export async function POST(req, res) {
  const { email, subject, message } = await req.json();
  console.log(email, subject, message);
  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject: subject,
      bcc: bccEmail,
      react: (
        <>
          <h1>Thank you for contacting us!</h1>
          <p>{subject}</p>
          <p>{message}</p>
          <p>Thank you for reaching out. I appreciate the opportunity to help and will follow up shortly with a response and any questions.</p>
          <p>Josh Byberg</p>
          <p>[info@joshbyberg.com] · [joshbyberg.com]</p>
        </>
      ),
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error });
  }
}


