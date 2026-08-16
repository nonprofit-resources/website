import { A } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { ServiceGrid } from "~/components/service-views";
import { SubscribeForm } from "~/components/subscribe-form";
import { Button } from "~/components/ui/button";
import { useI18n } from "~/lib/i18n";
import { servicesSeed } from "~/lib/services-seed";
import { SITE_NAME } from "~/lib/utils";

export default function Home() {
  const { t } = useI18n();
  const featured = servicesSeed.filter((s) => s.featured && s.listingKind !== "app");
  return (
    <div class="space-y-10">
      <Title>{SITE_NAME}</Title>
      <section class="relative overflow-hidden rounded-2xl border border-border/60 bg-card/50 px-5 py-10 sm:px-9 sm:py-12">
        <div
          class="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "linear-gradient(135deg, hsl(158 42% 28% / 0.18), transparent 45%), linear-gradient(225deg, hsl(18 62% 48% / 0.14), transparent 40%)",
          }}
        />
        <div class="relative max-w-2xl">
          <p class="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {SITE_NAME}
          </p>
          <h1 class="mt-3 text-lg font-medium text-foreground/90 sm:text-xl">{t("hero_title")}</h1>
          <p class="mt-2 text-sm text-muted-foreground sm:text-base">{t("hero_sub")}</p>
          <div class="mt-6 flex flex-wrap items-center gap-2.5">
            <div class="inline-flex overflow-hidden rounded-md" role="group" aria-label="Browse catalog">
              <A
                href="/services"
                class="inline-flex h-11 items-center justify-center bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t("cta_browse")}
              </A>
              <A
                href="/services?free=1"
                class="inline-flex h-11 items-center justify-center border-l border-primary-foreground/25 bg-primary/75 px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/65 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {t("cta_browse_free")}
              </A>
            </div>
            <A href="/services?oss=1">
              <Button size="lg" variant="outline">
                {t("cta_oss")}
              </Button>
            </A>
            <A href="/submit">
              <Button
                size="lg"
                variant="outline"
                class="border-accent text-accent hover:bg-accent hover:text-accent-foreground"
              >
                {t("cta_submit")}
              </Button>
            </A>
          </div>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="font-display text-xl font-semibold tracking-tight">Featured</h2>
        <ServiceGrid services={featured} />
      </section>

      <SubscribeForm />
    </div>
  );
}
