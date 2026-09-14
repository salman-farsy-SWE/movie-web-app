import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "Movie Trails | Watch, Discover & Track Movies";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#06080E",
          backgroundImage:
            "radial-gradient(circle at 50% 35%, rgba(232, 83, 85, 0.28) 0%, rgba(88, 166, 255, 0.16) 45%, rgba(6, 8, 14, 0.98) 85%)",
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
          padding: "40px",
          boxSizing: "border-box",
        }}
      >
        {/* Subtle decorative grid/border frame */}
        <div
          style={{
            position: "absolute",
            top: "24px",
            bottom: "24px",
            left: "24px",
            right: "24px",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "24px",
            display: "flex",
          }}
        />

        {/* Brand Icon SVG Emblem */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "20px",
          }}
        >
          <svg
            width="104"
            height="104"
            viewBox="0 0 512 512"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="16"
              y="16"
              width="480"
              height="480"
              rx="120"
              fill="#141726"
              stroke="#FF4D61"
              strokeWidth="8"
            />
            {/* Red Ribbon */}
            <path
              d="M 106 372 L 106 166 C 106 147 121 132 140 132 C 152 132 163 138 170 148 L 256 264 L 220 312 L 158 226 L 158 372 C 158 385 147 396 132 396 C 118 396 106 385 106 372 Z"
              fill="#E85355"
            />
            {/* Blue Ribbon */}
            <path
              d="M 406 372 L 406 166 C 406 147 391 132 372 132 C 360 132 349 138 342 148 L 256 264 L 292 312 L 354 226 L 354 372 C 354 385 365 396 380 396 C 394 396 406 385 406 372 Z"
              fill="#58A6FF"
            />
            {/* Center Play Arrow */}
            <path
              d="M 234 212 C 234 202 245 196 254 201 L 308 239 C 316 244 316 256 308 261 L 254 299 C 245 304 234 298 234 288 Z"
              fill="#FFFFFF"
            />
            <circle cx="132" cy="180" r="8" fill="#FFFFFF" opacity="0.85" />
            <circle cx="132" cy="240" r="8" fill="#FFFFFF" opacity="0.85" />
            <circle cx="132" cy="300" r="8" fill="#FFFFFF" opacity="0.85" />
            <circle cx="380" cy="180" r="8" fill="#FFFFFF" opacity="0.85" />
            <circle cx="380" cy="240" r="8" fill="#FFFFFF" opacity="0.85" />
            <circle cx="380" cy="300" r="8" fill="#FFFFFF" opacity="0.85" />
          </svg>
        </div>

        {/* Brand Name Title */}
        <div
          style={{
            fontSize: 62,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            marginBottom: "12px",
            color: "#FFFFFF",
            display: "flex",
            textShadow: "0 0 40px rgba(232, 83, 85, 0.4)",
          }}
        >
          Movie Trails
        </div>

        {/* Tagline Description */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: "#94A3B8",
            textAlign: "center",
            maxWidth: "820px",
            marginBottom: "36px",
            lineHeight: 1.4,
            display: "flex",
          }}
        >
          Discover &amp; Watch Movies, TV Shows, HD Trailers and Custom Watchlists
        </div>

        {/* Feature Badges */}
        <div
          style={{
            display: "flex",
            gap: "14px",
            alignItems: "center",
          }}
        >
          <div
            style={{
              padding: "10px 20px",
              backgroundColor: "rgba(232, 83, 85, 0.15)",
              border: "1px solid rgba(232, 83, 85, 0.35)",
              borderRadius: "9999px",
              color: "#FFA8AF",
              fontSize: 17,
              fontWeight: 600,
              display: "flex",
            }}
          >
            🎬 Movies &amp; TV Series
          </div>
          <div
            style={{
              padding: "10px 20px",
              backgroundColor: "rgba(88, 166, 255, 0.15)",
              border: "1px solid rgba(88, 166, 255, 0.35)",
              borderRadius: "9999px",
              color: "#A5D0FF",
              fontSize: 17,
              fontWeight: 600,
              display: "flex",
            }}
          >
            🍿 Official Trailers
          </div>
          <div
            style={{
              padding: "10px 20px",
              backgroundColor: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.18)",
              borderRadius: "9999px",
              color: "#E2E8F0",
              fontSize: 17,
              fontWeight: 600,
              display: "flex",
            }}
          >
            ⭐ Track &amp; Curate
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

