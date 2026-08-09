import type { ComponentProps } from "solid-js";
import { cn } from "~/lib/utils";

export function LogoMark(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
      class={cn("size-8", props.class)}
    >
      <rect x="4" y="8" width="56" height="48" rx="10" class="fill-primary/15 stroke-primary" stroke-width="2" />
      <path
        d="M16 40V24h8.5c5 0 8 2.6 8 7s-3 7-8 7H22v2h-6zm6-12v8h2.2c2.8 0 4.3-1.3 4.3-4s-1.5-4-4.3-4H22zM36 40V24h14v5h-8v2.5h7.2v4.5H42V40h-6z"
        class="fill-primary"
      />
      <circle cx="50" cy="16" r="5" class="fill-accent" />
    </svg>
  );
}
