import path from "node:path";
export function mediaPath(filename: string) {
  if (!/^[a-f0-9-]+\.webp$/.test(filename))
    throw Error("Invalid media filename");
  const root = path.resolve(
    /* turbopackIgnore: true */ process.env.MEDIA_DIR || "./public/uploads",
  );
  const target = path.resolve(/* turbopackIgnore: true */ root, filename);
  if (path.dirname(target) !== root) throw Error("Invalid media path");
  return { root, target };
}
