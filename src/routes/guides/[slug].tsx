import { A, useParams } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { Show } from "solid-js";
import guidePosts from "~/lib/guides-posts.generated.json";
import { SITE_NAME } from "~/lib/utils";

type Post = { slug: string; title: string; date: string; summary: string; html: string };

export default function GuideArticle() {
  const params = useParams();
  const post = () => (guidePosts.posts as Post[]).find((p) => p.slug === params.slug);

  return (
    <Show
      when={post()}
      fallback={
        <div>
          <h1 class="font-display text-2xl">Not found</h1>
          <A href="/guides">Back to guides</A>
        </div>
      }
    >
      {(p) => (
        <article class="mx-auto max-w-3xl">
          <Title>
            {p().title} · {SITE_NAME}
          </Title>
          <p class="text-xs text-muted-foreground">{p().date}</p>
          <h1 class="mt-2 font-display text-3xl font-semibold">{p().title}</h1>
          <div class="prose-adoc mt-6" innerHTML={p().html} />
        </article>
      )}
    </Show>
  );
}
