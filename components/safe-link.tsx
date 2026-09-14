import NextLink from "next/link";
import { getPublished, publicPath } from "@/lib/content";
import type { ComponentProps } from "react";
export default async function SafeLink(props: ComponentProps<typeof NextLink>) {
  const href =
    typeof props.href === "string" ? props.href : props.href.pathname || "/";
  if (href.startsWith("/") && !href.startsWith("//")) {
    const path = href.split(/[?#]/)[0];
    if (
      !(await getPublished()).some(
        (e) =>
          !["FAQ", "TESTIMONIAL"].includes(e.kind) &&
          publicPath(e.slug) === (path.endsWith("/") ? path : path + "/"),
      )
    )
      return null;
  }
  return <NextLink {...props} />;
}
