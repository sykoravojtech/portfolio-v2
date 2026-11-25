import { ImageResponse } from "next/og";
import { MARK_CELLS } from "@/components/mark";

export const dynamic = "force-static";
export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", background: "#15171A", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ display: "flex", flexWrap: "wrap", width: 21 }}>
          {MARK_CELLS.map(({ r, c, on, s }) => (
            <div key={`${r}-${c}`} style={{ width: 3, height: 3, background: on ? (s ? "#FF6B3D" : "#F6F5F0") : "transparent" }} />
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
