import { A, Navigate } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { For, Show } from "solid-js";
import { OfferingCommunity } from "~/components/offering-community";
import {
  CompareToggle,
  PlatformAppMark,
  ServiceGrid,
  ServiceIcon,
} from "~/components/service-views";
import { Button } from "~/components/ui/button";
import {
  CATEGORY_LABELS,
  LISTING_KIND_LABELS,
  OFFER_TYPE_LABELS,
  RESOURCE_KIND_LABELS,
  childrenOf,
  dependsOnIntermediaries,
  listingKindOf,
  parentOf,
  serviceHref,
  type ServiceSeed,
} from "~/lib/services-seed";
import { SITE_NAME } from "~/lib/utils";

export function OfferingDetail(props: { service: ServiceSeed; parent?: ServiceSeed }) {
  const s = () => props.service;
  const parent = () => props.parent ?? parentOf(s());
  const kids = () => childrenOf(s().id);
  const deps = () => dependsOnIntermediaries(s());

  return (
    <article class="space-y-8 pb-16">
      <Title>
        {s().name} · {SITE_NAME}
      </Title>
      <nav class="text-sm text-muted-foreground">
        <A href="/services" class="hover:text-foreground">
          Services
        </A>
        <Show when={parent()}>
          <span> / </span>
          <A href={serviceHref(parent()!)} class="hover:text-foreground">
            {parent()!.name}
          </A>
        </Show>
        <span> / </span>
        <span class="text-foreground">{s().name}</span>
      </nav>

      <div class="overflow-hidden rounded-xl border border-border bg-card">
        <div class="flex items-center gap-4 border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
          <PlatformAppMark service={s()} />
          <div class="min-w-0">
            <div class="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              <span>{LISTING_KIND_LABELS[listingKindOf(s())]}</span>
              <span>·</span>
              <span>{CATEGORY_LABELS[s().category]}</span>
              <span>·</span>
              <span>{OFFER_TYPE_LABELS[s().offerType]}</span>
              <Show when={s().absolutelyFree}>
                <span class="rounded bg-accent/15 px-2 py-0.5 font-semibold tracking-wide text-accent normal-case">
                  Absolutely free
                </span>
              </Show>
            </div>
            <h1 class="mt-1 font-display text-3xl font-semibold sm:text-4xl">{s().name}</h1>
          </div>
        </div>
        <div class="space-y-4 p-6 sm:p-8">
          <p class="max-w-2xl text-lg text-muted-foreground">{s().summary}</p>
          <Show when={s().details}>
            <p class="max-w-3xl whitespace-pre-line text-sm leading-relaxed text-foreground/90">
              {s().details}
            </p>
          </Show>
          <Show when={s().tags.includes("oss.fund")}>
            <p class="text-xs text-muted-foreground">
              Also listed on{" "}
              <a class="underline" href="https://www.oss.fund/" target="_blank" rel="noreferrer">
                OSS.Fund
              </a>{" "}
              (CC BY 4.0).
            </p>
          </Show>
          <Show when={s().tags.includes("websitelaunches")}>
            <p class="text-xs text-muted-foreground">
              Launch record:{" "}
              <a
                class="underline"
                href={`https://websitelaunches.com/site/${new URL(s().directPortalUrl).hostname.replace(/^www\./, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                Website Launches
              </a>
              .
            </p>
          </Show>
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
          <Show when={deps().length > 0}>
            <div class="rounded-xl border border-primary/25 bg-primary/5 p-4">
              <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                Depends on
              </p>
              <p class="mt-1 text-sm text-muted-foreground">
                Start here before the vendor portal will accept your org.
              </p>
              <ul class="mt-3 space-y-2">
                <For each={deps()}>
                  {(dep) => (
                    <li class="flex flex-wrap items-center gap-3">
                      <ServiceIcon name={dep.name} hint={dep.logoHint} />
                      <div class="min-w-0 flex-1">
                        <div class="font-medium text-foreground">{dep.name}</div>
                        <div class="text-sm text-muted-foreground">{dep.role}</div>
                      </div>
                      <div class="flex flex-wrap gap-2">
                        <Show when={dep.catalogSlug}>
                          {(slug) => (
                            <A href={`/services/${slug()}`}>
                              <Button size="sm" variant="secondary">
                                Open in catalog
                              </Button>
                            </A>
                          )}
                        </Show>
                        <a href={dep.portalUrl} target="_blank" rel="noreferrer">
                          <Button size="sm" variant="outline">
                            Go to {dep.name}
                          </Button>
                        </a>
                      </div>
                    </li>
                  )}
                </For>
              </ul>
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
            <CompareToggle service={s()} class="h-10 px-4 text-xs" />
            <A href={`/compare?ids=${s().id}`}>
              <Button variant="secondary">Compare view</Button>
            </A>
          </div>
        </div>
      </div>

      <Show when={kids().length > 0}>
        <section class="space-y-3">
          <h2 class="font-display text-xl font-semibold">Apps in this program</h2>
          <p class="text-sm text-muted-foreground">
            Each product is activated separately after the parent program verifies you. Open an app
            for limits, then add it to compare.
          </p>
          <ServiceGrid services={kids()} />
        </section>
      </Show>

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
            <Show
              when={deps().length > 0}
              fallback={
                s().intermediaryRequired
                  ? "Broker token required (see Depends on above)"
                  : "Direct vendor / no broker token"
              }
            >
              Depends on {deps().map((d) => d.name).join(", ")}
            </Show>
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

      <OfferingCommunity service={s()} />
    </article>
  );
}

export function OfferingNotFound() {
  return (
    <div>
      <h1 class="font-display text-2xl">Not found</h1>
      <A href="/services" class="text-primary underline">
        Back to services
      </A>
    </div>
  );
}

export function OfferingCanonicalRedirect(props: { href: string }) {
  return <Navigate href={props.href} />;
}
