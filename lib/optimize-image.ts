import sharp from "sharp";

export async function optimizeImage(input: Buffer) {
  const metadata = await sharp(input, {
    limitInputPixels: 40000000,
  }).metadata();
  if (!["jpeg", "png", "webp"].includes(metadata.format || ""))
    throw Error("Invalid image format");
  return sharp(input, { limitInputPixels: 40000000 })
    .rotate()
    .resize({
      width: 2400,
      height: 2400,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 84 })
    .toBuffer({ resolveWithObject: true });
}
