/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_KEY: process.env.API_KEY,
    REDIS_ENDPOINT: process.env.REDIS_ENDPOINT,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
  },
};

module.exports = nextConfig;
