import '@repo/env'
import { serverEnv } from '@repo/env'
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./features/i18n/request.ts')

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        hostname: serverEnv.MINIO_HOST,
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['sharp', 'onnxruntime-node'],
  // biome-ignore lint/suspicious/useAwait: change the url path for assets
  async rewrites() {
    return [
      {
        source: '/:locale/images/:path*',
        destination: '/images/:path*',
      },
    ]
  },
}

export default withNextIntl(nextConfig)
