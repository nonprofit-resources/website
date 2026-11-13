import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { getDb } from "./db";
import { sendTransactionalEmail } from "./email";
import { account, session, user, verification } from "./schema";

function authSecret() {
  return (
    process.env.BETTER_AUTH_SECRET ??
    process.env.AUTH_SECRET ??
    "nonprofit-resources-local-dev-secret-replace"
  );
}

function socialProviders() {
  const providers: {
    github?: { clientId: string; clientSecret: string };
  } = {};
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.github = {
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    };
  }
  return providers;
}

let _auth: ReturnType<typeof betterAuth> | null = null;

export function getAuth() {
  if (_auth) return _auth;
  _auth = betterAuth({
    database: drizzleAdapter(getDb(), {
      provider: "sqlite",
      schema: { user, session, account, verification },
    }),
    secret: authSecret(),
    baseURL: process.env.BETTER_AUTH_URL ?? process.env.SITE_URL ?? "http://localhost:3000",
    emailAndPassword: {
      enabled: true,
      revokeSessionsOnPasswordReset: true,
      ...(process.env.RESEND_API_KEY
        ? {
            sendResetPassword: async ({ user, url }: { user: { email: string }; url: string }) => {
              const safe = url.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
              await sendTransactionalEmail({
                to: user.email,
                subject: "Reset your Nonprofit Resources password",
                html: `<p>Someone asked to reset the password for this account.</p><p><a href="${safe}">Choose a new password</a></p><p>If this wasn't you, ignore this email. The password stays the same until the link is opened.</p>`,
              });
            },
          }
        : {}),
    },
    socialProviders: socialProviders(),
  });
  if (!_auth) throw new Error("Better Auth failed to initialize");
  return _auth;
}

export const auth = {
  handler: (request: Request) => getAuth().handler(request),
};
