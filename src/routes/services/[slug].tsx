import { A, useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { For, Show } from "solid-js";
import { Button } from "~/components/ui/button";
import {
  CATEGORY_LABELS,
  OFFER_TYPE_LABELS,
  RESOURCE_KIND_LABELS,
  getServiceBySlug,
} from "~/lib/services-seed";
import { SITE_NAME } from "~/lib/utils";

export default function ServiceDetail() {
  const params = useParams();
  const service = () => getServiceBySlug(params.slug ?? "");

  return (
    <Show
      when={service()}
      fallback={
        <div>
          <h1 class="font-display text-2xl">Not found</h1>
          <A href="/services" class="text-primary underline">
            Back to services
          </A>
        </div>
      }
    >
      {(s) => (
        <article class="space-y-8">
          <Title>
            {s().name} · {SITE_NAME}
          </Title>
          <div class="overflow-hidden rounded-xl border border-border bg-card">
            <div class="aspect-[21/9] bg-muted/40">
              <img
                src={`/media/services/${s().iconHint ?? s().slug}.png`}
                alt={`${s().name} preview`}
                class="h-full w-full object-cover object-top"
                onError={(e) => {
                  const el = e.currentTarget as HTMLImageElement;
                  const hint = s().iconHint ?? s().slug;
                  if (!el.dataset.fallback) {
                    el.dataset.fallback = "1";
                    el.src = `/media/services/${hint}.svg`;
                    return;
                  }
                  el.src = "/media/services/placeholder.svg";
                }}
              />
            </div>
            <div class="space-y-4 p-6 sm:p-8">
              <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <span>{CATEGORY_LABELS[s().category]}</span>
                <span>·</span>
                <span>{OFFER_TYPE_LABELS[s().offerType]}</span>
                <Show when={s().absolutelyFree}>
                  <span class="rounded bg-accent/15 px-2 py-0.5 font-semibold tracking-wide text-accent normal-case">
                    Absolutely free
                  </span>
                </Show>
              </div>
              <h1 class="font-display text-3xl font-semibold sm:text-4xl">{s().name}</h1>
              <p class="max-w-2xl text-lg text-muted-foreground">{s().summary}</p>
              <Show when={s().tags.length}>
                <div class="flex flex-wrap gap-1.5">
                  <For each={s().tags}>
                    {(tag) => (
                      <A
                        href={`/services?q=${encodeURIComponent(tag)}`}
                        class="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground no-underline hover:text-foreground"
                      >
                        #{tag}
                      </A>
                    )}
                  </For>
                </div>
              </Show>
              <div class="flex flex-wrap gap-3">
                <a href={s().directPortalUrl} target="_blank" rel="noreferrer">
                  <Button>Open portal</Button>
                </a>
                <Show when={s().alternativeToUrl}>
                  {(url) => (
                    <a href={url()} target="_blank" rel="noreferrer">
                      <Button variant="outline">Alternatives on AlternativeTo</Button>
                    </a>
                  )}
                </Show>
                <A href="/services?free=1">
                  <Button variant="secondary">Browse absolutely free</Button>
                </A>
              </div>
            </div>
          </div>

          <dl class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-lg border border-border p-4">
              <dt class="text-xs uppercase tracking-wide text-muted-foreground">Cost</dt>
              <dd class="mt-1 text-sm">
                {s().absolutelyFree
                  ? "Absolutely free core offer (after eligibility)"
                  : "Paid, discounted, credits, or admin fees may apply"}
              </dd>
            </div>
            <div class="rounded-lg border border-border p-4">
              <dt class="text-xs uppercase tracking-wide text-muted-foreground">Resource kind</dt>
              <dd class="mt-1 text-sm">{RESOURCE_KIND_LABELS[s().resourceKind]}</dd>
            </div>
            <div class="rounded-lg border border-border p-4">
              <dt class="text-xs uppercase tracking-wide text-muted-foreground">Verification</dt>
              <dd class="mt-1 text-sm">{s().verification.join(", ")}</dd>
            </div>
            <div class="rounded-lg border border-border p-4">
              <dt class="text-xs uppercase tracking-wide text-muted-foreground">Intermediary</dt>
              <dd class="mt-1 text-sm">
                {s().intermediaryRequired
                  ? "TechSoup / Goodstack (or similar) token required"
                  : "Direct vendor / no broker token"}
              </dd>
            </div>
            <div class="rounded-lg border border-border p-4">
              <dt class="text-xs uppercase tracking-wide text-muted-foreground">Last verified</dt>
              <dd class="mt-1 text-sm">
                {s().lastVerifiedAt} · {s().stalenessStatus}
              </dd>
            </div>
            <Show when={s().monetaryCapUsd != null}>
              <div class="rounded-lg border border-border p-4">
                <dt class="text-xs uppercase tracking-wide text-muted-foreground">Monetary cap</dt>
                <dd class="mt-1 text-sm">${s().monetaryCapUsd?.toLocaleString()} USD</dd>
              </div>
            </Show>
            <Show when={s().userSeatLimit != null}>
              <div class="rounded-lg border border-border p-4">
                <dt class="text-xs uppercase tracking-wide text-muted-foreground">Seat limit</dt>
                <dd class="mt-1 text-sm">{s().userSeatLimit}</dd>
              </div>
            </Show>
          </dl>
        </article>
      )}
    </Show>
  );
}
