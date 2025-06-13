import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'mdx'],
  trailingSlash: true,
  reactStrictMode: true,
  experimental: {
    authInterrupts: true,
  },
  poweredByHeader: false,
};

export default nextConfig;
