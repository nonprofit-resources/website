import { getAuth } from "./auth";

export async function getSessionUser(request: Request) {
  try {
    const auth = getAuth();
    const session = await auth.api.getSession({ headers: request.headers });
    return session?.user ?? null;
  } catch {
    return null;
  }
}

export function staffEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isStaffEmail(email: string | null | undefined) {
  if (!email) return false;
  return staffEmails().includes(email.toLowerCase());
}
