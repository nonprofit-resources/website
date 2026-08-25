import { Title } from "@solidjs/meta";
import { useSearchParams } from "@solidjs/router";
import { createEffect, createMemo, createSignal, onMount, Show } from "solid-js";
import { CatalogFilterPanel } from "~/components/catalog-filters";
import { ServiceGrid, ServiceList } from "~/components/service-views";
import { Button } from "~/components/ui/button";
import {
  applyCatalogFilters,
  defaultCatalogFilters,
  filtersFromSearchParams,
  filtersToSearchParams,
  type CatalogFilterState,
} from "~/lib/catalog-filters";
import { useI18n } from "~/lib/i18n";
import { servicesSeed } from "~/lib/services-seed";
import { SITE_NAME } from "~/lib/utils";

type ViewMode = "grid" | "list";

function paramsToURLSearchParams(params: Record<string, string | string[] | undefined>) {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null || value === "") continue;
    if (Array.isArray(value)) {
      for (const v of value) if (v) usp.append(key, v);
    } else {
      usp.set(key, value);
    }
  }
  return usp;
}

export default function ServicesPage() {
  const { t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = createSignal<ViewMode>("grid");
  const [filters, setFilters] = createSignal<CatalogFilterState>(defaultCatalogFilters());
  const [hydrated, setHydrated] = createSignal(false);

  onMount(() => {
    setFilters(filtersFromSearchParams(paramsToURLSearchParams(searchParams)));
    setHydrated(true);
  });

  createEffect(() => {
    if (!hydrated()) return;
    const next = filtersToSearchParams(filters());
    const obj: Record<string, string | undefined> = {
      q: undefined,
      free: undefined,
      bypass: undefined,
      noverif: undefined,
      featured: undefined,
      meta: undefined,
      nometa: undefined,
      cat: undefined,
      offer: undefined,
      kind: undefined,
      list: undefined,
      status: undefined,
      oss: undefined,
      sort: undefined,
    };
    for (const [k, v] of next.entries()) obj[k] = v;
    setSearchParams(obj, { replace: true });
  });

  const filtered = createMemo(() => applyCatalogFilters(servicesSeed, filters()));
  const clear = () => setFilters(defaultCatalogFilters());

  return (
    <div class="space-y-6">
      <Title>Services · {SITE_NAME}</Title>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="font-display text-3xl font-semibold">Services</h1>
          <p class="mt-1 text-muted-foreground">
            Search and filter nonprofit plans, DIY options, free software, OSS funding, and meta-directories.
          </p>
        </div>
        <div class="inline-flex rounded-md border border-border p-0.5">
          <Button
            size="sm"
            variant={view() === "grid" ? "default" : "ghost"}
            onClick={() => setView("grid")}
          >
            {t("view_grid")}
          </Button>
          <Button
            size="sm"
            variant={view() === "list" ? "default" : "ghost"}
            onClick={() => setView("list")}
          >
            {t("view_list")}
          </Button>
        </div>
      </div>

      <CatalogFilterPanel
        filters={filters}
        setFilters={setFilters}
        onClear={clear}
        resultCount={filtered().length}
        totalCount={servicesSeed.length}
      />

      <Show
        when={filtered().length > 0}
        fallback={
          <div class="rounded-lg border border-dashed border-border px-6 py-12 text-center">
            <p class="font-medium">No matching resources</p>
            <p class="mt-1 text-sm text-muted-foreground">
              Try clearing “Absolutely free” or widening categories.
            </p>
            <Button class="mt-4" variant="outline" onClick={clear}>
              Clear filters
            </Button>
          </div>
        }
      >
        <Show when={view() === "grid"} fallback={<ServiceList services={filtered()} />}>
          <ServiceGrid services={filtered()} />
        </Show>
      </Show>
    </div>
  );
}
