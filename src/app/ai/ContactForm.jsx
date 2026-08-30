"use client";

import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

// The AI section's own contact form.
//
// It posts to the same /api/send route as the shared EmailSection — that route
// does the validation, the captcha check and the delivery, and none of it is
// brand-specific. What is not shared is the markup and the styling, because
// this form sits on a black ground under .wsai-root and the shared component is
// built for the light brands.
//
// Why a form here at all: the landing page previously sent every visitor to
// whitespacedesign.ca/hire-me. That is a redirect off the domain, mid-intent,
// at the exact moment someone has decided to get in touch.
//
// CAPTCHA NOTE: reCAPTCHA site keys are registered per domain. This form only
// works once ai.whitespacedesign.ca is added to the key's domain list — the
// same restriction that silently broke the form on whitespacedesign.ca and
// racedad.ca. A Turnstile migration is planned, which removes the trap.
export default function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const recaptchaRef = useRef(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      setError("Please confirm you are not a robot.");
      return;
    }

    setSending(true);
    setError("");

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: e.target.email.value,
          subject: e.target.subject.value,
          message: e.target.message.value,
          captchaToken,
        }),
      });

      if (!response.ok) {
        // Surface the route's own message where it has one — "Enter a valid
        // email address" is more use to someone than "something went wrong".
        let message = "Something went wrong. Please try again.";
        try {
          const body = await response.json();
          if (body?.error) message = body.error;
        } catch {
          // Non-JSON error body; keep the generic message.
        }
        setError(message);
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      // The captcha token is single-use. Whether the send succeeded or failed,
      // the old token is spent, so it is cleared and the widget reset — without
      // this a second attempt fails verification for a reason the visitor
      // cannot see.
      setSending(false);
      setCaptchaToken(null);
      recaptchaRef.current?.reset();
    }
  };

  if (submitted) {
    return (
      <div className="wsai-form-done" role="status">
        <p>
          <strong>Sent.</strong> I read every message myself and usually reply
          within a day or two.
        </p>
      </div>
    );
  }

  return (
    <form className="wsai-form" onSubmit={handleSubmit} noValidate>
      <div className="wsai-field">
        <label htmlFor="wsai-email">Your email</label>
        <input
          id="wsai-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@yourbusiness.ca"
        />
      </div>

      <div className="wsai-field">
        <label htmlFor="wsai-subject">Subject</label>
        <input
          id="wsai-subject"
          name="subject"
          type="text"
          required
          placeholder="What should this be about?"
        />
      </div>

      <div className="wsai-field">
        <label htmlFor="wsai-message">What takes your team all week?</label>
        <textarea
          id="wsai-message"
          name="message"
          rows={5}
          required
          placeholder="The job nobody wants on a Friday afternoon..."
        />
      </div>

      {siteKey ? (
        <div className="wsai-captcha">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={siteKey}
            theme="dark"
            onChange={(value) => {
              setCaptchaToken(value);
              if (value) setError("");
            }}
          />
        </div>
      ) : null}

      {error ? (
        <p className="wsai-form-error" role="alert">
          {error}
        </p>
      ) : null}

      <button className="wsai-cta" type="submit" disabled={!siteKey || sending}>
        {sending ? "Sending..." : "Send it"}
      </button>

      {!siteKey ? (
        <p className="wsai-form-error" role="alert">
          The form is unavailable right now. Email{" "}
          <a href="mailto:info@joshbyberg.com">info@joshbyberg.com</a> instead.
        </p>
      ) : null}
    </form>
  );
}
