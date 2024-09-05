/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... other configs
  env: {
    NEXTAUTH_URL: 'https://spotify-now-playing-three-rho.vercel.app',
  },
}

module.exports = nextConfig