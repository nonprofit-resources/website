import { A } from "@solidjs/router";
import { For } from "solid-js";
import { useI18n } from "~/lib/i18n";

export function StickyNav() {
  const { t } = useI18n();
  const items = () => [
    { href: "/", label: t("nav_home"), end: true },
    { href: "/services", label: t("nav_services"), end: false },
    { href: "/compare", label: t("nav_compare"), end: true },
    { href: "/news", label: t("nav_news"), end: false },
    { href: "/guides", label: t("nav_guides"), end: false },
    { href: "/blog", label: t("nav_blog"), end: false },
    { href: "/submit", label: t("nav_submit"), end: true },
  ];

  return (
    <nav
      class="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md"
      aria-label="Primary"
    >
      <div class="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-4 py-2 sm:px-6">
        <For each={items()}>
          {(item) => (
            <A
              href={item.href}
              end={item.end}
              activeClass="bg-primary/15 text-primary"
              inactiveClass="text-muted-foreground hover:bg-muted hover:text-foreground"
              class="rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors"
            >
              {item.label}
            </A>
          )}
        </For>
      </div>
    </nav>
  );
}
