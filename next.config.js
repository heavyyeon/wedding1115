/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Using local /public images only; keep default loader.
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
