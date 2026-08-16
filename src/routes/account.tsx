import { Title } from "@solidjs/meta";
import { Navigate } from "@solidjs/router";
import { createSignal, onMount, Show } from "solid-js";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";
import { SITE_NAME } from "~/lib/utils";

export default function AccountPage() {
  const session = authClient.useSession();
  const [orgName, setOrgName] = createSignal("");
  const [ein, setEin] = createSignal("");
  const [orgWebsite, setOrgWebsite] = createSignal("");
  const [evidenceNote, setEvidenceNote] = createSignal("");
  const [displayName, setDisplayName] = createSignal("");
  const [status, setStatus] = createSignal("unverified");
  const [reviewerNote, setReviewerNote] = createSignal("");
  const [msg, setMsg] = createSignal("");
  const [db, setDb] = createSignal(true);

  async function load() {
    const res = await fetch("/api/verification");
    if (res.status === 401) return;
    const data = (await res.json()) as {
      status?: string;
      orgName?: string;
      ein?: string;
      orgWebsite?: string;
      evidenceNote?: string;
      displayName?: string;
      reviewerNote?: string;
      db?: boolean;
    };
    setStatus(data.status ?? "unverified");
    setOrgName(data.orgName ?? "");
    setEin(data.ein ?? "");
    setOrgWebsite(data.orgWebsite ?? "");
    setEvidenceNote(data.evidenceNote ?? "");
    setDisplayName(data.displayName ?? "");
    setReviewerNote(data.reviewerNote ?? "");
    setDb(data.db !== false);
  }

  onMount(() => load());

  async function submit(e: Event) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orgName: orgName(),
        ein: ein(),
        orgWebsite: orgWebsite(),
        evidenceNote: evidenceNote(),
        displayName: displayName(),
      }),
    });
    const data = (await res.json()) as { error?: string; status?: string };
    if (!res.ok) {
      setMsg(data.error ?? "Could not submit");
      return;
    }
    setStatus(data.status ?? "pending");
    setMsg("Submitted for human review. Notes stay hidden until someone on the team approves you.");
  }

  return (
    <Show when={!session().isPending} fallback={<p class="text-muted-foreground">Loading…</p>}>
      <Show when={session().data?.user} fallback={<Navigate href="/auth?next=/account" />}>
        <div class="mx-auto max-w-lg space-y-6">
          <Title>Account · {SITE_NAME}</Title>
          <h1 class="font-display text-3xl font-semibold">Account</h1>
        <p class="text-sm text-muted-foreground">
          Status: <span class="font-medium text-foreground">{status()}</span>
          <Show when={!db()}>
            {" "}
            · Community database is not attached (set <code>TURSO_DATABASE_URL</code>).
          </Show>
        </p>
        <Show when={reviewerNote()}>
          <p class="rounded-md border border-border bg-muted/40 p-3 text-sm">{reviewerNote()}</p>
        </Show>
        <form class="space-y-3 rounded-lg border border-border bg-card p-6" onSubmit={submit}>
          <input
            required
            placeholder="Your name"
            class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={displayName()}
            onInput={(e) => setDisplayName(e.currentTarget.value)}
          />
          <input
            required
            placeholder="Organization legal name"
            class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={orgName()}
            onInput={(e) => setOrgName(e.currentTarget.value)}
          />
          <input
            placeholder="EIN (optional)"
            class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={ein()}
            onInput={(e) => setEin(e.currentTarget.value)}
          />
          <input
            type="url"
            placeholder="https://your-org.org"
            class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={orgWebsite()}
            onInput={(e) => setOrgWebsite(e.currentTarget.value)}
          />
          <textarea
            rows={4}
            placeholder="How we can verify you: GuideStar/Candid link, determination letter URL, or what to look at."
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={evidenceNote()}
            onInput={(e) => setEvidenceNote(e.currentTarget.value)}
          />
          <Button type="submit" disabled={status() === "verified"}>
            {status() === "verified" ? "Verified" : "Submit for human review"}
          </Button>
          <Show when={msg()}>
            <p class="text-sm text-muted-foreground">{msg()}</p>
          </Show>
        </form>
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            authClient.signOut({
              fetchOptions: { onSuccess: () => location.assign("/auth?next=/account") },
            })
          }
        >
          Sign out
        </Button>
        </div>
      </Show>
    </Show>
  );
}
