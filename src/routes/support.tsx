import { Title } from "@solidjs/meta";
import { SITE_NAME, SUPPORT_EMAIL } from "~/lib/utils";

export default function SupportPage() {
  return (
    <article class="mx-auto max-w-3xl space-y-4">
      <Title>Support · {SITE_NAME}</Title>
      <h1 class="font-display text-3xl font-semibold">Support</h1>
      <p class="text-muted-foreground">
        Email <a class="text-primary underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
        Useful subject keywords: Catalog, Partnerships, Bug, Privacy, PR.
      </p>
      <ul class="list-disc space-y-2 pl-5 text-sm">
        <li>
          Browse and contribute on{" "}
          <a class="text-primary underline" href="https://github.com/nonprofit-resources">
            GitHub
          </a>
        </li>
        <li>
          Suggest a listing via <a class="text-primary underline" href="/submit">/submit</a>
        </li>
      </ul>
    </article>
  );
}
