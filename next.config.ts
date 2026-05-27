import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hero frame sequence is heavy — leave images as-is for now,
  // serve them from public/frames/ as static files.
  reactStrictMode: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
