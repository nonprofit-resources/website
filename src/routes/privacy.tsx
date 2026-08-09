import { Title } from "@solidjs/meta";
import { SUPPORT_EMAIL, SITE_NAME } from "~/lib/utils";

export default function PrivacyPage() {
  return (
    <article class="prose-adoc mx-auto max-w-3xl space-y-4">
      <Title>Privacy · {SITE_NAME}</Title>
      <h1 class="font-display text-3xl font-semibold">Privacy</h1>
      <p>
        We collect account emails (Better Auth), newsletter addresses (Customer.io), and voluntary
        resource submissions. We do not sell personal data.
      </p>
      <p>
        Analytics, if enabled later, will be disclosed here. Cookie use is limited to session and
        preference storage (theme, locale).
      </p>
      <p>
        To request deletion or help, email{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> with subject “Privacy”.
      </p>
    </article>
  );
}
