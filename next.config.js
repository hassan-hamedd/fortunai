/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    return config;
  },
  swcMinify: true,
};

module.exports = nextConfig;
