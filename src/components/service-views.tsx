import { A } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { isInCompare, toggleCompare, canAddToCompare, firstComparedService } from "~/lib/compare-cart";
import { compareLaneLabel } from "~/lib/compare-peers";
import { darkMarkHint, resolvedMarkHint } from "~/lib/service-marks";
import {
  CATEGORY_LABELS,
  LISTING_KIND_LABELS,
  OFFER_TYPE_LABELS,
  listingKindOf,
  parentOf,
  serviceHref,
  type ServiceSeed,
} from "~/lib/services-seed";
import { cn } from "~/lib/utils";

export function mediaSrc(hint: string, ext: "png" | "svg" | "ico" = "png") {
  return `/media/services/${hint}.${ext}`;
}

function prefersSvg(hint: string) {
  return Boolean(darkMarkHint(hint)) || hint.endsWith("-dark");
}

function markFallback(el: HTMLImageElement, hint: string, letter: string, started: "png" | "svg") {
  const parent = el.parentElement;
  if (!el.dataset.fallback) {
    el.dataset.fallback = "1";
    el.src = mediaSrc(hint, started === "svg" ? "png" : "svg");
    return;
  }
  if (el.dataset.fallback === "1") {
    el.dataset.fallback = "2";
    el.src = mediaSrc(hint, "ico");
    return;
  }
  el.style.display = "none";
  if (parent && !parent.dataset.letter) {
    parent.dataset.letter = "1";
    parent.append(letter);
  }
}

function ServiceMarkImg(props: { hint: string; letter: string; class?: string }) {
  const hint = () => resolvedMarkHint(props.hint);
  const dark = () => darkMarkHint(props.hint);
  const lightExt = () => (prefersSvg(props.hint) ? "svg" : "png") as "png" | "svg";
  const darkExt = () => "svg" as const;
  return (
    <>
      <img
        src={mediaSrc(hint(), lightExt())}
        alt=""
        class={cn(props.class, dark() && "dark:hidden")}
        onError={(e) =>
          markFallback(e.currentTarget as HTMLImageElement, hint(), props.letter, lightExt())
        }
      />
      <Show when={dark()}>
        {(d) => (
          <img
            src={mediaSrc(d(), darkExt())}
            alt=""
            class={cn(props.class, "hidden dark:block")}
            onError={(e) =>
              markFallback(e.currentTarget as HTMLImageElement, d(), props.letter, darkExt())
            }
          />
        )}
      </Show>
    </>
  );
}

export function ServiceIcon(props: { name: string; hint?: string; class?: string }) {
  const letter = () => (props.name[0] ?? "?").toUpperCase();
  const hint = () => props.hint ?? "placeholder";
  return (
    <div
      class={cn(
        "flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/12 font-display text-lg font-bold text-primary",
        props.class,
      )}
    >
      <ServiceMarkImg hint={hint()} letter={letter()} class="size-8 object-contain" />
    </div>
  );
}

/** Platform mark sits up-left and behind the app mark. */
export function PlatformAppMark(props: { service: ServiceSeed; class?: string }) {
  const parent = () => parentOf(props.service);
  const letter = () => (props.service.name[0] ?? "?").toUpperCase();
  const appHint = () => props.service.iconHint ?? props.service.slug;
  const platHint = () => parent()?.iconHint ?? parent()?.slug ?? "placeholder";

  return (
    <Show
      when={listingKindOf(props.service) === "app" && parent()}
      fallback={<ServiceIcon name={props.service.name} hint={props.service.iconHint ?? props.service.slug} />}
    >
      <div
        class={cn("relative size-12 shrink-0", props.class)}
        title={`${props.service.name} on ${parent()?.name}`}
      >
        <div class="absolute top-0 left-0 z-0 flex size-7 items-center justify-center rounded-md border border-background bg-card shadow-sm">
          <ServiceMarkImg hint={platHint()} letter="P" class="size-5 object-contain" />
        </div>
        <div class="absolute right-0 bottom-0 z-10 flex size-9 items-center justify-center rounded-lg border border-background bg-primary/12 font-display text-sm font-bold text-primary shadow-sm">
          <ServiceMarkImg hint={appHint()} letter={letter()} class="size-6 object-contain" />
        </div>
      </div>
    </Show>
  );
}

function FreeBadge() {
  return (
    <span class="rounded bg-accent/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">
      Free
    </span>
  );
}

function AppBadge() {
  return (
    <span class="rounded bg-primary/12 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-primary">
      App
    </span>
  );
}

export function CompareToggle(props: { service: ServiceSeed; class?: string }) {
  const inCart = () => isInCompare(props.service.id);
  const blocked = () => !inCart() && !canAddToCompare(props.service.id);
  const reason = () => {
    const first = firstComparedService();
    if (!first) return undefined;
    return `Compare is limited to ${compareLaneLabel(first)}`;
  };
  return (
    <button
      type="button"
      class={cn(
        "rounded-md border px-2 py-1 text-[11px] font-medium uppercase tracking-wide",
        inCart()
          ? "border-primary bg-primary/15 text-primary"
          : blocked()
            ? "cursor-not-allowed border-border text-muted-foreground/50"
            : "border-border text-muted-foreground hover:text-foreground",
        props.class,
      )}
      aria-pressed={inCart()}
      disabled={blocked()}
      title={blocked() ? reason() : undefined}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (blocked()) return;
        toggleCompare(props.service.id);
      }}
    >
      {inCart() ? "In compare" : "Compare"}
    </button>
  );
}

export function ServiceGrid(props: { services: ServiceSeed[] }) {
  return (
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <For each={props.services}>
        {(s) => (
          <A href={serviceHref(s)} class="group no-underline">
            <Card class="h-full transition-shadow group-hover:shadow-md">
              <CardHeader class="flex flex-row items-start gap-3 space-y-0">
                <PlatformAppMark service={s} />
                <div class="min-w-0 flex-1">
                  <div class="flex flex-wrap items-center gap-2">
                    <CardTitle class="text-base">{s.name}</CardTitle>
                    <Show when={s.absolutelyFree}>
                      <FreeBadge />
                    </Show>
                    <Show when={listingKindOf(s) === "app"}>
                      <AppBadge />
                    </Show>
                  </div>
                  <CardDescription class="mt-1 line-clamp-2">{s.summary}</CardDescription>
                </div>
              </CardHeader>
              <CardContent class="flex items-end justify-between gap-2">
                <div class="flex flex-wrap gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <span class="rounded bg-muted px-2 py-0.5">{CATEGORY_LABELS[s.category]}</span>
                  <span class="rounded bg-muted px-2 py-0.5">{OFFER_TYPE_LABELS[s.offerType]}</span>
                  <Show when={listingKindOf(s) === "app"}>
                    <span class="rounded bg-muted px-2 py-0.5">{LISTING_KIND_LABELS.app}</span>
                  </Show>
                </div>
                <CompareToggle service={s} />
              </CardContent>
            </Card>
          </A>
        )}
      </For>
    </div>
  );
}

export function ServiceList(props: { services: ServiceSeed[] }) {
  return (
    <ul class="divide-y divide-border rounded-lg border border-border bg-card">
      <For each={props.services}>
        {(s) => (
          <li>
            <A
              href={serviceHref(s)}
              class="flex items-center gap-3 px-4 py-3 no-underline transition-colors hover:bg-muted/60"
            >
              <PlatformAppMark service={s} />
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <span class="font-medium text-foreground">{s.name}</span>
                  <Show when={s.absolutelyFree}>
                    <FreeBadge />
                  </Show>
                  <Show when={listingKindOf(s) === "app"}>
                    <AppBadge />
                  </Show>
                </div>
                <div class="truncate text-sm text-muted-foreground">{s.summary}</div>
              </div>
              <span class="hidden text-xs text-muted-foreground sm:inline">
                {CATEGORY_LABELS[s.category]}
              </span>
              <CompareToggle service={s} />
            </A>
          </li>
        )}
      </For>
    </ul>
  );
}
