import { A, useLocation } from "@solidjs/router";
import { For } from "solid-js";
import { useI18n } from "~/lib/i18n";
import { cn } from "~/lib/utils";

export function StickyNav() {
  const { t } = useI18n();
  const location = useLocation();
  const items = () => [
    { href: "/", label: t("nav_home") },
    { href: "/services", label: t("nav_services") },
    { href: "/news", label: t("nav_news") },
    { href: "/blog", label: t("nav_blog") },
    { href: "/submit", label: t("nav_submit") },
  ];

  return (
    <nav
      class="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md"
      aria-label="Primary"
    >
      <div class="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
        <For each={items()}>
          {(item) => {
            const active =
              item.href === "/"
                ? location.pathname === "/"
                : location.pathname.startsWith(item.href);
            return (
              <A
                href={item.href}
                class={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
                  active
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {item.label}
              </A>
            );
          }}
        </For>
      </div>
    </nav>
  );
}
