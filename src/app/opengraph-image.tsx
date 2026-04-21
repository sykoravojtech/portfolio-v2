import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Vojtěch Sýkora — AI Engineer & Product Builder";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#123624",
          color: "#D8D0C2",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
        }}
      >
        <div
          style={{
            fontSize: 20,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            color: "rgba(216, 208, 194, 0.6)",
            marginBottom: 32,
            display: "flex",
          }}
        >
          Prague · AI Engineer & Product Builder
        </div>
        <div
          style={{
            fontSize: 108,
            fontWeight: 900,
            letterSpacing: "-0.035em",
            lineHeight: 1.02,
            marginBottom: 32,
            display: "flex",
          }}
        >
          Vojtěch Sýkora
        </div>
        <div
          style={{
            fontSize: 32,
            color: "rgba(216, 208, 194, 0.75)",
            maxWidth: 900,
            lineHeight: 1.3,
            display: "flex",
          }}
        >
          I build tools I wish existed.
        </div>
      </div>
    ),
    { ...size }
  );
}
