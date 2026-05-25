import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Yahya Khaled — Electrical Power & Machines Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background:
            "linear-gradient(135deg, #FDF6E3 0%, #FCE7B8 55%, #F5B26B 100%)",
          fontFamily: "Inter, system-ui, sans-serif",
          color: "#2A1B0E",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: 999,
              background: "#D9701A",
              boxShadow: "0 0 0 8px rgba(217,112,26,0.15)",
            }}
          />
          <span
            style={{
              fontSize: 22,
              letterSpacing: 6,
              textTransform: "uppercase",
              color: "#9A4A0F",
              fontWeight: 600,
            }}
          >
            yahyakhaled.com
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span
            style={{
              fontSize: 28,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#9A4A0F",
              fontWeight: 600,
            }}
          >
            Hello, I&apos;m
          </span>
          <span style={{ fontSize: 140, fontWeight: 800, lineHeight: 1, letterSpacing: -3 }}>
            Yahya Khaled
          </span>
          <span style={{ fontSize: 44, fontWeight: 500, color: "#5C3A1F", marginTop: 12 }}>
            Electrical Power &amp; Machines Engineer
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span
            style={{
              fontSize: 22,
              padding: "10px 22px",
              borderRadius: 999,
              border: "1px solid rgba(217,112,26,0.5)",
              background: "rgba(255,255,255,0.6)",
              color: "#9A4A0F",
              fontWeight: 600,
            }}
          >
            AI Solutions · Electrical Design · EdTech
          </span>
        </div>
      </div>
    ),
    { ...size },
  );
}
