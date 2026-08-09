import { Title } from "@solidjs/meta";
import { SITE_NAME, SUPPORT_EMAIL } from "~/lib/utils";

export default function TermsPage() {
  return (
    <article class="prose-adoc mx-auto max-w-3xl space-y-4">
      <Title>Terms · {SITE_NAME}</Title>
      <h1 class="font-display text-3xl font-semibold">Terms of use</h1>
      <p>
        Catalog entries are informational. Vendor offers change; always verify eligibility and terms
        on the provider’s portal before applying.
      </p>
      <p>
        Submissions must be truthful and lawful. We may edit, reject, or remove listings at our
        discretion.
      </p>
      <p>
        Questions: <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>
    </article>
  );
}
