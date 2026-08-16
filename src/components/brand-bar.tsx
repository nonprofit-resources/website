import { A } from "@solidjs/router";
import { Github } from "lucide-solid";
import { LogoMark } from "~/components/logo-mark";
import { LocaleSwitcher } from "~/components/locale-switcher";
import { ThemeToggle } from "~/components/theme-toggle";
import { useI18n } from "~/lib/i18n";
import { GITHUB_ORG, SITE_NAME } from "~/lib/utils";

export function BrandBar() {
  const { t } = useI18n();
  return (
    <div class="border-b border-border/70 bg-background/80 backdrop-blur-md">
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:px-6">
        <A href="/" class="flex items-center gap-2 no-underline">
          <LogoMark class="size-8 text-primary" />
          <span class="font-display text-base font-semibold tracking-tight text-foreground sm:text-lg">
            {SITE_NAME}
          </span>
        </A>
        <div class="flex items-center gap-1.5 sm:gap-2.5">
          <LocaleSwitcher />
          <ThemeToggle />
          <a
            href={GITHUB_ORG}
            target="_blank"
            rel="noreferrer"
            class="inline-flex size-10 items-center justify-center rounded-md text-foreground transition-colors hover:bg-muted dark:text-white"
            aria-label="GitHub organization"
          >
            <Github class="size-5" />
          </a>
          <A
          href="/account"
          class="hidden text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:inline"
        >
          {t("nav_account")}
        </A>
        </div>
      </div>
    </div>
  );
}
