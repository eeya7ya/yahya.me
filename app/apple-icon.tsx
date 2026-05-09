import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #FDF6E3 0%, #F5B26B 100%)",
          color: "#9A4A0F",
          fontSize: 130,
          fontWeight: 800,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Y
      </div>
    ),
    { ...size },
  );
}
