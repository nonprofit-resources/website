import { verifyGithubSignature } from "~/lib/webhooks";

/**
 * Inbound GitHub webhook for oss-fund/directory (or any ping that should refresh the import).
 * OSS.Fund does not ship an API; if they add this URL on their GitHub repo, we trigger a sync Action.
 */
export async function POST(event: { request: Request }) {
  const secret = process.env.OSS_FUND_GITHUB_WEBHOOK_SECRET;
  const raw = await event.request.text();
  const ghEvent = event.request.headers.get("x-github-event") ?? "";
  if (secret) {
    const sig = event.request.headers.get("x-hub-signature-256");
    if (!verifyGithubSignature(secret, raw, sig)) {
      return Response.json({ error: "Bad signature" }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Inbound GitHub webhook secret is not configured" }, { status: 503 });
  }

  if (ghEvent === "ping") {
    return Response.json({ ok: true, pong: true });
  }

  const token = process.env.GITHUB_DISPATCH_TOKEN;
  if (!token) {
    return Response.json({
      ok: true,
      dispatched: false,
      hint: "Set GITHUB_DISPATCH_TOKEN so this ping can start catalog:sync-oss-fund on GitHub Actions.",
    });
  }

  const repo = process.env.GITHUB_DISPATCH_REPO ?? "nonprofit-resources/website";
  const res = await fetch(`https://api.github.com/repos/${repo}/dispatches`, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "nonprofit-resources-webhooks/0.1",
    },
    body: JSON.stringify({
      event_type: "oss-fund-sync",
      client_payload: { githubEvent: ghEvent },
    }),
  });
  if (!res.ok && res.status !== 204) {
    return Response.json(
      { error: `GitHub dispatch failed: HTTP ${res.status}` },
      { status: 502 },
    );
  }
  return Response.json({ ok: true, dispatched: true });
}
