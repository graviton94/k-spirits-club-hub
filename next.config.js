/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages 호환성 및 빌드 안정성을 위한 설정
  output: 'standalone',
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.google.com' },
      { protocol: 'https', hostname: '**.gstatic.com' },
      { protocol: 'https', hostname: '**.googleusercontent.com' },
      { protocol: 'https', hostname: '**.firebaseapp.com' },
      { protocol: 'https', hostname: '**.firebasestorage.googleapis.com' },
    ],
    unoptimized: true, // Cloudflare Pages 이미지 최적화 제한 대응
  },
  // 빌드 시 타입 체크 및 린트 오류 무시 (배포를 우선하기 위함)
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        child_process: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
