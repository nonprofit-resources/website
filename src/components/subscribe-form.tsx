import { createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import { useI18n } from "~/lib/i18n";

export function SubscribeForm() {
  const { t } = useI18n();
  const [email, setEmail] = createSignal("");
  const [status, setStatus] = createSignal<"idle" | "loading" | "ok" | "err">("idle");
  const [message, setMessage] = createSignal("");

  async function onSubmit(e: Event) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Subscribe failed");
      setStatus("ok");
      setMessage(
        data.mocked ? "Subscribed (dev mode — email provider is not configured)." : "You are subscribed.",
      );
      setEmail("");
    } catch (err) {
      setStatus("err");
      setMessage(err instanceof Error ? err.message : "Subscribe failed");
    }
  }

  return (
    <form
      class="flex flex-col gap-3 rounded-lg border border-border bg-card/80 p-5 sm:flex-row sm:items-end"
      onSubmit={onSubmit}
    >
      <div class="flex-1">
        <label class="mb-1.5 block text-sm font-medium" for="news-email">
          {t("subscribe_title")}
        </label>
        <input
          id="news-email"
          type="email"
          required
          value={email()}
          onInput={(e) => setEmail(e.currentTarget.value)}
          placeholder={t("subscribe_placeholder")}
          class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <Button type="submit" disabled={status() === "loading"}>
        {t("subscribe_button")}
      </Button>
      {message() && (
        <p class={`text-sm sm:basis-full ${status() === "err" ? "text-destructive" : "text-muted-foreground"}`}>
          {message()}
        </p>
      )}
    </form>
  );
}
