import { NextConfig } from "next";

/** Vercel-ready Next.js config (no static "export" mode) */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["hotel.amdeconsult.com"],
    unoptimized: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
