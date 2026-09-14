import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function optimizeImage(input: Buffer) {
  const images = getCloudflareContext().env.IMAGES;
  if (!images) throw Error("Cloudflare Images binding is required");
  const stream = () => new Blob([new Uint8Array(input)]).stream();
  const metadata = await images.info(stream());
  if (
    !("width" in metadata) ||
    !["image/jpeg", "image/png", "image/webp"].includes(metadata.format) ||
    metadata.width * metadata.height > 40000000
  )
    throw Error("Invalid image format or dimensions");
  const result = await images
    .input(stream())
    .transform({ width: 2400, height: 2400, fit: "scale-down" })
    .output({ format: "image/webp", quality: 84, anim: false });
  const data = Buffer.from(await result.response().arrayBuffer());
  const output = await images.info(new Blob([new Uint8Array(data)]).stream());
  if (!("width" in output)) throw Error("Invalid output image");
  return {
    data,
    info: { width: output.width, height: output.height, size: data.length },
  };
}
