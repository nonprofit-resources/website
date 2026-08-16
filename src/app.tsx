import { MetaProvider, Title } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { BrandBar } from "~/components/brand-bar";
import { CompareTray } from "~/components/compare-tray";
import { SiteFooter } from "~/components/site-footer";
import { StickyNav } from "~/components/site-nav";
import { I18nProvider } from "~/lib/i18n";
import { ThemeProvider } from "~/lib/theme";
import { SITE_NAME } from "~/lib/utils";
import "./app.css";

export default function App() {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <Title>{SITE_NAME}</Title>
          <ThemeProvider>
            <I18nProvider>
              <div class="flex min-h-screen flex-col">
                <BrandBar />
                <StickyNav />
                <main class="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
                  <Suspense fallback={<div class="text-muted-foreground">Loading…</div>}>
                    {props.children}
                  </Suspense>
                </main>
                <SiteFooter />
              </div>
              <CompareTray />
            </I18nProvider>
          </ThemeProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
