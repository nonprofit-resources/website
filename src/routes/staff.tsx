import { Title } from "@solidjs/meta";
import { For, Show, createSignal, onMount } from "solid-js";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";
import { SITE_NAME } from "~/lib/utils";

interface Profile {
  userId: string;
  email: string;
  displayName: string | null;
  orgName: string | null;
  ein: string | null;
  orgWebsite: string | null;
  evidenceNote: string | null;
  status: string;
  submittedAt: string | null;
}

export default function StaffPage() {
  const session = authClient.useSession();
  const [profiles, setProfiles] = createSignal<Profile[]>([]);
  const [error, setError] = createSignal("");

  async function load() {
    const res = await fetch("/api/staff/verification");
    if (!res.ok) {
      setError(res.status === 403 ? "Not staff. Set ADMIN_EMAILS to your login email." : "Could not load queue");
      return;
    }
    const data = (await res.json()) as { profiles: Profile[] };
    setProfiles(data.profiles ?? []);
  }

  onMount(() => load());

  async function decide(userId: string, status: "verified" | "rejected") {
    const note = window.prompt("Optional note to the org") ?? "";
    await fetch("/api/staff/verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, status, reviewerNote: note }),
    });
    load();
  }

  return (
    <div class="space-y-6">
      <Title>Staff · {SITE_NAME}</Title>
      <h1 class="font-display text-3xl font-semibold">Human verification queue</h1>
      <p class="max-w-2xl text-sm text-muted-foreground">
        Approve only people you have looked at. Staff access is the <code>ADMIN_EMAILS</code> env
        list. Signed in as {session().data?.user?.email ?? "nobody"}.
      </p>
      <Show when={error()}>
        <p class="text-sm text-destructive">{error()}</p>
      </Show>
      <ul class="space-y-3">
        <For each={profiles()}>
          {(p) => (
            <li class="rounded-lg border border-border bg-card p-4">
              <p class="font-medium">
                {p.orgName} <span class="text-sm font-normal text-muted-foreground">({p.status})</span>
              </p>
              <p class="text-sm text-muted-foreground">
                {p.displayName} · {p.email}
                {p.ein ? ` · EIN ${p.ein}` : ""}
              </p>
              <Show when={p.orgWebsite}>
                <a class="text-sm text-primary underline" href={p.orgWebsite!} target="_blank" rel="noreferrer">
                  {p.orgWebsite}
                </a>
              </Show>
              <Show when={p.evidenceNote}>
                <p class="mt-2 text-sm">{p.evidenceNote}</p>
              </Show>
              <Show when={p.status === "pending"}>
                <div class="mt-3 flex gap-2">
                  <Button size="sm" onClick={() => decide(p.userId, "verified")}>
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => decide(p.userId, "rejected")}>
                    Reject
                  </Button>
                </div>
              </Show>
            </li>
          )}
        </For>
      </ul>
    </div>
  );
}
