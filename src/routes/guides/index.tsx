import { A } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { For, Show } from "solid-js";
import guidePosts from "~/lib/guides-posts.generated.json";
import { SITE_NAME } from "~/lib/utils";

export default function GuidesIndex() {
  return (
    <div class="space-y-8">
      <Title>Guides · {SITE_NAME}</Title>
      <div>
        <h1 class="font-display text-3xl font-semibold">Guides</h1>
        <p class="mt-1 text-muted-foreground">
          Operator docs: fundraising patterns, vendor discounts, and how to run a donation-supported org
          without hiding the books.
        </p>
      </div>
      <ul class="space-y-4">
        <For each={guidePosts.posts as { slug: string; title: string; date: string; summary: string }[]}>
          {(post) => (
            <li class="rounded-lg border border-border bg-card p-5">
              <A
                href={`/guides/${post.slug}`}
                class="font-display text-xl font-semibold text-foreground no-underline hover:underline"
              >
                {post.title}
              </A>
              <p class="mt-1 text-xs text-muted-foreground">{post.date}</p>
              <p class="mt-2 text-sm text-muted-foreground">{post.summary}</p>
            </li>
          )}
        </For>
      </ul>
      <Show when={(guidePosts.posts as unknown[]).length === 0}>
        <p class="text-muted-foreground">No guides yet.</p>
      </Show>
    </div>
  );
}
