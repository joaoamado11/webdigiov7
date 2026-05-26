import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Hero frame sequence is heavy — leave images as-is for now,
  // serve them from public/frames/ as static files.
  reactStrictMode: false,
};

export default nextConfig;
