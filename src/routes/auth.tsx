import { Title } from "@solidjs/meta";
import { Navigate, useNavigate, useSearchParams } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { Github } from "lucide-solid";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";
import { SITE_NAME } from "~/lib/utils";

/** Relative in-app path only (blocks open redirects). */
function safeReturnPath(raw: unknown) {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (typeof value !== "string") return "/account";
  if (!value.startsWith("/") || value.startsWith("//") || value.includes("://")) return "/account";
  return value;
}

export default function AuthPage() {
  const session = authClient.useSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = () => safeReturnPath(searchParams.next);
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [mode, setMode] = createSignal<"signin" | "signup">("signin");
  const [message, setMessage] = createSignal("");

  async function onSubmit(e: Event) {
    e.preventDefault();
    setMessage("");
    try {
      if (mode() === "signin") {
        const res = await authClient.signIn.email({ email: email(), password: password() });
        if (res.error) throw new Error(res.error.message);
      } else {
        const res = await authClient.signUp.email({
          email: email(),
          password: password(),
          name: email().split("@")[0] ?? "User",
        });
        if (res.error) throw new Error(res.error.message);
      }
      navigate(next(), { replace: true });
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Auth failed");
    }
  }

  async function github() {
    await authClient.signIn.social({ provider: "github", callbackURL: next() });
  }

  return (
    <Show when={!session().isPending} fallback={<p class="text-muted-foreground">Loading…</p>}>
      <Show when={!session().data?.user} fallback={<Navigate href={next()} />}>
        <div class="mx-auto max-w-md space-y-6">
          <Title>Sign in · {SITE_NAME}</Title>
          <h1 class="font-display text-3xl font-semibold">Sign in</h1>
          <p class="text-sm text-muted-foreground">
            Sign in to track submissions and request human verification before public notes. GitHub
            OAuth works when client credentials are configured.
          </p>
          <form class="space-y-3 rounded-lg border border-border bg-card p-6" onSubmit={onSubmit}>
            <input
              type="email"
              required
              placeholder="Email"
              class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
            />
            <input
              type="password"
              required
              minLength={8}
              placeholder="Password"
              class="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
            />
            <div class="flex gap-2">
              <Button type="submit">{mode() === "signin" ? "Sign in" : "Sign up"}</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setMode(mode() === "signin" ? "signup" : "signin")}
              >
                {mode() === "signin" ? "Need an account?" : "Have an account?"}
              </Button>
            </div>
            <Button type="button" variant="secondary" class="w-full" onClick={github}>
              <Github class="size-4 dark:text-white" />
              Continue with GitHub
            </Button>
            {message() && <p class="text-sm text-muted-foreground">{message()}</p>}
          </form>
        </div>
      </Show>
    </Show>
  );
}
