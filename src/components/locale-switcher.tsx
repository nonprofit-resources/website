import { For } from "solid-js";
import { LOCALES, useI18n, type Locale } from "~/lib/i18n";
import { cn } from "~/lib/utils";

export function LocaleSwitcher() {
  const { locale, setLocale } = useI18n();
  return (
    <div class="inline-flex items-center gap-0.5 rounded-md border border-border bg-card/60 p-0.5 text-xs font-medium">
      <For each={LOCALES}>
        {(item) => (
          <button
            type="button"
            class={cn(
              "rounded px-2 py-1 transition-colors",
              locale() === item.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
            onClick={() => setLocale(item.id as Locale)}
          >
            {item.label}
          </button>
        )}
      </For>
    </div>
  );
}
