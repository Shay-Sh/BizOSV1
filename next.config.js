/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'lh3.googleusercontent.com'],
  },
  eslint: {
    dirs: ['app', 'components', 'lib', 'types'],
  },
}

module.exports = nextConfig 