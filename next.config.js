const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
  reloadOnOnline: false,
});

module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
});