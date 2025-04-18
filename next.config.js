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
      // Handle QR code endpoint specifically
      {
        source: '/api/qrcode/:eventCode',
        destination: 'https://fyvbe.onrender.com/api/events/:eventCode/qrcode',
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