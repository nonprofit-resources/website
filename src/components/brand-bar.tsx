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
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <A href="/" class="flex items-center gap-2.5 no-underline">
          <LogoMark class="size-9 text-primary" />
          <span class="font-display text-lg font-semibold tracking-tight text-foreground">
            {SITE_NAME}
          </span>
        </A>
        <div class="flex items-center gap-2 sm:gap-3">
          <LocaleSwitcher />
          <ThemeToggle />
          <a
            href={GITHUB_ORG}
            target="_blank"
            rel="noreferrer"
            class="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="GitHub organization"
          >
            <Github class="size-5" />
          </a>
          <A
            href="/auth"
            class="hidden text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline sm:inline"
          >
            {t("nav_account")}
          </A>
        </div>
      </div>
    </div>
  );
}
