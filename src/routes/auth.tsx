import { Title } from "@solidjs/meta";
import { createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import { authClient } from "~/lib/auth-client";
import { SITE_NAME } from "~/lib/utils";

export default function AuthPage() {
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
        setMessage("Signed in.");
      } else {
        const res = await authClient.signUp.email({
          email: email(),
          password: password(),
          name: email().split("@")[0] ?? "User",
        });
        if (res.error) throw new Error(res.error.message);
        setMessage("Account created.");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Auth failed");
    }
  }

  async function github() {
    await authClient.signIn.social({ provider: "github", callbackURL: "/" });
  }

  return (
    <div class="mx-auto max-w-md space-y-6">
      <Title>Account · {SITE_NAME}</Title>
      <h1 class="font-display text-3xl font-semibold">Account</h1>
      <p class="text-sm text-muted-foreground">
        Sign in to track submissions. GitHub OAuth works when client credentials are configured.
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
          Continue with GitHub
        </Button>
        {message() && <p class="text-sm text-muted-foreground">{message()}</p>}
      </form>
    </div>
  );
}
