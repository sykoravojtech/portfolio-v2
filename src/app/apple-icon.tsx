import { ImageResponse } from "next/og";
import { MARK_CELLS } from "@/components/mark";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#F6F5F0", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap", width: 140 }}>
          {MARK_CELLS.map(({ r, c, on, s }) => (
            <div key={`${r}-${c}`} style={{ width: 20, height: 20, background: on ? (s ? "#E4572E" : "#15171A") : "transparent" }} />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
