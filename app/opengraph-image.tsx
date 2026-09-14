import { ImageResponse } from "next/og";
export const runtime = "nodejs";
export const alt =
  "HashTurn — Power Automate developers and automation specialists";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        background: "#101e38",
        color: "white",
        width: "100%",
        height: "100%",
        padding: 80,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ fontSize: 38, display: "flex" }}>
        HASHTURN<span style={{ color: "#75b5ff" }}>.</span>
      </div>
      <div
        style={{
          fontSize: 78,
          letterSpacing: -3,
          lineHeight: 1.08,
          display: "flex",
          maxWidth: 940,
        }}
      >
        Your processes. Connected.
      </div>
      <div style={{ display: "flex", fontSize: 27, color: "#b7d3ff" }}>
        Power Automate developers & automation specialists ↗
      </div>
    </div>,
    size,
  );
}
