import type { ComponentProps } from "solid-js";
import { cn } from "~/lib/utils";

/** Giving hand offering a heart — matches public/logo.svg */
export function LogoMark(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 128 128"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      {...props}
      class={cn("size-8", props.class)}
    >
      <rect width="128" height="128" rx="28" class="fill-muted" />
      <path
        class="fill-accent"
        stroke="#F7F4EC"
        stroke-width="2"
        stroke-linejoin="round"
        d="M64 22c-1.6-3.6-7.2-9.4-14-9.4C41.6 12.6 36 18.4 36 25.4c0 11.6 13.2 20.6 28 31.2 14.8-10.6 28-19.6 28-31.2 0-7-5.6-12.8-14-12.8C71.2 12.6 65.6 18.4 64 22z"
      />
      <g opacity="0.35" transform="translate(2.5 3)">
        <path
          class="fill-primary"
          d="M40 84c0-6.6 5.4-12 12-12h36c6.6 0 12 5.4 12 12v8c0 5.5-4.5 10-10 10H50c-5.5 0-10-4.5-10-10v-8z"
        />
      </g>
      <g class="stroke-[#F7F4EC] dark:stroke-black">
        <path
          class="fill-primary"
          stroke-width="2"
          stroke-linejoin="round"
          d="M40 84c0-6.6 5.4-12 12-12h36c6.6 0 12 5.4 12 12v8c0 5.5-4.5 10-10 10H50c-5.5 0-10-4.5-10-10v-8z"
        />
        <path
          class="fill-primary"
          stroke-width="2"
          stroke-linejoin="round"
          d="M30 78c0-5 4-9 9-9h5c3.3 0 6 2.7 6 6v16c0 2.8-2.2 5-5 5h-4c-6.1 0-11-4.9-11-11V78z"
        />
        <rect x="48" y="54" width="10" height="28" rx="5" class="fill-primary" stroke-width="2" />
        <rect x="61" y="50" width="10" height="32" rx="5" class="fill-primary" stroke-width="2" />
        <rect x="74" y="52" width="10" height="30" rx="5" class="fill-primary" stroke-width="2" />
        <rect x="87" y="56" width="10" height="26" rx="5" class="fill-primary" stroke-width="2" />
        <path stroke-width="1.8" stroke-linecap="round" d="M50.5 64h5M63.5 62h5M76.5 63h5M89.5 65h5" />
        <path stroke-width="1.8" stroke-linecap="round" d="M50 80c8 4 22 4 30 0" />
      </g>
    </svg>
  );
}
