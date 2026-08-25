import { For, createSignal } from "solid-js";
import { Link, Meta, Title } from "@solidjs/meta";
import { Button } from "~/components/ui/button";
import { LogoMark } from "~/components/logo-mark";
import {
  BRAND_ASSETS,
  BRAND_COLORS,
  BRAND_DOMAIN,
  BRAND_KIT_PATH,
  BRAND_NAME,
  BRAND_SEO,
  BRAND_TAGLINE,
  BRAND_TYPE,
} from "~/lib/brand-kit";
import { SITE_URL } from "~/lib/utils";

function ColorSwatch(props: { name: string; role: string; hex: string; cssVar?: string }) {
  const [copied, setCopied] = createSignal(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(props.hex);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      type="button"
      class="group flex w-full cursor-pointer items-stretch gap-3 rounded-lg border border-border bg-card text-left transition-colors hover:border-primary/40"
      onClick={onCopy}
      title={`Copy ${props.hex}`}
    >
      <span
        class="w-16 shrink-0 self-stretch rounded-l-[7px] border-r border-border sm:w-20"
        style={{ "background-color": props.hex }}
        aria-hidden="true"
      />
      <span class="min-w-0 flex-1 py-3 pr-3">
        <span class="block font-medium text-foreground">{props.name}</span>
        <span class="mt-0.5 block text-sm text-muted-foreground">{props.role}</span>
        <span class="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-xs text-foreground/80">
          <span>{props.hex}</span>
          {props.cssVar ? <span class="text-muted-foreground">{props.cssVar}</span> : null}
          <span class="text-primary opacity-0 transition-opacity group-hover:opacity-100">
            {copied() ? "Copied" : "Copy"}
          </span>
        </span>
      </span>
    </button>
  );
}

export function BrandKitPage(props: { path?: string }) {
  const path = () => props.path ?? BRAND_KIT_PATH;
  const canonical = () => `${SITE_URL}${BRAND_KIT_PATH}`;
  const jsonLd = () =>
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: BRAND_SEO.title,
      description: BRAND_SEO.description,
      url: canonical(),
      isPartOf: { "@type": "WebSite", name: BRAND_NAME, url: SITE_URL },
      about: {
        "@type": "Organization",
        name: BRAND_NAME,
        url: SITE_URL,
        logo: `${SITE_URL}/logo.svg`,
        email: "support@nonprofit-resources.org",
      },
      keywords: BRAND_SEO.keywords,
    });

  return (
    <article class="mx-auto max-w-3xl space-y-12 pb-8">
      <Title>{BRAND_SEO.title}</Title>
      <Meta name="description" content={BRAND_SEO.description} />
      <Meta name="keywords" content={BRAND_SEO.keywords} />
      <Meta property="og:type" content="website" />
      <Meta property="og:title" content={BRAND_SEO.title} />
      <Meta property="og:description" content={BRAND_SEO.description} />
      <Meta property="og:url" content={canonical()} />
      <Meta property="og:image" content={`${SITE_URL}/logo-256.png`} />
      <Meta name="twitter:card" content="summary" />
      <Meta name="twitter:title" content={BRAND_SEO.title} />
      <Meta name="twitter:description" content={BRAND_SEO.description} />
      <Meta name="twitter:image" content={`${SITE_URL}/logo-256.png`} />
      <Link rel="canonical" href={canonical()} />
      <script type="application/ld+json">{jsonLd()}</script>

      <header class="space-y-4">
        <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Brand kit · Media kit · Press kit · Brand guidelines
        </p>
        <div class="flex flex-wrap items-center gap-4">
          <LogoMark class="size-16" />
          <div class="min-w-0">
            <h1 class="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              {BRAND_NAME} brand kit
            </h1>
            <p class="mt-1 text-lg text-muted-foreground">{BRAND_TAGLINE}</p>
          </div>
        </div>
        <p class="max-w-2xl text-sm leading-relaxed text-foreground/90">
          Official <strong>brand kit</strong>, <strong>media kit</strong>, and{" "}
          <strong>press kit</strong> for {BRAND_NAME} ({BRAND_DOMAIN}):{" "}
          <strong>logo downloads</strong> (SVG and PNG), <strong>color palette</strong>,{" "}
          <strong>typography</strong>, and <strong>brand guidelines</strong> /{" "}
          <strong>style guide</strong> for partners, journalists, and sibling OSS orgs. You are
          viewing <code class="rounded bg-muted px-1.5 py-0.5 text-xs">{path()}</code>
          {path() !== BRAND_KIT_PATH ? (
            <>
              {" "}
              — canonical URL is{" "}
              <a class="text-primary underline" href={BRAND_KIT_PATH}>
                {BRAND_KIT_PATH}
              </a>
              .
            </>
          ) : (
            "."
          )}
        </p>
        <p class="text-sm text-muted-foreground">
          New to brand kits? Read the operator guide{" "}
          <a class="text-primary underline" href="/guides/publish-a-brand-kit">
            Publish a brand kit (before someone scrapes your favicon)
          </a>{" "}
          — checklist plus examples from Wikimedia, Mozilla, GitHub, and USWDS.
        </p>
      </header>

      <section class="space-y-3" aria-labelledby="logos-heading">
        <h2 id="logos-heading" class="font-display text-xl font-semibold">
          Logos & marks
        </h2>
        <p class="text-sm text-muted-foreground">
          The giving hand offering a heart is the product mark. Prefer SVG. Keep clear space around
          the tile; do not recolor the heart away from clay or the hand away from forest without
          design review.
        </p>
        <div class="grid gap-3 sm:grid-cols-2">
          <div class="flex items-center justify-center rounded-xl border border-border bg-muted/40 p-8">
            <img src="/logo.svg" alt={`${BRAND_NAME} tiled logo`} class="size-28" />
          </div>
          <div class="flex items-center justify-center rounded-xl border border-border bg-foreground p-8">
            <img src="/logo-only.svg" alt={`${BRAND_NAME} mark on dark ground`} class="size-28" />
          </div>
        </div>
        <ul class="divide-y divide-border rounded-lg border border-border">
          <For each={BRAND_ASSETS}>
            {(asset) => (
              <li class="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div class="min-w-0">
                  <div class="font-medium text-foreground">{asset.label}</div>
                  <div class="text-sm text-muted-foreground">
                    {asset.format} · {asset.note}
                  </div>
                </div>
                <Button as="a" href={asset.href} download size="sm" variant="outline">
                  Download
                </Button>
              </li>
            )}
          </For>
        </ul>
      </section>

      <section class="space-y-3" aria-labelledby="colors-heading">
        <h2 id="colors-heading" class="font-display text-xl font-semibold">
          Color palette
        </h2>
        <p class="text-sm text-muted-foreground">
          Brand colors for the logo lockup and UI tokens. Click a swatch to copy the hex — handy for
          Canva brand kits, Adobe Express libraries, and slide decks.
        </p>
        <div class="grid gap-2 sm:grid-cols-2">
          <For each={BRAND_COLORS}>{(c) => <ColorSwatch {...c} />}</For>
        </div>
      </section>

      <section class="space-y-3" aria-labelledby="type-heading">
        <h2 id="type-heading" class="font-display text-xl font-semibold">
          Typography
        </h2>
        <p class="text-sm text-muted-foreground">{BRAND_TYPE.roles}</p>
        <p class="font-display text-2xl font-semibold tracking-tight">{BRAND_TYPE.family}</p>
        <p class="font-mono text-xs text-muted-foreground">{BRAND_TYPE.stack}</p>
        <a
          class="inline-flex cursor-pointer text-sm text-primary underline"
          href={BRAND_TYPE.source}
          target="_blank"
          rel="noreferrer"
        >
          Plus Jakarta Sans on Google Fonts
        </a>
      </section>

      <section class="space-y-3" aria-labelledby="name-heading">
        <h2 id="name-heading" class="font-display text-xl font-semibold">
          Name & voice
        </h2>
        <ul class="list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90">
          <li>
            Prefer <strong>{BRAND_NAME}</strong> in full on first mention;{" "}
            <strong>{BRAND_DOMAIN}</strong> for the site.
          </li>
          <li>Plain language for operators — verification notes, seat caps, broker tokens.</li>
          <li>No fake urgency, no “AI-washed” purple gradients, no stock nonprofit clichés.</li>
          <li>
            Sibling OSS (DevCentr, OpenShellOrg, HCI Nerdz, linx.photos, InstaLay) stay attributed in
            the footer — they are partners, not the brand.
          </li>
        </ul>
      </section>

      <section class="space-y-3" aria-labelledby="usage-heading">
        <h2 id="usage-heading" class="font-display text-xl font-semibold">
          Usage
        </h2>
        <ul class="list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/90">
          <li>Use the mark to link to {BRAND_DOMAIN} or to credit catalog data / screenshots.</li>
          <li>Do not imply endorsement of a vendor offer we merely list.</li>
          <li>Do not stretch, add drop shadows, or place the mark on busy photography without a plate.</li>
          <li>
            Questions:{" "}
            <a class="text-primary underline" href="mailto:support@nonprofit-resources.org">
              support@nonprofit-resources.org
            </a>{" "}
            (subject: Brand / Press).
          </li>
        </ul>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          class="mt-2"
          onClick={() => void navigator.clipboard?.writeText(canonical())}
        >
          Copy brand kit URL
        </Button>
      </section>
    </article>
  );
}
