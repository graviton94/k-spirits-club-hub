/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.firebaseapp.com',
      },
      {
        protocol: 'https',
        hostname: '**.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: 'wsrv.nl',
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
      },
      // Legacy Route Redirects
      {
        source: '/reviews',
        destination: '/ko/contents/reviews',
        permanent: true,
      },
      {
        source: '/worldcup',
        destination: '/ko/contents/worldcup',
        permanent: true,
      },
      {
        source: '/perfect-pour',
        destination: '/ko/contents/perfect-pour',
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
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|woff|woff2|ttf|otf|ico)',
        locale: false,
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          }
        ],
      },
    ];
  },
};

module.exports = nextConfig;
