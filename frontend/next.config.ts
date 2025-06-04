import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "ts", "tsx", "mdx"],
  trailingSlash: true,
  reactStrictMode: true,
};

export default nextConfig;
