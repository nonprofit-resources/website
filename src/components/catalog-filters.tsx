import { For, Show } from "solid-js";
import type { Accessor, Setter } from "solid-js";
import { Check } from "lucide-solid";
import { Button } from "~/components/ui/button";
import {
  applyCatalogFilters,
  countActiveFilters,
  toggleInList,
  type CatalogFilterState,
  type SortKey,
} from "~/lib/catalog-filters";
import {
  CATEGORY_LABELS,
  LISTING_KIND_LABELS,
  OFFER_TYPE_LABELS,
  RESOURCE_KIND_LABELS,
  isOpenSourceGeared,
  servicesSeed,
  type CategoryId,
  type ListingKind,
  type OfferType,
  type ResourceKind,
  type StalenessStatus,
} from "~/lib/services-seed";
import { cn } from "~/lib/utils";

const ALL_CATEGORIES = Object.keys(CATEGORY_LABELS) as CategoryId[];
const ALL_OFFERS = Object.keys(OFFER_TYPE_LABELS) as OfferType[];
const ALL_KINDS = Object.keys(RESOURCE_KIND_LABELS) as ResourceKind[];
const ALL_LISTING = Object.keys(LISTING_KIND_LABELS) as ListingKind[];
const ALL_STATUS: StalenessStatus[] = ["active", "unverified", "deprecated"];

const chip =
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors";
const chipOn = "border-primary bg-primary/15 text-primary";
const chipOff = "border-border bg-card text-muted-foreground hover:text-foreground";

export function CatalogFilterPanel(props: {
  filters: Accessor<CatalogFilterState>;
  setFilters: Setter<CatalogFilterState>;
  onClear: () => void;
  resultCount: number;
  totalCount: number;
}) {
  const f = () => props.filters();
  const patch = (partial: Partial<CatalogFilterState>) =>
    props.setFilters((prev) => ({ ...prev, ...partial }));

  const freeCount = () => servicesSeed.filter((s) => s.absolutelyFree).length;
  const ossCount = () => servicesSeed.filter((s) => isOpenSourceGeared(s)).length;
  const metaCount = () => servicesSeed.filter((s) => s.metaResource).length;

  return (
    <section class="space-y-4 rounded-xl border border-border bg-card/70 p-4 sm:p-5" aria-label="Catalog filters">
      <div class="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label class="relative min-w-0 flex-1">
          <span class="sr-only">Search catalog</span>
          <input
            type="search"
            value={f().query}
            onInput={(e) => patch({ query: e.currentTarget.value })}
            placeholder="Search name, tags, category…"
            class="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
          />
        </label>
        <label class="flex items-center gap-2 text-sm">
          <span class="text-muted-foreground whitespace-nowrap">Sort</span>
          <select
            class="h-11 rounded-md border border-input bg-background px-2 text-sm"
            value={f().sort}
            onChange={(e) => patch({ sort: e.currentTarget.value as SortKey })}
          >
            <option value="relevance">Relevance</option>
            <option value="featured">Featured first</option>
            <option value="name_asc">Name A–Z</option>
            <option value="name_desc">Name Z–A</option>
            <option value="verified_desc">Recently verified</option>
          </select>
        </label>
      </div>

      <button
        type="button"
        role="checkbox"
        aria-checked={f().absolutelyFree}
        class="filter-glow filter-glow-free flex cursor-pointer items-center gap-2.5 self-start rounded-lg border border-border bg-background/60 px-3 py-2 text-sm text-left hover:bg-muted/40"
        onClick={() => patch({ absolutelyFree: !f().absolutelyFree })}
      >
        <span
          class={cn(
            "flex size-4 shrink-0 items-center justify-center rounded-sm border transition-colors",
            f().absolutelyFree
              ? "border-primary bg-primary text-primary-foreground"
              : "border-input bg-background",
          )}
        >
          <Show when={f().absolutelyFree}>
            <Check class="size-3" stroke-width={3} />
          </Show>
        </span>
        <span class="font-medium">Absolutely free</span>
        <span class="rounded bg-muted px-1.5 py-0.5 text-[10px] tabular-nums text-muted-foreground">
          {freeCount()}
        </span>
      </button>

      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class={cn(chip, f().bypassGatekeepers ? chipOn : chipOff)}
          aria-pressed={f().bypassGatekeepers}
          onClick={() => patch({ bypassGatekeepers: !f().bypassGatekeepers })}
        >
          Bypass gatekeepers
        </button>
        <button
          type="button"
          class={cn(chip, f().noVerification ? chipOn : chipOff)}
          aria-pressed={f().noVerification}
          onClick={() => patch({ noVerification: !f().noVerification })}
        >
          No verification needed
        </button>
        <button
          type="button"
          class={cn(chip, f().featuredOnly ? chipOn : chipOff)}
          aria-pressed={f().featuredOnly}
          onClick={() => patch({ featuredOnly: !f().featuredOnly })}
        >
          Featured
        </button>
        <button
          type="button"
          class={cn("filter-glow filter-glow-oss", chip, f().openSource ? chipOn : chipOff)}
          aria-pressed={f().openSource}
          onClick={() => patch({ openSource: !f().openSource })}
        >
          For open-source projects
          <span class="rounded bg-background/60 px-1.5 py-0.5 text-[10px] tabular-nums">
            {ossCount()}
          </span>
        </button>
        <button
          type="button"
          class={cn(chip, f().includeMeta ? chipOn : chipOff)}
          aria-pressed={f().includeMeta}
          onClick={() => patch({ includeMeta: !f().includeMeta })}
        >
          Meta-directories
          <span class="rounded bg-background/60 px-1.5 py-0.5 text-[10px] tabular-nums">
            {metaCount()}
          </span>
        </button>
      </div>

      <div class="flex flex-wrap gap-2">
        <For each={ALL_LISTING}>
          {(k) => (
            <button
              type="button"
              class={cn(chip, f().listingKinds.includes(k) ? chipOn : chipOff)}
              aria-pressed={f().listingKinds.includes(k)}
              onClick={() => patch({ listingKinds: toggleInList(f().listingKinds, k) })}
            >
              {LISTING_KIND_LABELS[k]}
            </button>
          )}
        </For>
      </div>

      <details class="group rounded-lg border border-border/80 bg-background/40 open:bg-background/60">
        <summary class="cursor-pointer list-none px-3 py-2 text-sm font-medium marker:content-none [&::-webkit-details-marker]:hidden">
          <span class="flex items-center justify-between gap-2">
            Advanced filters
            <span class="text-xs font-normal text-muted-foreground group-open:hidden">
              Category · offer · kind · status
            </span>
          </span>
        </summary>
        <div class="space-y-4 border-t border-border/70 px-3 py-3">
          <FilterGroup label="Category">
            <For each={ALL_CATEGORIES}>
              {(c) => (
                <button
                  type="button"
                  class={cn(chip, f().categories.includes(c) ? chipOn : chipOff)}
                  aria-pressed={f().categories.includes(c)}
                  onClick={() => patch({ categories: toggleInList(f().categories, c) })}
                >
                  {CATEGORY_LABELS[c]}
                </button>
              )}
            </For>
          </FilterGroup>
          <FilterGroup label="Offer type">
            <For each={ALL_OFFERS}>
              {(o) => (
                <button
                  type="button"
                  class={cn(chip, f().offerTypes.includes(o) ? chipOn : chipOff)}
                  aria-pressed={f().offerTypes.includes(o)}
                  onClick={() => patch({ offerTypes: toggleInList(f().offerTypes, o) })}
                >
                  {OFFER_TYPE_LABELS[o]}
                </button>
              )}
            </For>
          </FilterGroup>
          <FilterGroup label="Resource kind">
            <For each={ALL_KINDS}>
              {(k) => (
                <button
                  type="button"
                  class={cn(chip, f().resourceKinds.includes(k) ? chipOn : chipOff)}
                  aria-pressed={f().resourceKinds.includes(k)}
                  onClick={() => patch({ resourceKinds: toggleInList(f().resourceKinds, k) })}
                >
                  {RESOURCE_KIND_LABELS[k]}
                </button>
              )}
            </For>
          </FilterGroup>
          <FilterGroup label="Verification status">
            <For each={ALL_STATUS}>
              {(st) => (
                <button
                  type="button"
                  class={cn(chip, f().staleness.includes(st) ? chipOn : chipOff)}
                  aria-pressed={f().staleness.includes(st)}
                  onClick={() => patch({ staleness: toggleInList(f().staleness, st) })}
                >
                  {st}
                </button>
              )}
            </For>
          </FilterGroup>
        </div>
      </details>

      <div class="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3 text-sm">
        <p class="text-muted-foreground">
          Showing{" "}
          <span class="font-medium text-foreground tabular-nums">{props.resultCount}</span> of{" "}
          <span class="tabular-nums">{props.totalCount}</span>
          <Show when={countActiveFilters(f()) > 0}>
            <span>
              {" "}
              · {countActiveFilters(f())} active filter
              {countActiveFilters(f()) === 1 ? "" : "s"}
            </span>
          </Show>
        </p>
        <Show when={countActiveFilters(f()) > 0}>
          <Button type="button" size="sm" variant="ghost" onClick={props.onClear}>
            Clear all
          </Button>
        </Show>
      </div>
    </section>
  );
}

function FilterGroup(props: { label: string; children: import("solid-js").JSX.Element }) {
  return (
    <div>
      <p class="mb-2 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
        {props.label}
      </p>
      <div class="flex flex-wrap gap-1.5">{props.children}</div>
    </div>
  );
}

/** Re-export helper for pages that want filtered lists without importing apply twice. */
export { applyCatalogFilters };
