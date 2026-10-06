import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = profile.siteTitle;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** 画像に使う文字だけを Google Fonts から取ってくる（日本語を表示するため） */
async function loadFont(text: string) {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@800&text=${encodeURIComponent(text)}`,
      )
    ).text();
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    return await (await fetch(src)).arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const title = profile.siteTitle;
  const sub = profile.catchCopy;
  const font = await loadFont(title + sub + profile.name);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: "linear-gradient(135deg, #e0f2fe 0%, #f2f9ff 50%, #cffafe 100%)",
          fontFamily: font ? "MPlusRounded" : "sans-serif",
          color: "#0f2342",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 84,
            fontWeight: 800,
            backgroundImage: "linear-gradient(90deg, #0277b6, #0b7a99)",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          {font ? title : "mikan's portfolio"}
        </div>
        <div style={{ display: "flex", fontSize: 38 }}>{font ? sub : "Game planner in training"}</div>
        <div
          style={{
            display: "flex",
            marginTop: 12,
            padding: "10px 32px",
            borderRadius: 999,
            fontSize: 30,
            color: "#fff",
            background: "linear-gradient(90deg, #0277b6, #0b7a99)",
          }}
        >
          {profile.name}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: font ? [{ name: "MPlusRounded", data: font, weight: 800, style: "normal" }] : undefined,
    },
  );
}
