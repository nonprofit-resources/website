import { For, onMount, Show, createResource, createSignal } from "solid-js";
import { A } from "@solidjs/router";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";
import { type ServiceSeed } from "~/lib/services-seed";

interface ReviewRow {
  id: string;
  body: string;
  rating: number | null;
  createdAt: string;
  orgName: string | null;
  displayName: string | null;
}

export function OfferingCommunity(props: { service: ServiceSeed }) {
  const session = authClient.useSession();
  const [reviews, { refetch }] = createResource(
    () => props.service.id,
    async (serviceId) => {
      const res = await fetch(`/api/reviews?serviceId=${encodeURIComponent(serviceId)}`);
      if (!res.ok) return { reviews: [] as ReviewRow[], db: false };
      return res.json() as Promise<{ reviews: ReviewRow[]; db: boolean; error?: string }>;
    },
  );
  const [body, setBody] = createSignal("");
  const [rating, setRating] = createSignal("5");
  const [msg, setMsg] = createSignal("");
  const [status, setStatus] = createSignal<string | null>(null);

  async function loadProfile() {
    const res = await fetch("/api/verification");
    if (!res.ok) return;
    const data = (await res.json()) as { status?: string };
    setStatus(data.status ?? "unverified");
  }

  onMount(() => {
    loadProfile();
  });

  async function submit(e: Event) {
    e.preventDefault();
    setMsg("");
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        serviceId: props.service.id,
        body: body(),
        rating: Number(rating()),
      }),
    });
    const data = (await res.json()) as { error?: string; held?: boolean };
    if (!res.ok) {
      setMsg(data.error ?? "Could not save feedback");
      return;
    }
    setBody("");
    setMsg(
      data.held
        ? "Saved. It will appear after a human verifies your account."
        : "Thanks — your note is posted.",
    );
    refetch();
  }

  return (
    <section class="space-y-4">
      <h2 class="font-display text-xl font-semibold">Operator notes</h2>
      <Show when={reviews()?.reviews?.length}>
        <ul class="space-y-3">
          <For each={reviews()?.reviews ?? []}>
            {(r) => (
              <li class="rounded-lg border border-border bg-card p-4">
                <p class="text-sm">{r.body}</p>
                <p class="mt-2 text-xs text-muted-foreground">
                  {r.orgName || r.displayName || "Verified org"}
                  {r.rating != null ? ` · ${r.rating}/5` : ""} · {r.createdAt.slice(0, 10)}
                </p>
              </li>
            )}
          </For>
        </ul>
      </Show>
      <Show when={!reviews.loading && !(reviews()?.reviews?.length)}>
        <p class="text-sm text-muted-foreground">No verified operator notes yet.</p>
      </Show>

      <Show
        when={session().data?.user}
        fallback={
          <p class="text-sm text-muted-foreground">
            <A href="/auth" class="text-primary underline">
              Sign in
            </A>{" "}
            to leave feedback. A human has to verify the org before notes go public.
          </p>
        }
      >
        <Show when={status() && status() !== "verified"}>
          <p class="text-sm text-muted-foreground">
            {status() === "pending"
              ? "Your verification is in the human review queue. You can still write a note; it stays held until approval."
              : "Submit the verification form so a person can confirm the org."}{" "}
            <A href="/account" class="text-primary underline">
              Verification form
            </A>
          </p>
        </Show>
        <form class="space-y-3 rounded-lg border border-border bg-card p-4" onSubmit={submit}>
            <label class="block text-sm">
              Rating
              <select
                class="mt-1 h-10 w-full rounded-md border border-input bg-background px-2 text-sm"
                value={rating()}
                onChange={(e) => setRating(e.currentTarget.value)}
              >
                <option value="5">5 · Strong fit</option>
                <option value="4">4</option>
                <option value="3">3 · Mixed</option>
                <option value="2">2</option>
                <option value="1">1 · Avoid</option>
              </select>
            </label>
            <textarea
              required
              minLength={20}
              rows={4}
              placeholder="What broke, what worked, seating gotchas…"
              class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={body()}
              onInput={(e) => setBody(e.currentTarget.value)}
            />
            <Button type="submit">Post note</Button>
            <Show when={msg()}>
              <p class="text-sm text-muted-foreground">{msg()}</p>
            </Show>
          </form>
      </Show>
    </section>
  );
}
