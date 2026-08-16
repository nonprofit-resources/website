import { A } from "@solidjs/router";
import { LogoMark } from "~/components/logo-mark";
import { useI18n } from "~/lib/i18n";
import { SITE_NAME, SUPPORT_EMAIL } from "~/lib/utils";

const footLink =
  "text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline";

export function SiteFooter() {
  const { t } = useI18n();
  const year = new Date().getFullYear();
  return (
    <footer class="mx-auto mt-12 max-w-6xl px-4 pb-12 sm:px-6">
      <div class="flex flex-col gap-7 border-t border-border/70 pt-7 sm:flex-row sm:items-start sm:justify-between">
        <div class="max-w-xs">
          <div class="flex items-center gap-2.5">
            <LogoMark class="size-7 text-primary" />
            <span class="font-display text-sm font-semibold tracking-tight">{SITE_NAME}</span>
          </div>
          <p class="mt-2.5 text-sm leading-relaxed text-muted-foreground">
            Cataloguing nonprofit plans, DIY options, and free software. Operated by{" "}
            <a class={footLink} href="https://ryanjohnson.dev" target="_blank" rel="noreferrer">
              Ryan Johnson
            </a>{" "}
            (AMDphreak) pending a formal nonprofit entity.
          </p>
          <p class="mt-2 text-sm">
            <a class={footLink} href={`mailto:${SUPPORT_EMAIL}`}>
              {SUPPORT_EMAIL}
            </a>
          </p>
        </div>
        <div class="flex flex-wrap gap-x-8 gap-y-5 text-[11px] font-medium uppercase tracking-[0.16em]">
          <nav class="flex flex-col gap-2" aria-label={t("footer_product")}>
            <span class="text-muted-foreground/70">{t("footer_product")}</span>
            <A href="/services" class={footLink}>
              Services
            </A>
            <A href="/news" class={footLink}>
              News
            </A>
            <A href="/guides" class={footLink}>
              Guides
            </A>
            <A href="/blog" class={footLink}>
              Blog
            </A>
            <A href="/submit" class={footLink}>
              Submit
            </A>
            <A href="/compare" class={footLink}>
              Compare
            </A>
            <A href="/services?oss=1" class={footLink}>
              Open source
            </A>
            <a href="https://www.oss.fund/" class={footLink} target="_blank" rel="noreferrer">
              OSS.Fund
            </a>
            <a href="/api/catalog" class={footLink}>
              Catalog API
            </a>
            <A href="/account" class={footLink}>
              Account
            </A>
          </nav>
          <nav class="flex flex-col gap-2" aria-label={t("footer_legal")}>
            <span class="text-muted-foreground/70">{t("footer_legal")}</span>
            <A href="/privacy" class={footLink}>
              Privacy
            </A>
            <A href="/terms" class={footLink}>
              Terms
            </A>
            <A href="/support" class={footLink}>
              Support
            </A>
            <A href="/attributions" class={footLink}>
              Attributions
            </A>
          </nav>
          <nav class="flex flex-col gap-2" aria-label={t("footer_related")}>
            <span class="text-muted-foreground/70">{t("footer_related")}</span>
            <a href="https://devcentr.org" class={footLink} target="_blank" rel="noreferrer">
              DevCentr
            </a>
            <a href="https://openshellorg.github.io/" class={footLink} target="_blank" rel="noreferrer">
              OpenShellOrg
            </a>
            <a href="https://hci-nerdz.github.io/" class={footLink} target="_blank" rel="noreferrer">
              HCI Nerdz
            </a>
            <a href="https://linx.photos/" class={footLink} target="_blank" rel="noreferrer">
              linx.photos
            </a>
            <a
              href="https://github.com/LinxPhotos/InstaLay"
              class={footLink}
              target="_blank"
              rel="noreferrer"
            >
              InstaLay
            </a>
            <a
              href="https://github.com/antora-supplemental"
              class={footLink}
              target="_blank"
              rel="noreferrer"
            >
              antora-supplemental
            </a>
            <a
              href="https://github.com/dlang-supplemental"
              class={footLink}
              target="_blank"
              rel="noreferrer"
            >
              dlang-supplemental
            </a>
          </nav>
        </div>
      </div>
      <p class="mt-7 text-xs text-muted-foreground">© {year} {SITE_NAME}</p>
    </footer>
  );
}
