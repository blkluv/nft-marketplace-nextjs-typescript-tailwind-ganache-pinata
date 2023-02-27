/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains:["gateway.pinata.cloud"],
  }
}

module.exports = {
  async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://app.pinata.cloud/:path*',
        },
      ]
    },
};

module.exports = nextConfig
