/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['fyvbe.onrender.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fyvbe.onrender.com',
        port: '',
        pathname: '/api/**',
      },
    ],
  },
  async rewrites() {
    return [
      // Handle QR code endpoint using query parameters
      {
        source: '/api/event-qrcode',
        destination: 'https://fyvbe.onrender.com/api/events/qrcode',
      },
      // Handle event details endpoint using query parameters
      {
        source: '/api/event-details',
        destination: 'https://fyvbe.onrender.com/api/events/details',
      },
      // Handle other API routes
      {
        source: '/api/events/:path*',
        destination: 'https://fyvbe.onrender.com/api/events/:path*',
      },
    ];
  },
}

module.exports = nextConfig 