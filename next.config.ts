import type { NextConfig } from 'next';

const apiProxy = process.env.API_PROXY_URL?.trim();
if (apiProxy) {
  const url = new URL(apiProxy);
  if (!['http:', 'https:'].includes(url.protocol) || url.origin !== apiProxy || url.username || url.password) throw new Error('API_PROXY_URL must be an exact HTTP(S) API origin.');
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    return apiProxy ? [{ source: '/api/:path*', destination: apiProxy + '/api/:path*' }] : [];
  },
};

export default nextConfig;

