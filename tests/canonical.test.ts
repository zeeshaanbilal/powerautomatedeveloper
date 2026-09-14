import test from "node:test";
import assert from "node:assert/strict";
import { canonicalAfterRename } from "../lib/canonical";
const seo = {
  title: "A page",
  description: "Description",
  canonical: "https://powerautomatedeveloper.com/old-page/",
};
test("Renaming a self-canonical page updates the canonical to its new path", () => {
  assert.equal(
    canonicalAfterRename(seo, "old-page", "new-page").canonical,
    "https://powerautomatedeveloper.com/new-page/",
  );
});
test("An intentional canonical override survives a path change", () => {
  assert.equal(
    canonicalAfterRename(seo, "another-page", "new-page").canonical,
    seo.canonical,
  );
});
