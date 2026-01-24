/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Cloudflare Pages compatibility
  },
  // 빌드 시 타입 체크 오류 무시
  typescript: { ignoreBuildErrors: true },
  webpack: (config, { isServer }) => {
    // Disable webpack cache to prevent large cache files (>25MB) on Cloudflare Pages
    config.cache = false;

    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        child_process: false,
        tls: false,
        http2: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
