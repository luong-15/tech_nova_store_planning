/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: {
      sourceMap: false,
    },
    turbopackUseSystemTlsCerts: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: false,
  productionBrowserSourceMaps: false,
  images: {
    unoptimized: true,
  },
}

export default nextConfig
