/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/__/auth/handler',
        destination: '/__/auth/handler',
      },
    ];
  },
};

export default nextConfig;
