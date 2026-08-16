import { Combobox } from "@kobalte/core/combobox";
import { ChevronsUpDown } from "lucide-solid";
import { createMemo, createSignal, Show } from "solid-js";
import {
  addCompare,
  canAddToCompare,
  COMPARE_MAX,
  compareIds,
  firstComparedService,
} from "~/lib/compare-cart";
import { compareLaneLabel, compareSearchHits } from "~/lib/compare-peers";
import { CATEGORY_LABELS, LISTING_KIND_LABELS, listingKindOf, type ServiceSeed } from "~/lib/services-seed";
import { cn } from "~/lib/utils";

export function CompareSearch(props: { class?: string; compact?: boolean }) {
  const [query, setQuery] = createSignal("");
  const [value, setValue] = createSignal<ServiceSeed | undefined>();

  const anchor = () => firstComparedService();
  const hits = createMemo(() =>
    compareSearchHits(query(), {
      excludeIds: compareIds(),
      anchor: anchor(),
    }),
  );
  const full = () => compareIds().length >= COMPARE_MAX;

  function pick(next: ServiceSeed | null) {
    setValue(undefined);
    if (!next) return;
    if (!canAddToCompare(next.id)) return;
    addCompare(next.id);
    setQuery("");
  }

  return (
    <div class={cn("w-full max-w-lg", props.class)}>
      <Combobox<ServiceSeed>
        options={hits()}
        value={value()}
        onChange={pick}
        optionValue="id"
        optionTextValue="name"
        optionLabel="name"
        defaultFilter={() => true}
        placeholder={full() ? `Compare holds up to ${COMPARE_MAX}` : "Search offerings to compare…"}
        disabled={full()}
        onInputChange={(text) => {
          setQuery(text);
          if (text === "") setValue(undefined);
        }}
        itemComponent={(itemProps) => {
          const s = itemProps.item.rawValue;
          return (
            <Combobox.Item
              item={itemProps.item}
              class="flex cursor-pointer items-start gap-2 rounded-md px-2 py-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-muted"
            >
              <Combobox.ItemLabel class="min-w-0 flex-1">
                <span class="block truncate font-medium text-foreground">{s.name}</span>
                <span class="block truncate text-[11px] text-muted-foreground">
                  {CATEGORY_LABELS[s.category]} · {LISTING_KIND_LABELS[listingKindOf(s)]}
                </span>
              </Combobox.ItemLabel>
            </Combobox.Item>
          );
        }}
      >
        <Combobox.Control
          class={cn(
            "flex items-center rounded-md border border-input bg-background",
            props.compact ? "h-9" : "h-10",
          )}
          aria-label="Add offering to compare"
        >
          <Combobox.Input
            class="h-full min-w-0 flex-1 bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <Combobox.Trigger class="inline-flex size-9 shrink-0 items-center justify-center text-muted-foreground">
            <Combobox.Icon>
              <ChevronsUpDown class="size-4" />
            </Combobox.Icon>
          </Combobox.Trigger>
        </Combobox.Control>
        <Combobox.Portal>
          <Combobox.Content class="z-[60] w-[var(--kb-combobox-content-width)] overflow-hidden rounded-md border border-border bg-card text-card-foreground shadow-md">
            <Combobox.Listbox class="max-h-72 overflow-y-auto p-1" />
          </Combobox.Content>
        </Combobox.Portal>
      </Combobox>
      <Show when={!props.compact && anchor() && !full()}>
        <p class="mt-1.5 text-xs text-muted-foreground">
          Add more {compareLaneLabel(anchor()!)}. Same category and listing type as the first column.
        </p>
      </Show>
      <Show when={!props.compact && !anchor()}>
        <p class="mt-1.5 text-xs text-muted-foreground">
          First pick sets the lane. Later columns stay in that category and type (programs vs apps).
        </p>
      </Show>
    </div>
  );
}
