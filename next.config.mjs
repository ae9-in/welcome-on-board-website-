/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // ── Performance: compiler options ──────────────────────────────────────────
  compiler: {
    // Remove console.log in production for smaller bundles
    removeConsole: process.env.NODE_ENV === 'production' ? { exclude: ['error', 'warn'] } : false,
  },

  // ── Performance: experimental features ─────────────────────────────────────
  experimental: {
    // Optimize package imports so only the icons actually used are bundled
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },

  // ── Performance: image optimization ────────────────────────────────────────
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
  },

  // ── Performance: HTTP headers ───────────────────────────────────────────────
  async headers() {
    return [
      {
        // Cache static JS/CSS assets for 1 year (they are content-hashed by Next.js)
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        // Cache API routes for quiz/general data for 10 minutes
        source: '/api/competitions/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, s-maxage=600, stale-while-revalidate=3600' },
        ],
      },
      {
        // Security headers for all routes
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
