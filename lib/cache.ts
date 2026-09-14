import { revalidateTag } from "next/cache";
export function refreshContent() {
  revalidateTag("cms", { expire: 0 });
}
