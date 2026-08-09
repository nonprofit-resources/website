import { Title } from "@solidjs/meta";
import { createMemo, createSignal, For, Show } from "solid-js";
import { ServiceGrid, ServiceList } from "~/components/service-views";
import { Button } from "~/components/ui/button";
import { useI18n } from "~/lib/i18n";
import { bypassesGatekeepers, servicesSeed, type CategoryId } from "~/lib/services-seed";
import { SITE_NAME } from "~/lib/utils";

type ViewMode = "grid" | "list";

export default function ServicesPage() {
  const { t } = useI18n();
  const [view, setView] = createSignal<ViewMode>("grid");
  const [category, setCategory] = createSignal<CategoryId | "all">("all");
  const [bypassOnly, setBypassOnly] = createSignal(false);

  const categories = () =>
    Array.from(new Set(servicesSeed.map((s) => s.category))).sort() as CategoryId[];

  const filtered = createMemo(() =>
    servicesSeed.filter((s) => {
      if (category() !== "all" && s.category !== category()) return false;
      if (bypassOnly() && !bypassesGatekeepers(s)) return false;
      return true;
    }),
  );

  return (
    <div class="space-y-6">
      <Title>Services · {SITE_NAME}</Title>
      <div class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 class="font-display text-3xl font-semibold">Services</h1>
          <p class="mt-1 text-muted-foreground">
            Nonprofit plans, DIY options, free software, and meta-directories.
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

      <div class="flex flex-wrap items-center gap-3">
        <label class="text-sm text-muted-foreground" for="cat">
          Category
        </label>
        <select
          id="cat"
          class="h-9 rounded-md border border-input bg-background px-2 text-sm"
          value={category()}
          onChange={(e) => setCategory(e.currentTarget.value as CategoryId | "all")}
        >
          <option value="all">All</option>
          <For each={categories()}>
            {(c) => <option value={c}>{c.replaceAll("_", " ")}</option>}
          </For>
        </select>
        <label class="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={bypassOnly()}
            onChange={(e) => setBypassOnly(e.currentTarget.checked)}
          />
          Bypass gatekeepers (no TechSoup/Goodstack token)
        </label>
      </div>

      <Show when={view() === "grid"} fallback={<ServiceList services={filtered()} />}>
        <ServiceGrid services={filtered()} />
      </Show>
    </div>
  );
}
