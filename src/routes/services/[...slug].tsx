import { Show } from "solid-js";
import { useLocation, useParams } from "@solidjs/router";
import {
  OfferingCanonicalRedirect,
  OfferingDetail,
  OfferingNotFound,
} from "~/components/offering-detail";
import { pathParts, resolveServicePath } from "~/lib/services-seed";

export default function ServicePathPage() {
  const params = useParams();
  const location = useLocation();
  const resolved = () => resolveServicePath(pathParts(params.slug));

  return (
    <Show when={resolved().service} fallback={<OfferingNotFound />}>
      {(s) => (
        <Show
          when={!resolved().canonical || resolved().canonical === location.pathname}
          fallback={<OfferingCanonicalRedirect href={resolved().canonical ?? "/services"} />}
        >
          <OfferingDetail service={s()} parent={resolved().parent} />
        </Show>
      )}
    </Show>
  );
}
