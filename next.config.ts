import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ["three"],
  images: {
    // Avatars returned by the login API are hosted on dummyjson.com
    remotePatterns: [{ protocol: "https", hostname: "dummyjson.com" }],
  },
};

export default nextConfig;
