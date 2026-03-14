import { NextConfig } from 'next'
import withRspack from 'next-rspack'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  webpack: config => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })
    return config
  }
}

export default withRspack(nextConfig)
