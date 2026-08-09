import { A } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { For, Show } from "solid-js";
import { SubscribeForm } from "~/components/subscribe-form";
import newsPosts from "~/lib/news-posts.generated.json";
import { SITE_NAME } from "~/lib/utils";

export default function NewsIndex() {
  return (
    <div class="space-y-8">
      <Title>News · {SITE_NAME}</Title>
      <div>
        <h1 class="font-display text-3xl font-semibold">News</h1>
        <p class="mt-1 text-muted-foreground">Updates about the catalog and the nonprofit tooling landscape.</p>
      </div>
      <SubscribeForm />
      <ul class="space-y-4">
        <For each={newsPosts.posts as { slug: string; title: string; date: string; summary: string }[]}>
          {(post) => (
            <li class="rounded-lg border border-border bg-card p-5">
              <A href={`/news/${post.slug}`} class="font-display text-xl font-semibold text-foreground no-underline hover:underline">
                {post.title}
              </A>
              <p class="mt-1 text-xs text-muted-foreground">{post.date}</p>
              <p class="mt-2 text-sm text-muted-foreground">{post.summary}</p>
            </li>
          )}
        </For>
      </ul>
      <Show when={(newsPosts.posts as unknown[]).length === 0}>
        <p class="text-muted-foreground">No news yet.</p>
      </Show>
    </div>
  );
}
