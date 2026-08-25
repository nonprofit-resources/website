import { Title } from "@solidjs/meta";
import { SITE_NAME } from "~/lib/utils";

export default function AttributionsPage() {
  return (
    <article class="mx-auto max-w-3xl space-y-4">
      <Title>Attributions · {SITE_NAME}</Title>
      <h1 class="font-display text-3xl font-semibold">Attributions</h1>
      <ul class="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
        <li>SolidJS / SolidStart — MIT</li>
        <li>Kobalte — MIT</li>
        <li>Lucide icons — ISC</li>
        <li>Better Auth, Drizzle ORM, libSQL/Turso clients — their respective licenses</li>
        <li>Service preview images captured from public marketing pages where permitted</li>
        <li>Seed catalog inspired by public nonprofit portals and community awesome-lists</li>
        <li>
          OSS.Fund directory data (CC BY 4.0) —{" "}
          <a class="underline" href="https://www.oss.fund/" target="_blank" rel="noreferrer">
            oss.fund
          </a>
          ; source{" "}
          <a class="underline" href="https://github.com/oss-fund/directory" target="_blank" rel="noreferrer">
            github.com/oss-fund/directory
          </a>
        </li>
        <li>
          Analyze Queue screenshot © Transparency HOA — used as a cited example on the transparent
          fund-ask guide; source{" "}
          <a class="underline" href="https://www.transparencyhoa.org/analyze-queue">
            transparencyhoa.org/analyze-queue
          </a>
        </li>
      </ul>
    </article>
  );
}
