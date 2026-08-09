import { A } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { For, Show } from "solid-js";
import blogPosts from "~/lib/blog-posts.generated.json";
import { SITE_NAME } from "~/lib/utils";

export default function BlogIndex() {
  return (
    <div class="space-y-8">
      <Title>Blog · {SITE_NAME}</Title>
      <div>
        <h1 class="font-display text-3xl font-semibold">Blog</h1>
        <p class="mt-1 text-muted-foreground">Guides and longer-form notes for nonprofit operators.</p>
      </div>
      <ul class="space-y-4">
        <For each={blogPosts.posts as { slug: string; title: string; date: string; summary: string }[]}>
          {(post) => (
            <li class="rounded-lg border border-border bg-card p-5">
              <A
                href={`/blog/${post.slug}`}
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
      <Show when={(blogPosts.posts as unknown[]).length === 0}>
        <p class="text-muted-foreground">No posts yet.</p>
      </Show>
    </div>
  );
}
