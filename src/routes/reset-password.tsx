import { Title } from "@solidjs/meta";
import { A, useNavigate, useSearchParams } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";
import { SITE_NAME } from "~/lib/utils";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const token = () => (typeof params.token === "string" ? params.token : "");
  const expired = () => params.error === "INVALID_TOKEN" || !token();
  const [password, setPassword] = createSignal("");
  const [confirm, setConfirm] = createSignal("");
  const [error, setError] = createSignal("");
  const [busy, setBusy] = createSignal(false);

  async function onSubmit(e: Event) {
    e.preventDefault();
    if (password().length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password() !== confirm()) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    setError("");
    const { error: resetError } = await authClient.resetPassword({ newPassword: password(), token: token() });
    setBusy(false);
    if (resetError) {
      setError("This reset link is invalid or has expired. Request a new one.");
      return;
    }
    navigate("/auth?reset=done", { replace: true });
  }

  return (
    <div class="mx-auto max-w-md space-y-6">
      <Title>Reset password · {SITE_NAME}</Title>
      <h1 class="font-display text-3xl font-semibold">Reset password</h1>
      <Show
        when={!expired()}
        fallback={<p class="text-sm">This reset link is invalid or has expired. <A href="/auth">Request a new one</A>.</p>}
      >
        <form class="space-y-3 rounded-lg border border-border bg-card p-6" onSubmit={onSubmit}>
          <input type="password" required minLength={8} placeholder="New password" autocomplete="new-password" class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={password()} onInput={(e) => setPassword(e.currentTarget.value)} />
          <input type="password" required minLength={8} placeholder="Confirm" autocomplete="new-password" class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={confirm()} onInput={(e) => setConfirm(e.currentTarget.value)} />
          <Show when={error()}><p class="text-sm text-muted-foreground" role="alert">{error()}</p></Show>
          <Button type="submit" disabled={busy()}>{busy() ? "Saving…" : "Save password"}</Button>
        </form>
      </Show>
    </div>
  );
}
