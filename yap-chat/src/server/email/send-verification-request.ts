import { Resend } from "resend";
import type { EmailConfig } from "next-auth/providers/email";

import { env } from "~/env.mjs";

export async function sendVerificationRequest({
  identifier,
  url,
  provider,
}: {
  identifier: string;
  url: string;
  provider: EmailConfig;
}) {
  const resend = new Resend(env.RESEND_API_KEY);

  const from =
    typeof provider.from === "string" ? provider.from : env.EMAIL_FROM;

  const { error } = await resend.emails.send({
    from,
    to: identifier,
    subject: "Sign in to Yap",
    html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Sign in to Yap</h2>
        <p>Click the button below to sign in. This link expires in 24 hours.</p>
        <a href="${url}" style="display: inline-block; background: #3b82f6; color: white; padding: 12px 24px; border-radius: 9999px; text-decoration: none; margin: 16px 0;">
          Sign in
        </a>
        <p style="color: #666; font-size: 14px;">If you didn't request this email, you can safely ignore it.</p>
      </div>
    `,
    text: `Sign in to Yap\n\n${url}\n\nIf you didn't request this email, you can safely ignore it.`,
  });

  if (error) {
    throw new Error(`Failed to send verification email: ${error.message}`);
  }
}
