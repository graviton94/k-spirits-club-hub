/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Cloudflare Pages compatible settings
  trailingSlash: true,
};

module.exports = nextConfig;
