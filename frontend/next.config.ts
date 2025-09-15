import { env } from "@/env";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "25mb",
    },
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  logging: {
    fetches: { fullUrl: true },
  },
  compiler: {
    removeConsole: env.NODE_ENV === "production",
  },
};

export default nextConfig;
