import { A } from "@solidjs/router";
import { For, Show, onMount } from "solid-js";
import { Button } from "~/components/ui/button";
import {
  clearCompare,
  compareCount,
  compareIds,
  hydrateCompareCart,
  toggleCompare,
} from "~/lib/compare-cart";
import { getServiceById } from "~/lib/services-seed";

export function CompareTray() {
  onMount(() => hydrateCompareCart());
  const items = () => compareIds().map((id) => getServiceById(id)).filter(Boolean);

  return (
    <Show when={compareCount() > 0}>
      <>
        <div class="h-16" />
        <div class="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 py-3 shadow-lg backdrop-blur-md sm:px-6">
        <div class="mx-auto flex max-w-6xl flex-wrap items-center gap-3">
          <p class="text-sm font-medium">
            Compare <span class="tabular-nums">{compareCount()}</span>
          </p>
          <ul class="flex min-w-0 flex-1 gap-2 overflow-x-auto">
            <For each={items()}>
              {(s) => (
                <li>
                  <button
                    type="button"
                    class="rounded-full border border-border bg-card px-2.5 py-1 text-xs whitespace-nowrap hover:border-destructive"
                    onClick={() => toggleCompare(s!.id)}
                    title="Remove"
                  >
                    {s!.name} ×
                  </button>
                </li>
              )}
            </For>
          </ul>
          <div class="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => clearCompare()}>
              Clear
            </Button>
            <A href={`/compare?ids=${compareIds().join(",")}`}>
              <Button size="sm">Open table</Button>
            </A>
          </div>
        </div>
        </div>
      </>
    </Show>
  );
}
