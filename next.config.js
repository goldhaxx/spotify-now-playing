/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
      },
    ],
  },
  env: {
    NEXTAUTH_URL: process.env.NODE_ENV === 'production'
      ? 'https://spotify-now-playing-three-rho.vercel.app'
      : 'http://localhost:3000',
  },
}

module.exports = nextConfig