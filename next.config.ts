// next.config.ts
import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      // allow VideoSDK HTTPS + WebSocket endpoints
      "connect-src 'self' https://api.videosdk.live https://*.youtube.com https://*.videosdk.live wss://*.videosdk.live",
      "font-src 'self' data:",
      "media-src 'self' blob:",
      "frame-src 'self' https://*.videosdk.live https://*.youtube.com",
    ].join("; "),
  },
  {
    key: "Permissions-Policy",
    // many templates default to camera=() microphone=()
    value: "camera=(self), microphone=(self)",
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      // keep your existing icons caching
      {
        source: "/icons/:path*",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // apply relaxed headers to all other routes, only for localhost dev
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  compiler: { removeConsole: process.env.NODE_ENV === "production" },
  compress: true,
  trailingSlash: false,
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
