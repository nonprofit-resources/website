import { A, useSearchParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { For, Show, createMemo, createEffect, onMount } from "solid-js";
import { PlatformAppMark } from "~/components/service-views";
import { Button } from "~/components/ui/button";
import {
  hydrateCompareCart,
  compareIds,
  setCompareFromList,
  toggleCompare,
} from "~/lib/compare-cart";
import { COMPARE_FEATURES, formatCompareValue } from "~/lib/compare-features";
import { compareValuesOf, getServiceById, serviceHref, type ServiceSeed } from "~/lib/services-seed";
import { SITE_NAME } from "~/lib/utils";

export default function ComparePage() {
  const [params, setParams] = useSearchParams();

  onMount(() => {
    hydrateCompareCart();
    const fromUrl = (typeof params.ids === "string" ? params.ids : "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (fromUrl.length) setCompareFromList(fromUrl);
  });

  createEffect(() => {
    const ids = compareIds();
    setParams({ ids: ids.length ? ids.join(",") : undefined }, { replace: true });
  });

  const offerings = createMemo(() =>
    compareIds()
      .map((id) => getServiceById(id))
      .filter((s): s is ServiceSeed => Boolean(s)),
  );

  const groups = () => {
    const map = new Map<string, typeof COMPARE_FEATURES>();
    for (const f of COMPARE_FEATURES) {
      const list = map.get(f.group) ?? [];
      list.push(f);
      map.set(f.group, list);
    }
    return [...map.entries()];
  };

  return (
    <div class="space-y-6 pb-20">
      <Title>Compare · {SITE_NAME}</Title>
      <div>
        <h1 class="font-display text-3xl font-semibold">Compare</h1>
        <p class="mt-1 max-w-2xl text-muted-foreground">
          Scroll sideways through offering columns. Add items from search or an entity page. Feature
          rows stay pinned on the left.
        </p>
      </div>

      <Show
        when={offerings().length > 0}
        fallback={
          <p class="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
            Nothing in the tray yet. Open{" "}
            <A href="/services" class="text-primary underline">
              Services
            </A>{" "}
            and tap Compare.
          </p>
        }
      >
        <div class="overflow-x-auto rounded-xl border border-border bg-card">
          <table class="min-w-max border-collapse text-sm">
            <thead>
              <tr class="border-b border-border">
                <th class="sticky left-0 z-20 min-w-44 bg-card px-4 py-3 text-left font-medium">
                  Feature
                </th>
                <For each={offerings()}>
                  {(s) => (
                    <th class="min-w-52 max-w-64 border-l border-border px-4 py-3 align-bottom">
                      <div class="flex items-start gap-2">
                        <PlatformAppMark service={s} />
                        <div class="min-w-0">
                          <A href={serviceHref(s)} class="font-medium text-foreground no-underline hover:underline">
                            {s.name}
                          </A>
                          <div>
                            <button
                              type="button"
                              class="text-xs text-muted-foreground hover:text-destructive"
                              onClick={() => toggleCompare(s.id)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </th>
                  )}
                </For>
              </tr>
            </thead>
            <tbody>
              <For each={groups()}>
                {([group, feats]) => (
                  <>
                    <tr class="border-t border-border bg-muted/40">
                      <th
                        class="sticky left-0 z-10 bg-muted/40 px-4 py-2 text-left text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                        colSpan={offerings().length + 1}
                      >
                        {group}
                      </th>
                    </tr>
                    <For each={feats}>
                      {(feat) => (
                        <tr class="border-t border-border/70">
                          <th class="sticky left-0 z-10 bg-card px-4 py-2.5 text-left font-medium">
                            {feat.label}
                          </th>
                          <For each={offerings()}>
                            {(s) => (
                              <td class="border-l border-border px-4 py-2.5 text-muted-foreground">
                                {formatCompareValue(feat.kind, compareValuesOf(s)[feat.key])}
                              </td>
                            )}
                          </For>
                        </tr>
                      )}
                    </For>
                  </>
                )}
              </For>
            </tbody>
          </table>
        </div>
        <A href="/services">
          <Button variant="outline">Add more from catalog</Button>
        </A>
      </Show>
    </div>
  );
}
