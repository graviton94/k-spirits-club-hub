/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // Cloudflare Pages compatibility
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.firebaseapp.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleapis.com',
      },
    ],
  },
  // 빌드 시 타입 체크 오류 무시
  typescript: { ignoreBuildErrors: true },
  webpack: (config, { isServer }) => {
    // Disable webpack cache ONLY in production to prevent large cache files (>25MB) on Cloudflare Pages
    if (process.env.NODE_ENV === 'production') {
      config.cache = false;
    }

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
  async redirects() {
    return [
      {
        source: '/explore',
        destination: '/ko/explore',
        permanent: true,
      },
      {
        source: '/spirits/:path*',
        destination: '/ko/spirits/:path*',
        permanent: true,
      },
      {
        source: '/me/:path*',
        destination: '/ko/me/:path*',
        permanent: true,
      },
      {
        source: '/cabinet',
        destination: '/ko/cabinet',
        permanent: true,
      },
      {
        source: '/contents/:path*',
        destination: '/ko/contents/:path*',
        permanent: true,
      }
    ];
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
