/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // enables static export for cPanel
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

module.exports = nextConfig;
