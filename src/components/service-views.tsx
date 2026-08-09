import { A } from "@solidjs/router";
import { For } from "solid-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import type { ServiceSeed } from "~/lib/services-seed";

function ServiceIcon(props: { name: string; hint?: string }) {
  const letter = () => (props.name[0] ?? "?").toUpperCase();
  const src = () => `/media/services/${props.hint ?? "placeholder"}.png`;
  return (
    <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/12 font-display text-lg font-bold text-primary">
      <img
        src={src()}
        alt=""
        class="size-8 object-contain"
        onError={(e) => {
          const el = e.currentTarget as HTMLImageElement;
          const svg = `/media/services/${props.hint ?? "placeholder"}.svg`;
          if (!el.dataset.fallback) {
            el.dataset.fallback = "1";
            el.src = svg;
            return;
          }
          el.style.display = "none";
          if (el.parentElement && !el.parentElement.dataset.letter) {
            el.parentElement.dataset.letter = "1";
            el.parentElement.append(letter());
          }
        }}
      />
    </div>
  );
}

export function ServiceGrid(props: { services: ServiceSeed[] }) {
  return (
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <For each={props.services}>
        {(s) => (
          <A href={`/services/${s.slug}`} class="group no-underline">
            <Card class="h-full transition-shadow group-hover:shadow-md">
              <CardHeader class="flex flex-row items-start gap-3 space-y-0">
                <ServiceIcon name={s.name} hint={s.iconHint ?? s.slug} />
                <div class="min-w-0">
                  <CardTitle class="text-base">{s.name}</CardTitle>
                  <CardDescription class="mt-1 line-clamp-2">{s.summary}</CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div class="flex flex-wrap gap-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                  <span class="rounded bg-muted px-2 py-0.5">{s.category.replaceAll("_", " ")}</span>
                  <span class="rounded bg-muted px-2 py-0.5">{s.offerType.replaceAll("_", " ")}</span>
                </div>
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
              href={`/services/${s.slug}`}
              class="flex items-center gap-3 px-4 py-3 no-underline transition-colors hover:bg-muted/60"
            >
              <ServiceIcon name={s.name} hint={s.iconHint ?? s.slug} />
              <div class="min-w-0 flex-1">
                <div class="font-medium text-foreground">{s.name}</div>
                <div class="truncate text-sm text-muted-foreground">{s.summary}</div>
              </div>
              <span class="hidden text-xs text-muted-foreground sm:inline">
                {s.category.replaceAll("_", " ")}
              </span>
            </A>
          </li>
        )}
      </For>
    </ul>
  );
}
