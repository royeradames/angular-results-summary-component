import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/* The same bar-chart mark as app/icon.svg, rendered as the 180 x 180 Home Screen icon. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#303b59" }}>
        <svg width="150" height="150" viewBox="0 0 64 64">
          <path d="M12 38h7v14h-7zM23 28h7v24h-7zM34 18h7v34h-7z" fill="#ffffff" />
          <path d="M45 11h7v41h-7z" fill="#c8bdff" />
        </svg>
      </div>
    ),
    size,
  );
}
