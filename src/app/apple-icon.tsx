import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#123624",
          color: "#D8D0C2",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 92,
          fontWeight: 900,
          letterSpacing: "-0.04em",
        }}
      >
        VS
      </div>
    ),
    { ...size }
  );
}
