import { Title } from "@solidjs/meta";
import { createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import { SITE_NAME } from "~/lib/utils";

export default function SubmitPage() {
  const [status, setStatus] = createSignal<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = createSignal("");

  async function onSubmit(e: Event) {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;
    if (data.absolutelyFree === "1") data.absolutelyFree = "true";
    else data.absolutelyFree = "false";
    setStatus("loading");
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          absolutelyFree: data.absolutelyFree === "true",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Submission failed");
      setStatus("ok");
      setMessage("Thanks — we will review your suggestion.");
      form.reset();
    } catch (err) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Submission failed");
    }
  }

  return (
    <div class="mx-auto max-w-xl space-y-6">
      <Title>Submit · {SITE_NAME}</Title>
      <div>
        <h1 class="font-display text-3xl font-semibold">Submit a resource</h1>
        <p class="mt-2 text-muted-foreground">
          We accept nonprofit vendor plans, DIY options, and good free/open software. Link{" "}
          <a class="text-primary underline" href="https://alternativeto.net/" target="_blank" rel="noreferrer">
            AlternativeTo
          </a>{" "}
          when helpful.
        </p>
      </div>
      <form class="space-y-4 rounded-lg border border-border bg-card p-6" onSubmit={onSubmit}>
        <Field label="Name" name="name" required />
        <Field label="Portal URL" name="portalUrl" type="url" required />
        <label class="block text-sm">
          <span class="mb-1.5 block font-medium">Category</span>
          <select name="category" class="h-10 w-full rounded-md border border-input bg-background px-3" required>
            <option value="cloud_hosting">Cloud hosting</option>
            <option value="crm">CRM</option>
            <option value="design">Design</option>
            <option value="dev_tools">Dev tools</option>
            <option value="hardware">Hardware</option>
            <option value="ai_llm">AI / LLM</option>
            <option value="productivity">Productivity</option>
            <option value="security">Security</option>
            <option value="marketing">Marketing</option>
            <option value="meta_directory">Meta directory</option>
            <option value="open_source">Open source</option>
            <option value="partner_oss">Partner OSS</option>
          </select>
        </label>
        <label class="block text-sm">
          <span class="mb-1.5 block font-medium">Offer kind</span>
          <select name="offerKind" class="h-10 w-full rounded-md border border-input bg-background px-3" required>
            <option value="nonprofit_plan">Nonprofit plan</option>
            <option value="diy">DIY option</option>
            <option value="free_oss">Free / open software</option>
            <option value="meta_directory">Meta directory</option>
          </select>
        </label>
        <label class="flex items-start gap-2 text-sm">
          <input type="checkbox" name="absolutelyFree" value="1" class="mt-1" />
          <span>
            <span class="font-medium">Absolutely free</span>
            <span class="mt-0.5 block text-muted-foreground">
              Core offer costs $0 after eligibility (not credits-only or paid discounts).
            </span>
          </span>
        </label>
        <label class="block text-sm">
          <span class="mb-1.5 block font-medium">Summary</span>
          <textarea
            name="summary"
            required
            rows={4}
            class="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </label>
        <Field label="Your email (optional)" name="submitterEmail" type="email" />
        <Button type="submit" disabled={status() === "loading"}>
          Submit for review
        </Button>
        {message() && (
          <p class={`text-sm ${status() === "err" ? "text-destructive" : "text-muted-foreground"}`}>
            {message()}
          </p>
        )}
      </form>
    </div>
  );
}

function Field(props: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label class="block text-sm">
      <span class="mb-1.5 block font-medium">{props.label}</span>
      <input
        name={props.name}
        type={props.type ?? "text"}
        required={props.required}
        class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
      />
    </label>
  );
}
